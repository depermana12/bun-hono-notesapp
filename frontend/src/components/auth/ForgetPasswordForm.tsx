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
import { useForm } from "react-hook-form";
import { ForgetPasswordSchema } from "@schema/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

type ForgetPasswordForm = z.infer<typeof ForgetPasswordSchema>;

const ForgetPasswordForm = () => {
  const form = useForm<ForgetPasswordForm>({
    resolver: zodResolver(ForgetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: ForgetPasswordForm) => {
    console.log(data);
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
        <div className="flex flex-col space-y-4 pt-6">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
};
export default ForgetPasswordForm;
