import { describe, expect, it, mock } from "bun:test";
import NoteService from "./note";
import user from "../routes/auth";

const createMockNoteRepo = () => {
  return {
    findById: mock(),
    create: mock(),
    findNotes: mock(),
    countNotes: mock(),
    update: mock(),
    delete: mock(),
  };
};

const defaultNoteData = {
  id: 1,
  userId: 10,
  title: "test title",
  content: "test content",
  created_at: new Date(),
  updated_at: null,
};

describe("note service", () => {
  it("should get a single note object contains all properties", async () => {
    const noteRepository = createMockNoteRepo();
    noteRepository.findById.mockResolvedValue(defaultNoteData);
    const noteService = new NoteService(noteRepository);
    const noteId = 5;
    const userId = 10;

    const result = await noteService.getNote(noteId, userId);

    expect(result).toMatchObject({
      id: expect.any(Number),
      userId: expect.any(Number),
      title: expect.any(String),
      content: expect.any(String),
      created_at: expect.any(Date),
      updated_at: null,
    });
  });
  it("should throw an error when note not found", async () => {
    const noteRepository = createMockNoteRepo();
    noteRepository.findById.mockResolvedValue(null);
    const noteService = new NoteService(noteRepository);
    const noteId = 100;
    const userId = 10;

    expect(noteService.getNote(noteId, userId)).rejects.toThrowError(
      "note not found",
    );
  });
  it("should create a new note and updated_at null", async () => {
    const noteRepository = createMockNoteRepo();
    const noteService = new NoteService(noteRepository);
    const noteId = 7;
    const userId = 10;
    const currentDate = new Date("2024-11-07T09:52:01.266Z");
    const newNote = {
      title: "new title",
      content: "new content",
    };

    noteRepository.create.mockResolvedValueOnce({
      id: noteId,
      userId,
      ...newNote,
      created_at: currentDate,
      updated_at: null,
    });
    const result = await noteService.createNote(newNote, userId);

    expect(result).toEqual({
      id: noteId,
      userId,
      ...newNote,
      created_at: currentDate,
      updated_at: null,
    });
    expect(result.updated_at).toBeNull();
  });
  // i think this is bad, and should be separated into another test. but yolo
  it("should return notes pagination with metadata totalNotes, totalPages, hasNext, hasPrev", async () => {
    const noteRepository = createMockNoteRepo();
    const noteService = new NoteService(noteRepository);
    const userId = 8;
    const initialDate = new Date("2024-11-07T09:52:01.266Z");
    const page = 1;
    const limit = 5;
    const totalNotes = 10;
    const notesList = Array.from({ length: limit }, (_, i) => ({
      id: i + 1,
      title: `title ${i + 1}`,
      content: `content ${i + 1}`,
      userId,
      created_at: new Date(initialDate.getTime() + i * 1000),
      updated_at: null,
    }));
    const totalPages = Math.ceil(totalNotes / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    noteRepository.countNotes.mockResolvedValue(totalNotes);
    noteRepository.findNotes.mockResolvedValue(notesList);
    const result = await noteService.getNotes(userId, page, limit);

    expect(result).toMatchObject({
      notesList: expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          userId,
          title: expect.any(String),
          content: expect.any(String),
          created_at: expect.any(Date),
          updated_at: null,
        }),
      ]),
      totalNotes,
      totalPages,
      hasNext,
      hasPrev,
    });
  });
});
