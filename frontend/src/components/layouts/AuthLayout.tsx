import { Link } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: Props) => {
  return (
    <div className="min-h-screen grid place-items-center bg-gray-100">
      <div className="w-full max-w-sm p-8">
        <div className="mb-8">
          <Link to="/">
            <h1 className="text-3xl font-bold text-center">Notes App</h1>
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
