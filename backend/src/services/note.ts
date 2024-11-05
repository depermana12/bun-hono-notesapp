import { HTTPException } from "hono/http-exception";
import NoteRepository from "../repositories/notes";

type NoteData = {
  title: string;
  content: string;
};

class NoteService {
  constructor(private noteRepository = new NoteRepository()) {}
  public createNote(noteData: NoteData, userId: number) {
    return this.noteRepository.create(noteData, userId);
  }
  public getNote(noteId: number, userId: number) {
    const note = this.noteRepository.findById(noteId, userId);
    if (!note) {
      throw new HTTPException(404, { message: "note not found" });
    }
    return note;
  }
  public getNotes(userId: number) {
    return this.noteRepository.findAll(userId);
  }
  public updateNote(
    noteId: number,
    title: string,
    content: string,
    userId: number,
  ) {
    const note = this.noteRepository.findById(noteId, userId);
    if (!note) {
      throw new HTTPException(404, { message: "note not found" });
    }
    return this.noteRepository.update(noteId, title, content, userId);
  }
  public deleteNote(noteId: number, userId: number) {
    const note = this.noteRepository.findById(noteId, userId);
    if (!note) {
      throw new HTTPException(404, { message: "note not found" });
    }
    return this.noteRepository.delete(noteId, userId);
  }
}

export default NoteService;
