"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { SignInUserSchema } from "@schema/user";
import { Input } from "@/components/ui/input";
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import useAuth from "@/hooks/useAuth";
import { trpc } from "@/utils/trpc";
import { z } from "zod";

type SignInForm = z.infer<typeof SignInUserSchema>;

const SignInForm = () => {
  const form = useForm<SignInForm>({
    resolver: zodResolver(SignInUserSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const navigate = useNavigate();
  const { signIn } = useAuth();

  const signInMut = trpc.user.signin.useMutation();
  const onSubmit = (data: SignInForm) => {
    signInMut.mutate(data, {
      onSuccess: (data) => {
        const { id, name, email } = data.data;
        signIn({ id, name, email }, data.token);
        navigate("/dashboard");
      },
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-2 "
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between ">
                <FormLabel htmlFor="email">Email</FormLabel>
              </div>
              <FormControl>
                <Input
                  type="email"
                  placeholder="depermana@email.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between ">
                <FormLabel htmlFor="password">Password</FormLabel>
                <Link
                  className="ml-auto inline-block text-sm underline"
                  to="/forget-password"
                >
                  Forgot password?
                </Link>
              </div>
              <FormControl>
                <Input type="password" placeholder="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col space-y-4 pt-6">
          <Button type="submit" disabled={signInMut.isLoading}>
            {signInMut.isLoading && (
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            )}
            SignIn
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                or signin with
              </span>
            </div>
          </div>
          <Button asChild variant="outline">
            <Link to="/login">Google</Link>
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SignInForm;
