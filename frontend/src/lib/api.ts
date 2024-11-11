import { type AppType } from "../../../backend/src/app";
import { hc } from "hono/client";

const client = hc<AppType>("/");

export const api = client;
