import AuthLayout from "@/components/layouts/AuthLayout";
import AuthCard from "@/components/auth/AuthCard";
import SignInForm from "@/components/auth/SignInForm";

const SignIn = () => {
  const metadata = {
    title: "Sign In",
    description: "Welcome! Please fill all the details",
    message: "not have an account?",
    link: "/signup",
    linkTitle: "Sign Up",
  };

  return (
    <AuthLayout>
      <AuthCard
        title={metadata.title}
        description={metadata.description}
        message={metadata.message}
        link={metadata.link}
        linkTitle={metadata.linkTitle}
      >
        <SignInForm />
      </AuthCard>
    </AuthLayout>
  );
};
export default SignIn;
