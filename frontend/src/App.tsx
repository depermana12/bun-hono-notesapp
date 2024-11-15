import { RouterProvider } from "react-router-dom";
import { router } from "./routes/index";
import TrpcProvider from "./providers/TrpcProvider";
import AuthProvider from "./providers/AuthProvider";

function App() {
  return (
    <AuthProvider>
      <TrpcProvider>
        <RouterProvider router={router} />
      </TrpcProvider>
    </AuthProvider>
  );
}

export default App;
