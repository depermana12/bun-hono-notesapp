import { router } from "../trpc";
import { userRouter } from "./auth";
import { noteRouter } from "./note";

export const appRouter = router({
  user: userRouter,
  note: noteRouter,
});

export type AppRouter = typeof appRouter;
