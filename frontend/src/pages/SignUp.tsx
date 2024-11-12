import AuthLayout from "@/components/layouts/AuthLayout";
import AuthCard from "@/components/auth/AuthCard";
import SignUpForm from "@/components/auth/SignUpForm";

const SignUp = () => {
  const metadata = {
    title: "Sign Up",
    description: "Welcome! Please fill all the details to create an account",
    message: "already have an account?",
    link: "/signin",
    linkTitle: "Sign In",
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
        <SignUpForm />
      </AuthCard>
    </AuthLayout>
  );
};
export default SignUp;
