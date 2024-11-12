import AuthLayout from "@/components/layouts/AuthLayout";
import AuthCard from "@/components/auth/AuthCard";
import ForgetPasswordForm from "@/components/auth/ForgetPasswordForm";

const ForgetPassword = () => {
  const metadata = {
    title: "Forget Password",
    description:
      "Enter your email address below and we'll send you an instructions",
    message: "remember your password?",
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
        <ForgetPasswordForm />
      </AuthCard>
    </AuthLayout>
  );
};
export default ForgetPassword;
