import AuthLayout from "@/components/layouts/AuthLayout";
import AuthCard from "@/components/auth/AuthCard";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

const ResetPassword = () => {
  const metadata = {
    title: "Reset Password",
    description: "Please enter your new password, and confirm it",
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
        <ResetPasswordForm />
      </AuthCard>
    </AuthLayout>
  );
};
export default ResetPassword;
