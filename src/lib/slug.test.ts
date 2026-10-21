import { describe, expect, it } from "vitest";
import { slugify, findBoardBySlug } from "./slug";
import type { Board } from "@/types/kanban";

function makeBoard(id: string, name: string): Board {
  return { id, name, columns: [] };
}

describe("slugify", () => {
  it("lowercases and dashes spaces", () => {
    expect(slugify("Platform Launch")).toBe("platform-launch");
  });

  it("strips non-alphanumeric characters", () => {
    expect(slugify("Roadmap & Plans!")).toBe("roadmap-plans");
  });

  it("collapses repeated separators and trims leading/trailing dashes", () => {
    expect(slugify("  --Multiple   Spaces--  ")).toBe("multiple-spaces");
  });
});

describe("findBoardBySlug", () => {
  const boards = [
    makeBoard("1", "Platform Launch"),
    makeBoard("2", "Marketing Plan"),
  ];

  it("finds the board whose slugified name matches", () => {
    expect(findBoardBySlug(boards, "marketing-plan")).toEqual(boards[1]);
  });

  it("returns undefined when no board matches", () => {
    expect(findBoardBySlug(boards, "does-not-exist")).toBeUndefined();
  });
});
