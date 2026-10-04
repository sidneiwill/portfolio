import {
  BufferGeometry,
  type Group,
  Material,
  type Mesh,
  type PerspectiveCamera,
  type Scene,
  Vector3,
} from "three";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";
import type { LineSegments2 } from "three/addons/lines/LineSegments2.js";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  type App,
  createApp,
  defineComponent,
  h,
  nextTick,
  reactive,
} from "vue";
import CubeScene from "./CubeScene.vue";
import type { SectionId } from "./content";

const rendererState = vi.hoisted(() => ({
  fail: false,
  instances: [] as {
    domElement: HTMLCanvasElement;
    setSize: ReturnType<typeof vi.fn>;
    dispose: ReturnType<typeof vi.fn>;
    render: ReturnType<typeof vi.fn>;
  }[],
}));

vi.mock("three", async (importOriginal) => {
  const actual = await importOriginal<typeof import("three")>();
  class Renderer {
    domElement = document.createElement("canvas");
    setClearColor = vi.fn();
    setPixelRatio = vi.fn();
    setSize = vi.fn();
    dispose = vi.fn();
    render = vi.fn((scene: Scene, camera: PerspectiveCamera) => {
      scene.updateMatrixWorld();
      camera.updateMatrixWorld();
    });
    constructor() {
      if (rendererState.fail) throw new Error("WebGL unavailable");
      rendererState.instances.push(this);
    }
  }
  return { ...actual, WebGLRenderer: Renderer };
});

describe("CubeScene lifecycle and interaction", () => {
  let app: App;
  let container: HTMLDivElement;
  let mounted: boolean;
  let resize: ResizeObserverCallback;
  let disconnect: ReturnType<typeof vi.fn>;
  let frames: Map<number, FrameRequestCallback>;
  let nextFrame: number;
  let failed: ReturnType<typeof vi.fn>;
  let selected: ReturnType<typeof vi.fn>;
  let props: {
    section: SectionId;
    stackIds: string[];
    theme: "dark" | "light";
    reducedMotion: boolean;
    paused: boolean;
    selected: string | null;
    reset: number;
    label: string;
    interactive: boolean;
  };

  beforeEach(() => {
    rendererState.fail = false;
    rendererState.instances.length = 0;
    mounted = false;
    frames = new Map();
    nextFrame = 0;
    disconnect = vi.fn();
    failed = vi.fn();
    selected = vi.fn();
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      frames.set(++nextFrame, callback);
      return nextFrame;
    });
    vi.stubGlobal("cancelAnimationFrame", (id: number) => frames.delete(id));
    vi.stubGlobal(
      "ResizeObserver",
      class {
        constructor(callback: ResizeObserverCallback) {
          resize = callback;
        }
        observe = vi.fn();
        disconnect = disconnect;
      },
    );
    props = reactive({
      section: "home",
      stackIds: Array.from({ length: 7 }, (_, index) => `stack-${index}`),
      theme: "dark",
      reducedMotion: true,
      paused: false,
      selected: null,
      reset: 0,
      label: "Rotate the cube",
      interactive: true,
    });
    container = document.createElement("div");
    document.body.append(container);
    app = createApp(
      defineComponent({
        setup: () => () =>
          h(CubeScene, { ...props, onFailed: failed, onSelect: selected }),
      }),
    );
  });

  afterEach(() => {
    if (mounted) app.unmount();
    container.remove();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  function mount() {
    app.mount(container);
    mounted = true;
    const host = container.querySelector<HTMLDivElement>(
      ".cube-canvas",
    ) as HTMLDivElement;
    vi.spyOn(host, "getBoundingClientRect").mockReturnValue(
      new DOMRect(0, 0, 600, 600),
    );
    if (!rendererState.fail) resize([], {} as ResizeObserver);
    return host;
  }

  function frame(time = 50) {
    const pending = [...frames.values()];
    frames.clear();
    for (const callback of pending) callback(time);
  }

  function rendered() {
    const renderer = rendererState.instances[0];
    if (!renderer) throw new Error("Renderer missing");
    const call = renderer.render.mock.lastCall as
      | [Scene, PerspectiveCamera]
      | undefined;
    if (!call) throw new Error("Scene has not rendered");
    return {
      renderer,
      scene: call[0],
      camera: call[1],
      root: call[0].children[0] as Group,
    };
  }

  function pointer(host: HTMLElement, type: string, x: number, y: number) {
    const event = new MouseEvent(type, { clientX: x, clientY: y, button: 0 });
    Object.defineProperty(event, "pointerId", { value: 1 });
    host.dispatchEvent(event);
  }

  it("reports unavailable WebGL and context loss for the HTML fallback", () => {
    rendererState.fail = true;
    mount();
    expect(failed).toHaveBeenCalledOnce();
    expect(frames.size).toBe(0);
    app.unmount();
    mounted = false;

    rendererState.fail = false;
    app = createApp(CubeScene, { ...props, onFailed: failed });
    mount();
    const event = new Event("webglcontextlost", { cancelable: true });
    rendererState.instances[0]?.domElement.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    expect(failed).toHaveBeenCalledTimes(2);
    expect(frames.size).toBe(0);
  });

  it("shows the cube centered with reduced motion and closes after the latest rapid selection", async () => {
    mount();
    frame();
    const { root } = rendered();
    expect(container.querySelector("canvas")).toBe(
      rendererState.instances[0]?.domElement,
    );
    expect(container.querySelector("table")).toBeNull();
    const shell = root.children[0] as Group;
    for (const face of shell.children) {
      const outline = face.children[0] as LineSegments2;
      expect(outline.material).toBeInstanceOf(LineMaterial);
      expect(outline.material.dashed).toBe(false);
      expect(outline.material.linewidth).toBeGreaterThan(0);
    }
    root.traverse((object) => {
      const material = (object as LineSegments2).material;
      if (material instanceof LineMaterial) expect(material.dashed).toBe(false);
    });
    expect(root.position.y).toBeCloseTo(0);
    expect(root.scale.x).toBe(1);
    expect(shell.children.every((face) => face.position.length() === 0)).toBe(
      true,
    );

    props.section = "programming";
    await nextTick();
    frame(100);
    expect(shell.scale.x).toBe(1.8);
    expect(shell.visible).toBe(false);
    expect(
      root.children.slice(1).filter((group) => group.visible),
    ).toHaveLength(1);

    props.section = "reverse";
    props.section = "electronics";
    props.section = "home";
    await nextTick();
    frame(150);
    expect(shell.children.every((face) => face.position.length() === 0)).toBe(
      true,
    );
    expect(shell.scale.x).toBe(1);
    expect(shell.visible).toBe(true);
    expect(root.children.slice(1).every((group) => !group.visible)).toBe(true);
  });

  it("selects actual interior geometry by raycast and treats dragging as rotation", async () => {
    props.section = "programming";
    const host = mount();
    host.setPointerCapture = vi.fn();
    host.hasPointerCapture = vi.fn(() => false);
    vi.spyOn(host, "getBoundingClientRect").mockReturnValue(
      new DOMRect(0, 0, 600, 600),
    );
    resize([], {} as ResizeObserver);
    frame();
    const { root, scene, camera } = rendered();
    let logic: Mesh | undefined;
    scene.traverse((object) => {
      if (object.userData.part === "stack-4") logic = object as Mesh;
    });
    const cubes: Mesh[] = [];
    scene.traverse((object) => {
      if (
        object.type === "Mesh" &&
        props.stackIds.includes(object.userData.part)
      )
        cubes.push(object as Mesh);
    });
    expect(cubes).toHaveLength(props.stackIds.length);
    expect(
      new Set(cubes.map((cube) => cube.parent?.position.toArray().join(",")))
        .size,
    ).toBe(7);
    for (const cube of cubes) {
      expect(
        cube.parent?.position
          .toArray()
          .every((coordinate) => Math.abs(coordinate) <= 0.95),
      ).toBe(true);
    }
    if (!logic) throw new Error("Logic geometry missing");
    const projected = logic.getWorldPosition(new Vector3()).project(camera);
    const x = (projected.x + 1) * 300;
    const y = (1 - projected.y) * 300;
    pointer(host, "pointerdown", x, y);
    pointer(host, "pointerup", x, y);
    expect(selected).toHaveBeenLastCalledWith("stack-4");

    selected.mockClear();
    const rotation = root.rotation.y;
    pointer(host, "pointerdown", x, y);
    pointer(host, "pointermove", x + 30, y + 10);
    pointer(host, "pointerup", x + 30, y + 10);
    expect(root.rotation.y).not.toBe(rotation);
    expect(selected).not.toHaveBeenCalled();
    props.reset++;
    await nextTick();
    expect(root.rotation.y).toBeCloseTo(rotation);
  });

  it("gives stack topics distinct geometry and focuses the selected model", async () => {
    props.section = "programming";
    mount();
    frame();
    const { root } = rendered();
    const programming = root.children.find(
      (group) => group !== root.children[0] && group.visible,
    ) as Group;
    expect(programming.children).toHaveLength(7);
    const signatures = programming.children.map((model) =>
      model.children
        .filter((child) => child.type === "LineSegments2")
        .map((child) =>
          Array.from(
            (child as LineSegments2).geometry.getAttribute("instanceStart")
              .array,
          ).join(","),
        )
        .join("/"),
    );
    expect(new Set(signatures).size).toBe(7);
    props.selected = "stack-2";
    await nextTick();
    frame(100);
    for (const model of programming.children) {
      const focused = model.userData.part === props.selected;
      expect(model.scale.x).toBe(focused ? 1.15 : 0.92);
      for (const child of model.children) {
        if (child.type === "LineSegments2")
          expect((child as LineSegments2).material.opacity).toBe(
            focused ? 1 : 0.25,
          );
      }
    }
    const positions = programming.children.map((model) =>
      model.position.toArray(),
    );
    frame(500);
    expect(
      programming.children.map((model) => model.position.toArray()),
    ).toEqual(positions);
    props.selected = null;
    await nextTick();
    frame(550);
    expect(programming.children.every((model) => model.scale.x === 1)).toBe(
      true,
    );
  });

  it("keeps each reverse-engineering chip part selectable", () => {
    props.section = "reverse";
    const host = mount();
    host.setPointerCapture = vi.fn();
    host.hasPointerCapture = vi.fn(() => false);
    frame();
    const { scene, camera } = rendered();
    for (const id of ["layers", "analysis", "reconstruction"]) {
      let piece: Mesh | undefined;
      scene.traverse((object) => {
        if (object.type === "Mesh" && object.userData.part === id)
          piece = object as Mesh;
      });
      if (!piece) throw new Error(`Missing chip part: ${id}`);
      expect(piece.geometry.type).toBe(
        id === "layers" ? "ExtrudeGeometry" : "BoxGeometry",
      );
      const point = (
        id === "analysis"
          ? piece.localToWorld(new Vector3(0.32, 0.04, 0.65))
          : piece.getWorldPosition(new Vector3())
      ).project(camera);
      const x = (point.x + 1) * 300;
      const y = (1 - point.y) * 300;
      pointer(host, "pointerdown", x, y);
      pointer(host, "pointerup", x, y);
      expect(selected).toHaveBeenLastCalledWith(id);
    }
  });

  it("keeps all sixteen chip terminals fixed while separating and reconstructing its layers", async () => {
    props.section = "reverse";
    mount();
    frame();
    const { scene } = rendered();
    const terminals: Group[] = [];
    const parts = new Map<string, Group>();
    scene.traverse((object) => {
      if (object.userData.terminal) terminals.push(object as Group);
      if (
        object.type === "Mesh" &&
        ["layers", "analysis", "reconstruction"].includes(object.userData.part)
      )
        parts.set(object.userData.part, object.parent as Group);
    });
    expect(terminals).toHaveLength(16);
    const positions = terminals.map((terminal) =>
      terminal.children.map((child) =>
        child.getWorldPosition(new Vector3()).toArray(),
      ),
    );
    const lid = parts.get("layers") as Group;
    const core = parts.get("reconstruction") as Group;
    expect(lid.position.y).toBeCloseTo(0.72);
    props.selected = "analysis";
    await nextTick();
    frame(100);
    expect(core.position.y).toBeCloseTo(-0.04);
    props.selected = "reconstruction";
    await nextTick();
    frame(150);
    expect(lid.position.y).toBeCloseTo(0.95);
    expect(lid.position.y - 0.13).toBeGreaterThan(
      core.position.y + 0.05 * core.scale.y,
    );
    expect(core.position.y).toBeCloseTo(0.36);
    props.selected = null;
    await nextTick();
    frame(200);
    expect(core.position.y).toBeCloseTo(-0.04);
    expect(
      terminals.map((terminal) =>
        terminal.children.map((child) =>
          child.getWorldPosition(new Vector3()).toArray(),
        ),
      ),
    ).toEqual(positions);
  });

  it("draws thirty distinct polyhedron edges with darker longer edges across themes and opening states", async () => {
    mount();
    frame();
    const { root } = rendered();
    const shell = root.children[0] as Group;
    expect(shell.children).toHaveLength(30);
    for (const [section, theme] of [
      ["home", "dark"],
      ["electronics", "light"],
      ["home", "light"],
    ] as const) {
      props.section = section;
      props.theme = theme;
      await nextTick();
      frame();
      const edges = new Set<string>();
      const colors = new Set<number>();
      for (const group of shell.children) {
        const line = group.children[0] as LineSegments2;
        const start = line.geometry.getAttribute("instanceStart");
        const end = line.geometry.getAttribute("instanceEnd");
        expect(start.count).toBe(1);
        const endpoints = [start, end]
          .map((attribute) =>
            line
              .localToWorld(new Vector3().fromBufferAttribute(attribute, 0))
              .toArray()
              .map((value) => value.toFixed(6))
              .join(","),
          )
          .sort();
        edges.add(endpoints.join("/"));
        colors.add(line.material.color.getHex());
      }
      expect(edges.size).toBe(30);
      expect(colors.size).toBeGreaterThan(1);
      expect(colors.has(theme === "dark" ? 0xfabd2f : 0xb57614)).toBe(true);
      const materials = shell.children
        .map((edge) => (edge.children[0] as LineSegments2).material)
        .sort((a, b) => a.userData.length - b.userData.length);
      expect(materials[0]?.userData.shade).toBeGreaterThan(
        materials.at(-1)?.userData.shade,
      );
      for (let index = 1; index < materials.length; index++) {
        expect(materials[index]?.userData.shade).toBeLessThanOrEqual(
          materials[index - 1]?.userData.shade,
        );
      }
    }
  });

  it("keeps all twelve polyhedron vertices connected throughout opening and closing", async () => {
    props.reducedMotion = false;
    mount();
    frame();
    const { root } = rendered();
    const shell = root.children[0] as Group;
    for (const section of ["programming", "electronics", "home"] as const) {
      props.section = section;
      await nextTick();
      for (let step = 0; step < 5; step++) {
        frame(100 + step * 50);
        const corners = new Map<string, number>();
        for (const edge of shell.children) {
          const line = edge.children[0] as LineSegments2;
          for (const name of ["instanceStart", "instanceEnd"]) {
            const point = line.localToWorld(
              new Vector3().fromBufferAttribute(
                line.geometry.getAttribute(name),
                0,
              ),
            );
            const key = point
              .toArray()
              .map((value) => value.toFixed(6))
              .join(",");
            corners.set(key, (corners.get(key) ?? 0) + 1);
          }
        }
        expect(corners.size).toBe(12);
        expect([...corners.values()]).toEqual(Array(12).fill(5));
      }
    }
  });

  it("animates a finite organic polyhedron and freezes it for reduced motion", async () => {
    props.reducedMotion = false;
    mount();
    frame(50);
    const { root } = rendered();
    const shell = root.children[0] as Group;
    const coordinates = () =>
      shell.children.flatMap((edge) =>
        Array.from(
          (edge.children[0] as LineSegments2).geometry.getAttribute(
            "instanceStart",
          ).array,
        ),
      );
    const initial = coordinates();
    for (let time = 100; time <= 3000; time += 50) frame(time);
    expect(coordinates()).not.toEqual(initial);
    expect(coordinates().every(Number.isFinite)).toBe(true);
    props.reducedMotion = true;
    await nextTick();
    frame(3050);
    const staticProjection = coordinates();
    frame(4000);
    expect(coordinates()).toEqual(staticProjection);
  });

  it("expands and fades the shell, retaining the interior, then restores it on home", async () => {
    props.reducedMotion = false;
    mount();
    frame(50);
    const { root } = rendered();
    const shell = root.children[0] as Group;
    const material = (shell.children[0]?.children[0] as LineSegments2).material;
    props.section = "programming";
    await nextTick();
    frame(100);
    expect(shell.scale.x).toBeGreaterThan(1);
    expect(material.opacity).toBeLessThan(1);
    expect(material.opacity).toBeGreaterThan(0);
    for (let time = 150; time <= 1400; time += 50) frame(time);
    expect(shell.visible).toBe(false);
    expect(material.opacity).toBe(0);
    expect(
      root.children.slice(1).filter((group) => group.visible),
    ).toHaveLength(1);
    props.section = "electronics";
    await nextTick();
    frame(1450);
    expect(shell.visible).toBe(false);
    props.section = "home";
    await nextTick();
    frame(1500);
    expect(shell.visible).toBe(true);
    expect(material.opacity).toBeGreaterThan(0);
    for (let time = 1550; time <= 2800; time += 50) frame(time);
    expect(shell.scale.x).toBe(1);
    expect(material.opacity).toBe(1);
  });

  it("handles collapsed resize, releases GPU resources, and stops callbacks on unmount", () => {
    const geometryDispose = vi.spyOn(BufferGeometry.prototype, "dispose");
    const materialDispose = vi.spyOn(Material.prototype, "dispose");
    const host = mount();
    vi.spyOn(host, "getBoundingClientRect").mockReturnValue(
      new DOMRect(0, 0, 600, 0),
    );
    resize([], {} as ResizeObserver);
    frame();
    const { renderer, camera } = rendered();
    expect(renderer.setSize).toHaveBeenLastCalledWith(600, 1, false);
    expect(Number.isFinite(camera.aspect)).toBe(true);
    expect(camera.projectionMatrix.elements.every(Number.isFinite)).toBe(true);
    const disposedBeforeUnmount = geometryDispose.mock.calls.length;
    const pending = [...frames.values()];
    app.unmount();
    mounted = false;
    expect(disconnect).toHaveBeenCalledOnce();
    expect(renderer.dispose).toHaveBeenCalledOnce();
    expect(geometryDispose.mock.calls.length).toBeGreaterThan(
      disposedBeforeUnmount,
    );
    expect(materialDispose).toHaveBeenCalled();
    expect(frames.size).toBe(0);
    const renders = renderer.render.mock.calls.length;
    for (const callback of pending) callback(100);
    document.dispatchEvent(new Event("visibilitychange"));
    renderer.domElement.dispatchEvent(new Event("webglcontextlost"));
    expect(renderer.render).toHaveBeenCalledTimes(renders);
    expect(failed).not.toHaveBeenCalled();
    expect(frames.size).toBe(0);
  });
});
