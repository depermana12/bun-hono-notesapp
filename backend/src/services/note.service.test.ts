import { describe, expect, it, mock } from "bun:test";
import NoteService from "./note";

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
  describe("create note", () => {
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
  });

  describe("get note", () => {
    it("should get a single note object contains all properties", async () => {
      const noteRepository = createMockNoteRepo();
      noteRepository.findById.mockResolvedValue(defaultNoteData);
      const noteService = new NoteService(noteRepository);
      const noteId = 5;
      const userId = 10;

      const result = await noteService.getNote(noteId, userId);

      expect(result).toMatchObject(defaultNoteData);
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

    it("should throw an error when userId is invalid", async () => {
      const noteRepository = createMockNoteRepo();
      noteRepository.findById.mockResolvedValue(defaultNoteData);
      const noteService = new NoteService(noteRepository);
      const noteId = 5;
      const userId = -1;

      expect(noteService.getNote(noteId, userId)).rejects.toThrowError(
        "invalid user id",
      );
    });
  });

  describe("get notes", () => {
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
      noteRepository.countNotes.mockReturnValue(totalNotes);
      noteRepository.findNotes.mockResolvedValueOnce(notesList);

      const result = await noteService.getNotes(userId, page, limit);

      expect(noteRepository.countNotes).toBeCalledWith(userId);
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
      });
      expect(totalNotes).toBe(totalNotes);
      expect(result.totalPages).toBe(totalPages);
      expect(result.hasNext).toBe(hasNext);
      expect(result.hasPrev).toBe(hasPrev);
    });

    it("should throw an error when userId is undefined or negative", async () => {
      const noteRepository = createMockNoteRepo();
      const noteService = new NoteService(noteRepository);
      const userId = -1;
      const page = 1;
      const limit = 5;

      expect(noteService.getNotes(userId, page, limit)).rejects.toThrowError(
        "invalid user id",
      );
    });

    it("should throw an error when page or limit query is negative or invalid", async () => {
      const noteRepository = createMockNoteRepo();
      const noteService = new NoteService(noteRepository);
      const userId = 8;
      const page = -2;
      const limit = -10;

      expect(noteService.getNotes(userId, page, limit)).rejects.toThrowError(
        "invalid page or limit",
      );
    });
  });

  describe("update note", () => {
    it("should throw an error when note not found", async () => {
      const noteRepository = createMockNoteRepo();
      const noteService = new NoteService(noteRepository);
      const noteId = 20;
      const userId = 10;
      noteRepository.findById.mockResolvedValueOnce(null);

      expect(
        noteService.updateNote(noteId, "new title", "new content", userId),
      ).rejects.toThrowError("note not found");
    });

    it("should update a note and return updated_at with current date", async () => {
      const noteRepository = createMockNoteRepo();
      const noteService = new NoteService(noteRepository);
      const userId = 9;
      const noteId = 10;
      const initialDate = defaultNoteData.updated_at;
      const newTitle = "updated title";
      const newContent = "updated content";
      noteRepository.findById.mockResolvedValueOnce(defaultNoteData);
      noteRepository.update.mockResolvedValueOnce({
        userId,
        noteId,
        title: newTitle,
        content: newContent,
        created_at: initialDate,
        updated_at: new Date(),
      });

      const result = await noteService.updateNote(
        noteId,
        newTitle,
        newContent,
        userId,
      );

      expect(result).toMatchObject({
        userId,
        noteId,
        title: newTitle,
        content: newContent,
        created_at: initialDate,
        updated_at: expect.any(Date),
      });
    });
  });

  describe("delete note", () => {
    it("should delete an existing note", async () => {
      const noteRepository = createMockNoteRepo();
      const noteService = new NoteService(noteRepository);
      const noteId = 20;
      const userId = 10;
      noteRepository.findById.mockResolvedValueOnce(defaultNoteData);
      noteRepository.delete.mockResolvedValueOnce({
        id: noteId,
        userId,
        title: defaultNoteData.title,
      });

      const result = await noteService.deleteNote(noteId, userId);

      expect(result).toEqual({
        id: noteId,
        userId,
        title: defaultNoteData.title,
      });
    });

    it("should throw an error when note not found", async () => {
      const noteRepository = createMockNoteRepo();
      const noteService = new NoteService(noteRepository);
      const noteId = 20;
      const userId = 10;
      noteRepository.findById.mockResolvedValueOnce(null);

      expect(noteService.deleteNote(noteId, userId)).rejects.toThrowError(
        "note not found",
      );
    });

    it("should throw an error when userId is invalid negative or undefined", async () => {
      const noteRepository = createMockNoteRepo();
      const noteService = new NoteService(noteRepository);
      const noteId = 20;
      const userId = -1;

      expect(noteService.deleteNote(noteId, userId)).rejects.toThrowError(
        "invalid user id",
      );
    });
  });
});
