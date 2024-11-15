import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@backend/routes/index";

export const trpc = createTRPCReact<AppRouter>();

export const createTrpcClient = (getToken: () => string | null) => {
  return trpc.createClient({
    links: [
      httpBatchLink({
        url: "/api/trpc",
        headers() {
          const token = getToken();
          const headers = {
            Authorization: token ? `Bearer ${token}` : "",
          };
          console.log("Request header trpc", headers);
          console.log("token closure", token);
          return headers;
        },
      }),
    ],
  });
};
