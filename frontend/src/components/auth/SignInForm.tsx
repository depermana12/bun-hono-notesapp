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
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { SignInUserSchema } from "@schema/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trpc } from "@/utils/trpc";

type SignInForm = z.infer<typeof SignInUserSchema>;

const SignInForm = () => {
  const form = useForm<SignInForm>({
    resolver: zodResolver(SignInUserSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const mutation = trpc.user.signin.useMutation();
  const onSubmit = (data: SignInForm) => {
    mutation.mutate(data, {
      onSuccess: (data) => {
        console.log(data.message);
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
          <Button type="submit">SignIn</Button>
          <Button asChild variant="outline">
            <Link to="/login">Login with Google</Link>
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SignInForm;
