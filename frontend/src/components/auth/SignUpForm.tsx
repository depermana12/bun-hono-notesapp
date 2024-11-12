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
import { CreateUserSchema } from "@schema/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trpc } from "@/utils/trpc";

type SignUpForm = z.infer<typeof CreateUserSchema>;

const SignUpForm = () => {
  const form = useForm<SignUpForm>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const mutation = trpc.user.signup.useMutation();

  const onSubmit = (data: SignUpForm) => {
    mutation.mutate(data, {
      onSuccess: (res) => {
        console.log(res.data);
      },
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-4 "
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between ">
                <FormLabel htmlFor="name">Name</FormLabel>
              </div>
              <FormControl>
                <Input type="text" placeholder="depermana" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
              </div>
              <FormControl>
                <Input type="password" placeholder="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col space-y-4 pt-6">
          <Button type="submit" disabled={mutation.isLoading}>
            SignUp
          </Button>
          <Button asChild variant="outline">
            <Link to="/login">Login with Google</Link>
          </Button>
        </div>
      </form>
    </Form>
  );
};
export default SignUpForm;
