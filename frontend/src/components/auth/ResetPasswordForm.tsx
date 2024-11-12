"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { ResetPasswordFormSchema } from "@schema/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

type ResetPasswordForm = z.infer<typeof ResetPasswordFormSchema>;

const ResetPasswordForm = () => {
  const form = useForm<ResetPasswordForm>({
    resolver: zodResolver(ResetPasswordFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { token } = useParams();

  const onSubmit = (data: ResetPasswordForm) => {
    console.log(data, token);

    // try {
    //   trpc.user.resetPassword.useMutation({
    //     token,
    //     password: data.password,
    //   });
    //   console.log("Password reset successful");
    // } catch (error) {
    //   console.error("Error resetting password:", error);
    // }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-2 "
      >
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="password">Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col space-y-4 pt-6">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
};
export default ResetPasswordForm;
