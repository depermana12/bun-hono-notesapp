import { router } from "../trpc";
import { noteRouter } from "./auth";

const appRouter = router({
  note: noteRouter,
});

export type AppRouter = typeof appRouter;
