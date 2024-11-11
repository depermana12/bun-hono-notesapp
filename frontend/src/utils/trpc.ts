import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@backend/routes/index";

export const trpc = createTRPCReact<AppRouter>();
