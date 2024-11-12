import { Link } from "react-router-dom";
import { Button } from "../ui/button";

type AuthCardFooter = {
  message: string;
  link: string;
  linkTitle: string;
};

const AuthCardFooter = ({ message, link, linkTitle }: AuthCardFooter) => {
  return (
    <div className="flex items-center justify-between w-full">
      <small>{message}</small>{" "}
      <Button asChild variant="link">
        <Link to={link}>{linkTitle}</Link>
      </Button>
    </div>
  );
};
export default AuthCardFooter;
