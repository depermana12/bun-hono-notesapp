"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { PropsWithChildren } from "react";
import AuthCardFooter from "./AuthCardFooter";

type SignInProps = {
  title: string;
  description: string;
  message: string;
  link: string;
  linkTitle: string;
};

const AuthCard = ({
  children,
  title,
  description,
  message,
  link,
  linkTitle,
}: PropsWithChildren<SignInProps>) => {
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter>
        <AuthCardFooter message={message} link={link} linkTitle={linkTitle} />
      </CardFooter>
    </Card>
  );
};
export default AuthCard;
