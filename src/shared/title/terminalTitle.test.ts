import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { startTerminalTitle } from "./terminalTitle";

describe("startTerminalTitle", () => {
  let reduced = false;
  let stop: () => void = () => {};

  beforeEach(() => {
    vi.useFakeTimers();
    reduced = false;
    vi.stubGlobal("matchMedia", () => ({
      get matches() {
        return reduced;
      },
    }));
  });

  afterEach(() => {
    stop();
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("blinks the cursor every half second", () => {
    stop = startTerminalTitle();
    expect(document.title).toBe("sidnei@william ▌");
    vi.advanceTimersByTime(500);
    expect(document.title).toBe("sidnei@william");
    vi.advanceTimersByTime(500);
    expect(document.title).toBe("sidnei@william ▌");
  });

  it("keeps the cursor solid with reduced motion or a hidden tab", () => {
    reduced = true;
    stop = startTerminalTitle();
    vi.advanceTimersByTime(1500);
    expect(document.title).toBe("sidnei@william ▌");

    reduced = false;
    const hidden = vi.spyOn(document, "hidden", "get").mockReturnValue(true);
    vi.advanceTimersByTime(1500);
    expect(document.title).toBe("sidnei@william ▌");
    hidden.mockRestore();
  });
});
