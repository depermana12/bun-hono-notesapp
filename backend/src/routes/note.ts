import NoteService from "../services/note";
import * as s from "../schema/note";
import { protectedProcedure, router } from "../trpc";
import { ParamSchema, QuerySchema } from "../schema/queryParam";

const noteService = new NoteService();

export const noteRouter = router({
  create: protectedProcedure
    .input(s.CreateNoteSchema)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.user.id;
      const note = await noteService.createNote(input, userId);
      return {
        message: "note created",
        data: note,
      };
    }),
  paginated: protectedProcedure
    .input(QuerySchema)
    .query(async ({ input, ctx }) => {
      const userId = ctx.user.id;
      let pageNumber = input.page || 1;
      let notesPerPage = input.limit || 10;
      const i = await noteService.getNotes(userId, pageNumber, notesPerPage);
      return {
        message: "success get paginated notes",
        data: {
          paginated: {
            notes: i.notesList,
            totalNotes: i.totalNotes,
            totalPages: i.totalPages,
            hasNext: i.hasNext,
            hasPrev: i.hasPrev,
          },
        },
      };
    }),
  getNote: protectedProcedure
    .input(ParamSchema)
    .query(async ({ input, ctx }) => {
      const note = await noteService.getNote(input.id, ctx.user.id);
      return {
        message: "success get note",
        data: note,
      };
    }),
  update: protectedProcedure
    .input(s.UpdateNoteSchema)
    .mutation(async ({ input, ctx }) => {
      const updated = await noteService.updateNote(
        input.id,
        input.title,
        input.content,
        ctx.user.id,
      );
      return {
        message: "note updated",
        data: updated,
      };
    }),
  delete: protectedProcedure
    .input(ParamSchema)
    .mutation(async ({ input, ctx }) => {
      await noteService.deleteNote(input.id, ctx.user.id);
      return {
        message: "note deleted",
      };
    }),
});
