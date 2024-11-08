import { describe, it, test } from "bun:test";
import { Hono } from "hono";
import note from "./note";

const app = new Hono().basePath("/api/v1");
app.route("/notes", note);

const mockGetNote = {
  noteId: 69, // nice
  userId: 1, // pertamax
  title: "test title",
  contend: "test content",
};

describe("notes routes", () => {
  it("should get single note from GET /notes/:id", async () => {});
});
