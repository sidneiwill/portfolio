<script setup lang="ts">
import {
  BoxGeometry,
  BufferGeometry,
  Color,
  CylinderGeometry,
  EdgesGeometry,
  ExtrudeGeometry,
  Float32BufferAttribute,
  Group,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Raycaster,
  Scene,
  Shape,
  SphereGeometry,
  TorusGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";
import { LineSegments2 } from "three/addons/lines/LineSegments2.js";
import { LineSegmentsGeometry } from "three/addons/lines/LineSegmentsGeometry.js";
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import type { Theme } from "@/shared/theme/useTheme";
import type { SectionId } from "./content";

const props = defineProps<{
  section: SectionId;
  stackIds: string[];
  theme: Theme;
  reducedMotion: boolean;
  paused: boolean;
  selected: string | null;
  reset: number;
  label: string;
  interactive: boolean;
}>();
const emit = defineEmits<{
  select: [id: string];
  hover: [id: string | null];
  failed: [];
  open: [];
}>();
const host = ref<HTMLDivElement>();
const canOpen = computed(() => props.interactive && props.section === "home");
let renderer: WebGLRenderer | undefined;
let observer: ResizeObserver | undefined;
let frame = 0;
let dead = false;
const scene = new Scene();
const camera = new PerspectiveCamera(36, 1, 0.1, 100);
camera.position.set(0, 0, 9);
const root = new Group();
const shell = new Group();
root.add(shell);
scene.add(root);
root.rotation.set(0.28, 0.55, 0.04);
let shellTarget = 0;
let shellProgress = 0;
let deformationTime = 0;
const goldenRatio = (1 + Math.sqrt(5)) / 2;
const polyhedronVertices = [-1, 1].flatMap((a) =>
  [-1, 1].flatMap((b) => [
    [0, a, b * goldenRatio],
    [a, b * goldenRatio, 0],
    [b * goldenRatio, 0, a],
  ]),
);
const projectedVertices = new Float32Array(12 * 3);
const edgeLengths = new Float64Array(30);
const interiors = new Map<string, Group>();
const pickable: Mesh[] = [];
const materials: LineMaterial[] = [];
const stackModels: Group[] = [];
let chipLid: Group;
let chipCore: Group;
let chipTraces: LineSegments2;
const tracePositions = new Float32Array(16 * 12);
const raycaster = new Raycaster();
const pointer = new Vector2();
const accents = [0xfabd2f, 0x83a598, 0xb8bb26];
const lightAccents = [0xb57614, 0x076678, 0x79740e];
let intro = 0;
let lastTime = 0;
let active: Group | undefined;
let dragging:
  | { id: number; x: number; y: number; distance: number }
  | undefined;

function wire(
  geometry: BufferGeometry,
  index: number,
  parent: Group,
  id?: string,
  edges = true,
  thick = false,
) {
  const material = new LineMaterial({
    color: accents[index % 3],
    transparent: true,
    linewidth: thick ? 2 : 1.5,
  });
  const source = edges ? new EdgesGeometry(geometry) : geometry;
  const thickGeometry = new LineSegmentsGeometry().setPositions(
    source.getAttribute("position").array as Float32Array,
  );
  const lines = new LineSegments2(thickGeometry, material);
  source.dispose();
  material.userData.paletteIndex = index % 3;
  material.userData.part = id ?? parent.userData.part;
  materials.push(material);
  parent.add(lines);
  if (id) {
    const mesh = new Mesh(geometry, new MeshBasicMaterial({ visible: false }));
    mesh.userData.part = id;
    mesh.userData.lines = lines;
    parent.add(mesh);
    pickable.push(mesh);
  } else if (edges) geometry.dispose();
  return lines;
}

function segment(
  points: number[],
  index: number,
  parent: Group,
  thick = false,
) {
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(points, 3));
  return wire(geometry, index, parent, undefined, false, thick);
}

function part(
  parent: Group,
  id: string,
  geometry: BufferGeometry,
  index: number,
  position: Vector3,
) {
  const group = new Group();
  group.position.copy(position);
  parent.add(group);
  wire(geometry, index, group, id);
  return group;
}

function updatePolyhedron() {
  for (const [index, vertex] of polyhedronVertices.entries()) {
    const phase = index * 2.39996;
    const pulse = 0.68 + Math.sin(deformationTime * 0.7 + phase) * 0.1;
    projectedVertices.set(
      vertex.map(
        (coordinate, axis) =>
          coordinate * pulse +
          Math.sin(deformationTime * (0.8 + axis * 0.17) + phase + axis * 1.7) *
            0.2,
      ),
      index * 3,
    );
  }
  for (const edge of shell.children) {
    const line = edge.children[0] as LineSegments2;
    const [start, end] = line.userData.vertices as [number, number];
    const positions = line.userData.positions as Float32Array;
    positions.set(projectedVertices.subarray(start * 3, start * 3 + 3));
    positions.set(projectedVertices.subarray(end * 3, end * 3 + 3), 3);
    line.geometry.setPositions(positions);
  }
}

function shadePolyhedron() {
  let shortest = Number.POSITIVE_INFINITY;
  let longest = 0;
  for (const [index, edge] of shell.children.entries()) {
    const line = edge.children[0] as LineSegments2;
    const positions = line.userData.positions as Float32Array;
    const length = Math.hypot(
      positions[3] - positions[0],
      positions[4] - positions[1],
      positions[5] - positions[2],
    );
    edgeLengths[index] = length;
    shortest = Math.min(shortest, length);
    longest = Math.max(longest, length);
  }
  const palette = props.theme === "light" ? lightAccents : accents;
  for (const [index, edge] of shell.children.entries()) {
    const line = edge.children[0] as LineSegments2;
    const t = (edgeLengths[index] - shortest) / (longest - shortest || 1);
    const shade = 1 - 0.75 * t * t * (3 - 2 * t);
    line.material.userData.shade = shade;
    line.material.userData.length = edgeLengths[index];
    line.material.color.setHex(palette[0]).multiplyScalar(shade);
  }
}

function build() {
  // Icosahedron topology: each of the 12 vertices joins five neighbors.
  for (const [vertex, point] of polyhedronVertices.entries()) {
    for (
      let neighbor = vertex + 1;
      neighbor < polyhedronVertices.length;
      neighbor++
    ) {
      const distanceSquared = point.reduce(
        (total, coordinate, axis) =>
          total + (coordinate - polyhedronVertices[neighbor][axis]) ** 2,
        0,
      );
      if (Math.abs(distanceSquared - 4) > 0.001) continue;
      const edge = new Group();
      const line = segment([0, 0, 0, 0, 0, 0], 0, edge, true);
      line.userData.vertices = [vertex, neighbor];
      line.userData.positions = new Float32Array(6);
      shell.add(edge);
    }
  }
  updatePolyhedron();
  const programming = new Group();
  for (const [i, id] of props.stackIds.entries()) {
    const model = new Group();
    const lastRow = i >= 6;
    model.position.set(
      lastRow ? (i - 6) * 0.95 : ((i % 3) - 1) * 0.95,
      0.95 - Math.floor(i / 3) * 0.95,
      0,
    );
    model.userData.part = id;
    model.userData.baseY = model.position.y;
    programming.add(model);
    stackModels.push(model);
    const box = (
      width: number,
      height: number,
      depth: number,
      x = 0,
      y = 0,
      z = 0,
    ) => {
      const lines = wire(new BoxGeometry(width, height, depth), i, model);
      lines.position.set(x, y, z);
      return lines;
    };
    switch (i) {
      case 0: // Backend: server racks and indicator lights.
        for (const y of [-0.19, 0, 0.19]) {
          box(0.52, 0.13, 0.32, 0, y);
          segment([-0.17, y, 0.17, -0.09, y, 0.17], i, model);
        }
        break;
      case 1: // Frontend: layered windows, with a title bar.
        for (let layer = 0; layer < 3; layer++) {
          const offset = (layer - 1) * 0.1;
          const window = box(0.46, 0.38, 0.02, offset, offset, offset);
          window.userData.layer = layer;
        }
        segment([-0.13, 0.19, 0.12, 0.33, 0.19, 0.12], i, model);
        break;
      case 2: // Data: cylindrical storage with stacked rings.
        wire(new CylinderGeometry(0.23, 0.23, 0.48, 16), i, model);
        for (const y of [-0.24, 0, 0.24]) {
          const ring = wire(new TorusGeometry(0.23, 0.008, 3, 24), i, model);
          ring.rotation.x = Math.PI / 2;
          ring.position.y = y;
        }
        break;
      case 3: // Mobile: device, inset screen and home indicator.
        box(0.3, 0.58, 0.07);
        box(0.24, 0.43, 0.01, 0, 0.02, 0.04);
        segment([-0.05, -0.25, 0.04, 0.05, -0.25, 0.04], i, model);
        break;
      case 4: {
        // DevOps: connected nodes in a continuous cycle.
        const cycle = wire(new TorusGeometry(0.23, 0.008, 3, 24), i, model);
        cycle.userData.spin = true;
        const points: number[] = [];
        for (let node = 0; node < 4; node++) {
          const angle = (node * Math.PI) / 2;
          const next = angle + Math.PI / 2;
          const x = Math.cos(angle) * 0.23;
          const y = Math.sin(angle) * 0.23;
          box(0.1, 0.1, 0.1, x, y);
          points.push(x, y, 0, Math.cos(next) * 0.23, Math.sin(next) * 0.23, 0);
        }
        segment(points, i, model);
        break;
      }
      case 5: // Practice: interlocking modules.
        box(0.24, 0.24, 0.24, -0.13, -0.13);
        box(0.24, 0.24, 0.24, 0.13, -0.13);
        box(0.24, 0.24, 0.24, 0, 0.13);
        break;
      default: {
        // Testing/security: padlock body, curved shackle and keyhole.
        box(0.46, 0.32, 0.2, 0, -0.12);
        const shackle = wire(
          new TorusGeometry(0.16, 0.025, 4, 16, Math.PI),
          i,
          model,
        );
        shackle.position.y = 0.08;
        for (const x of [-0.16, 0.16]) box(0.05, 0.08, 0.05, x, 0.04);
        const keyhole = wire(new TorusGeometry(0.04, 0.004, 3, 12), i, model);
        keyhole.position.set(0, -0.08, 0.105);
        segment([0, -0.12, 0.105, 0, -0.2, 0.105], i, model);
        break;
      }
    }
    // One generous hit area per topic; all decorative geometry shares its id.
    const hit = new Mesh(
      new BoxGeometry(0.68, 0.68, 0.5),
      new MeshBasicMaterial({ visible: false }),
    );
    hit.userData.part = id;
    model.add(hit);
    pickable.push(hit);
  }
  interiors.set("programming", programming);

  const reverse = new Group();
  const casing = new Shape();
  casing.moveTo(-0.5, -0.95);
  casing.lineTo(0.5, -0.95);
  casing.lineTo(0.5, 0.95);
  casing.lineTo(0.16, 0.95);
  casing.bezierCurveTo(0.16, 0.72, -0.16, 0.72, -0.16, 0.95);
  casing.lineTo(-0.5, 0.95);
  casing.closePath();
  const lidGeometry = new ExtrudeGeometry(casing, {
    depth: 0.26,
    bevelEnabled: false,
    curveSegments: 8,
  });
  lidGeometry.translate(0, 0, -0.13);
  lidGeometry.rotateX(Math.PI / 2);
  chipLid = part(reverse, "layers", lidGeometry, 0, new Vector3(0, 0.12, 0));
  const circuit = part(
    reverse,
    "analysis",
    new BoxGeometry(0.9, 0.08, 1.8),
    1,
    new Vector3(0, -0.14, 0),
  );
  circuit.userData.part = "analysis";
  for (const side of [-1, 1]) {
    for (let pin = 0; pin < 8; pin++) {
      const z = (pin - 3.5) * 0.22;
      const terminal = new Group();
      terminal.userData.terminal = true;
      terminal.userData.part = "analysis";
      circuit.add(terminal);
      const shoulder = wire(new BoxGeometry(0.3, 0.05, 0.08), 1, terminal);
      shoulder.position.set(side * 0.59, 0, z);
      const leg = wire(new BoxGeometry(0.05, 0.22, 0.08), 1, terminal);
      leg.position.set(side * 0.73, -0.085, z);
    }
  }
  chipCore = part(
    reverse,
    "reconstruction",
    new BoxGeometry(0.36, 0.1, 0.55),
    2,
    new Vector3(0, -0.04, 0),
  );
  chipCore.userData.part = "reconstruction";
  chipTraces = segment(Array.from(tracePositions), 2, reverse);
  chipTraces.material.userData.part = "reconstruction";
  interiors.set("reverse", reverse);

  const modeling = new Group();
  part(
    modeling,
    "faces",
    new BoxGeometry(1.3, 1.3, 1.3, 3, 3, 3),
    1,
    new Vector3(),
  );
  // Grid lines make topology readable, independently of coplanar edge filtering.
  for (const offset of [-0.22, 0.22]) {
    segment(
      [
        -0.65,
        offset,
        0.66,
        0.65,
        offset,
        0.66,
        offset,
        -0.65,
        0.66,
        offset,
        0.65,
        0.66,
      ],
      1,
      modeling,
    );
  }
  part(
    modeling,
    "vertices",
    new SphereGeometry(0.14, 8, 6),
    0,
    new Vector3(-0.65, 0.65, 0.65),
  );
  part(
    modeling,
    "edges",
    new BoxGeometry(1.3, 0.13, 0.13),
    2,
    new Vector3(0, 0.65, 0.65),
  );
  interiors.set("modeling", modeling);

  const electronics = new Group();
  part(
    electronics,
    "connections",
    new BoxGeometry(1.8, 0.12, 1.5),
    2,
    new Vector3(0, -0.3, 0),
  );
  part(
    electronics,
    "components",
    new BoxGeometry(0.6, 0.4, 0.6),
    0,
    new Vector3(-0.35, 0, 0),
  );
  part(
    electronics,
    "signals",
    new BoxGeometry(0.28, 0.4, 0.28),
    1,
    new Vector3(0.6, 0, 0.4),
  );
  for (const z of [-0.22, 0, 0.22])
    segment(
      [-0.35, -0.2, z, 0.35, -0.2, z, 0.35, -0.2, z, 0.6, -0.2, 0.4],
      1,
      electronics,
    );
  interiors.set("electronics", electronics);
  for (const group of interiors.values()) {
    root.add(group);
    group.visible = false;
  }
  updateSection();
  updateColors();
}

function updateColors() {
  const palette = props.theme === "light" ? lightAccents : accents;
  for (const material of materials) {
    material.color
      .setHex(palette[material.userData.paletteIndex])
      .multiplyScalar(material.userData.shade ?? 1);
  }
  for (const material of materials) {
    const id = material.userData.part;
    if (id)
      material.opacity = props.selected && props.selected !== id ? 0.25 : 1;
  }
}

function updateSection() {
  active = interiors.get(props.section);
  for (const group of interiors.values()) group.visible = group === active;
  const opened = props.section !== "home";
  shellTarget = opened ? 1 : 0;
  if (active)
    active.scale.setScalar(props.reducedMotion || props.paused ? 1 : 0.2);
  if (props.reducedMotion || props.paused) shellProgress = shellTarget;
}

function render(time: number) {
  if (dead || !renderer) return;
  const dt = Math.min((time - lastTime) / 1000 || 0, 0.05);
  lastTime = time;
  const moving = !props.paused && !props.reducedMotion;
  if (moving) deformationTime += dt * 0.6;
  if (props.reducedMotion) deformationTime = 0;
  if (shell.visible || props.section === "home") updatePolyhedron();
  intro = moving ? Math.min(intro + dt / 0.9, 1) : 1;
  const t = intro - 1;
  const ease = 1 + 2.70158 * t * t * t + 1.70158 * t * t;
  root.position.y = -4 * (1 - ease);
  root.scale.setScalar(0.55 + 0.45 * ease);
  shellProgress = moving
    ? shellProgress +
      Math.sign(shellTarget - shellProgress) *
        Math.min(Math.abs(shellTarget - shellProgress), dt / 1.1)
    : shellTarget;
  const shellEase = shellProgress * shellProgress * (3 - 2 * shellProgress);
  shell.scale.setScalar(1 + shellEase * 0.8);
  shell.visible = shellProgress < 1;
  for (const edge of shell.children) {
    const line = edge.children[0] as LineSegments2;
    line.material.opacity = 1 - shellEase;
  }
  if (active) {
    const scale =
      props.reducedMotion || props.paused
        ? 1
        : active.scale.x + (1 - active.scale.x) * (1 - Math.exp(-dt * 8));
    active.scale.setScalar(scale);
  }
  if (active === interiors.get("reverse")) {
    const reconstructing = props.selected === "reconstruction";
    const lidTarget =
      reconstructing || props.selected === "layers" ? 0.95 : 0.72;
    const coreTarget = reconstructing ? 0.36 : -0.04;
    const blend = moving ? 1 - Math.exp(-dt * 4) : 1;
    chipLid.position.y += (lidTarget - chipLid.position.y) * blend;
    chipCore.position.y += (coreTarget - chipCore.position.y) * blend;
    for (const [index, side] of [-1, 1].entries()) {
      for (let pin = 0; pin < 8; pin++) {
        const z = (pin - 3.5) * 0.22;
        const coreZ = (pin - 3.5) * 0.065;
        tracePositions.set(
          [
            side * 0.44,
            -0.09,
            z,
            side * 0.28,
            -0.09,
            z,
            side * 0.28,
            -0.09,
            z,
            side * 0.18,
            chipCore.position.y,
            coreZ,
          ],
          (index * 8 + pin) * 12,
        );
      }
    }
    chipTraces.geometry.setPositions(tracePositions);
    chipCore.scale.setScalar(reconstructing ? 1.08 : 1);
  }
  if (active === interiors.get("programming")) {
    for (const [index, model] of stackModels.entries()) {
      const target =
        props.selected === model.userData.part
          ? 1.15
          : props.selected
            ? 0.92
            : 1;
      model.scale.setScalar(
        moving
          ? model.scale.x + (target - model.scale.x) * (1 - Math.exp(-dt * 8))
          : target,
      );
      if (!props.paused) {
        model.position.y =
          model.userData.baseY +
          (moving ? Math.sin(time / 1200 + index) * 0.025 : 0);
        model.rotation.y = moving ? Math.sin(time / 1800 + index) * 0.12 : 0;
        for (const child of model.children) {
          if (child.userData.spin) child.rotation.z = moving ? time / 5000 : 0;
          if (child.userData.layer !== undefined) {
            const offset = child.userData.layer - 1;
            child.position.z =
              offset * (0.1 + (moving ? Math.sin(time / 1500) * 0.025 : 0));
          }
        }
      }
    }
  } else if (moving && !dragging && props.section !== "home")
    root.rotation.y += dt * 0.13;
  if (moving && active && active === interiors.get("electronics")) {
    active.children.forEach((child, i) => {
      if (child instanceof LineSegments2)
        child.material.opacity = 0.55 + Math.sin(time / 300 + i) * 0.4;
    });
  }
  if (shell.visible) shadePolyhedron();
  renderer.render(scene, camera);
  if (!document.hidden) frame = requestAnimationFrame(render);
}

function down(event: PointerEvent) {
  if (event.button !== 0) return;
  dragging = {
    id: event.pointerId,
    x: event.clientX,
    y: event.clientY,
    distance: 0,
  };
  host.value?.setPointerCapture(event.pointerId);
}
function move(event: PointerEvent) {
  if (!dragging) {
    const hit = hitAt(event);
    emit("hover", hit?.object.userData.part ?? null);
    return;
  }
  if (dragging.id !== event.pointerId) return;
  const dx = event.clientX - dragging.x;
  const dy = event.clientY - dragging.y;
  dragging.distance += Math.abs(dx) + Math.abs(dy);
  root.rotation.y += dx * 0.008;
  root.rotation.x = Math.max(-1.2, Math.min(1.2, root.rotation.x + dy * 0.008));
  dragging.x = event.clientX;
  dragging.y = event.clientY;
}
function up(event: PointerEvent) {
  if (!dragging || dragging.id !== event.pointerId) return;
  const click = dragging.distance < 8;
  dragging = undefined;
  if (host.value?.hasPointerCapture(event.pointerId))
    host.value.releasePointerCapture(event.pointerId);
  if (!click) return;
  if (canOpen.value) {
    emit("open");
    return;
  }
  const hit = hitAt(event);
  if (hit) emit("select", hit.object.userData.part);
}
function hitAt(event: PointerEvent) {
  if (!host.value || !active) return;
  const bounds = host.value.getBoundingClientRect();
  if (!bounds.width || !bounds.height) return;
  pointer.set(
    ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
    (-(event.clientY - bounds.top) / bounds.height) * 2 + 1,
  );
  raycaster.setFromCamera(pointer, camera);
  return raycaster.intersectObjects(
    pickable.filter((mesh) => mesh.parent?.parent === active),
  )[0];
}

function visibility() {
  cancelAnimationFrame(frame);
  if (!document.hidden && !dead) {
    lastTime = performance.now();
    frame = requestAnimationFrame(render);
  }
}
function lost(event: Event) {
  event.preventDefault();
  cancelAnimationFrame(frame);
  emit("failed");
}
watch(() => props.section, updateSection);
watch(() => [props.theme, props.selected], updateColors);
watch(() => [props.reducedMotion, props.paused], updateSection);
watch(
  () => props.reset,
  () => root.rotation.set(0.28, 0.55, 0.04),
);
function keydown(event: KeyboardEvent) {
  if (!canOpen.value || (event.key !== "Enter" && event.key !== " ")) return;
  event.preventDefault();
  emit("open");
}
onMounted(() => {
  if (!host.value) return;
  try {
    renderer = new WebGLRenderer({ alpha: true, antialias: true });
    renderer.setClearColor(new Color(0), 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.domElement.setAttribute("aria-hidden", "true");
    renderer.domElement.addEventListener("webglcontextlost", lost);
    host.value.append(renderer.domElement);
    build();
    const resize = () => {
      if (!host.value || !renderer) return;
      const { width, height } = host.value.getBoundingClientRect();
      renderer.setSize(Math.max(width, 1), Math.max(height, 1), false);
      camera.aspect = Math.max(width, 1) / Math.max(height, 1);
      camera.position.z = Math.max(8, 5.7 / camera.aspect);
      camera.updateProjectionMatrix();
    };
    resize();
    observer = new ResizeObserver(resize);
    observer.observe(host.value);
    document.addEventListener("visibilitychange", visibility);
    frame = requestAnimationFrame(render);
  } catch {
    emit("failed");
  }
});
onBeforeUnmount(() => {
  dead = true;
  cancelAnimationFrame(frame);
  observer?.disconnect();
  document.removeEventListener("visibilitychange", visibility);
  renderer?.domElement.removeEventListener("webglcontextlost", lost);
  const geometries = new Set<BufferGeometry>();
  scene.traverse((object) => {
    if (object instanceof Mesh) {
      geometries.add(object.geometry);
      const list = Array.isArray(object.material)
        ? object.material
        : [object.material];
      for (const material of list) material.dispose();
    }
  });
  for (const geometry of geometries) geometry.dispose();
  renderer?.domElement.remove();
  renderer?.dispose();
});
</script>

<template>
  <div ref="host" class="cube-canvas" :aria-label="canOpen ? label : undefined"
    :role="canOpen ? 'button' : 'img'" :tabindex="canOpen ? 0 : undefined"
    @keydown="keydown" @pointerdown="down" @pointermove="move" @pointerup="up" @pointercancel="dragging = undefined" @pointerleave="emit('hover', null)" />
</template>
