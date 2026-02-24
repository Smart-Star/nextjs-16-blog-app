"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import z from "zod";
import { toast } from "sonner";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { loginFormControls } from "@/lib/utils";
import { loginSchema } from "@/app/schemas/auth";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Spinner } from "@/components/ui/spinner";

export default function LoginPage() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onFormSubmit = (data: z.infer<typeof loginSchema>) => {
    startTransition(async () => {
      await authClient.signIn.email({
        email: data.email,
        password: data.password,
        fetchOptions: {
          onSuccess: () => {
            toast.success("Logged in successfully.");
            router.push("/");
          },
          onError: (e) => {
            toast.error(
              e.error.message ?? "An error occured! Please try again."
            );
            console.log("login error:", e);
          },
        },
      });
      // console.log(form.getValues());
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Emter your details to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onFormSubmit)}>
          <FieldGroup className='gap-y-4'>
            {loginFormControls.map((formControl) => (
              <Controller
                key={formControl.name}
                name={formControl.name}
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={formControl.name}>
                      {formControl.label}
                    </FieldLabel>
                    <Input
                      {...field}
                      id={formControl.name}
                      aria-invalid={fieldState.invalid}
                      type={formControl.type}
                      placeholder={formControl.placeholder}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            ))}
            <Field>
              <Button type='submit' disabled={isPending}>
                {isPending ? (
                  <>
                    <Spinner /> Loading...
                  </>
                ) : (
                  <span>Login</span>
                )}
              </Button>
              <FieldDescription className='text-center'>
                Don&apos;t have an account? <a href='/sign-up'>Sign up</a>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
