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
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { signUpFormControls } from "@/lib/utils";
import { signUpSchema } from "@/app/schemas/auth";
import { Spinner } from "@/components/ui/spinner";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function SignUpPage() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onFormSubmit = (data: z.infer<typeof signUpSchema>) => {
    startTransition(async () => {
      await authClient.signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
        fetchOptions: {
          onSuccess: () => {
            toast.success("Account created successfully.");
            router.push("/");
          },
          onError: (e) => {
            toast.error(e.error.message);
          },
        },
      });
      // console.log(form.getValues());
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign up</CardTitle>
        <CardDescription>Create an account to get started</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onFormSubmit)}>
          <FieldGroup className='gap-y-4'>
            {signUpFormControls.map((formControl) => (
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
                  <span>Sign up</span>
                )}
              </Button>
              <FieldDescription className='text-center'>
                Already have an account? <a href='/login'>Login</a>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
