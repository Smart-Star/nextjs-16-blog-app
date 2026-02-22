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
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";

import z from "zod";
import { toast } from "sonner";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { postSchema } from "@/app/schemas/blog";
import { createPostAction } from "@/app/actions";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

export default function CreateBlogPage() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      content: "",
      image: undefined,
    },
  });

  const onFormSubmit = (data: z.infer<typeof postSchema>) => {
    startTransition(async () => {
      const result = await createPostAction(data);
      if (result?.success) {
        toast.success(result.message);
        router.push("/blog");
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <section className='py-12 space-y-12'>
      <div className='text-center space-y-2'>
        <h1 className='text-4xl sm:text-5xl font-extrabold tracking-tight'>
          Create Post
        </h1>
        <p className='text-xl text-muted-foreground'>
          Share your thoughts with the big world
        </p>
      </div>

      <Card className='w-full max-w-xl mx-auto'>
        <CardHeader>
          <CardTitle>Create Blog</CardTitle>
          <CardDescription>Create a new blog article</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onFormSubmit)}>
            <FieldGroup className='gap-y-4'>
              <Controller
                name='title'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor='title'>Title</FieldLabel>
                    <Input
                      {...field}
                      id='title'
                      aria-invalid={fieldState.invalid}
                      placeholder='Enter blog title'
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name='content'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor='content'>Content</FieldLabel>
                    <InputGroup>
                      <InputGroupTextarea
                        {...field}
                        id='content'
                        className='min-h-24 resize-none'
                        aria-invalid={fieldState.invalid}
                        placeholder='Enter blog content...'
                      />
                      <InputGroupAddon align='block-end'>
                        <InputGroupText className='tabular-nums'>
                          {field.value.length} characters
                        </InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name='image'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor='image'>Upload Image</FieldLabel>
                    <Input
                      id='image'
                      type='file'
                      accept='image/*'
                      aria-invalid={fieldState.invalid}
                      className='p-0 file:px-3 file:mr-3 file:h-full file:bg-muted file:hover:bg-muted-foreground/20 text-muted-foreground duration-300 cursor-pointer'
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        field.onChange(file);
                      }}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Button type='submit' disabled={isPending}>
                {isPending ? (
                  <>
                    <Spinner /> Creating post...
                  </>
                ) : (
                  <span>Crate post</span>
                )}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
