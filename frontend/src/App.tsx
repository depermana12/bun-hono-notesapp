import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { trpc } from "./utils/trpc";
import { Button } from "@/components/ui/button";
import Home from "./pages/home";

function App() {
  const [count, setCount] = useState(0);
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "/api/trpc",
        }),
      ],
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <>
          <div className="card">
            <Button onClick={() => setCount((count) => count + 1)}>
              count is {count}
            </Button>
          </div>
          <Home />
        </>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App;
