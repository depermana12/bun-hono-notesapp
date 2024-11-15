import { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useAuth from "@/hooks/useAuth";
import { trpc, createTrpcClient } from "@/utils/trpc";

const TrpcProvider = ({ children }: PropsWithChildren) => {
  const { token } = useAuth();

  const trpcClient = createTrpcClient(() => token);
  const queryClient = new QueryClient();

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
};

export default TrpcProvider;
