import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useIndexViewModel } from "./useIndexViewModel";

describe("useIndexViewModel", () => {
  it("should initialize with flow closed", () => {
    const { result } = renderHook(() => useIndexViewModel());
    expect(result.current.flowOpen).toBe(false);
  });

  it("should open flow", () => {
    const { result } = renderHook(() => useIndexViewModel());

    act(() => {
      result.current.onOpenFlow();
    });

    expect(result.current.flowOpen).toBe(true);
  });

  it("should close flow", () => {
    const { result } = renderHook(() => useIndexViewModel());

    act(() => {
      result.current.onOpenFlow();
    });
    expect(result.current.flowOpen).toBe(true);

    act(() => {
      result.current.onCloseFlow();
    });
    expect(result.current.flowOpen).toBe(false);
  });
});
