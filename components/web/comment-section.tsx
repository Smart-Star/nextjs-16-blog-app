"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "../ui/input-group";

import z from "zod";
import { toast } from "sonner";
import { useTransition } from "react";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { useParams } from "next/navigation";
import { Separator } from "../ui/separator";
import { MessageSquare } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { commentSchema } from "@/app/schemas/comment";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Preloaded, useMutation, usePreloadedQuery } from "convex/react";

export default function CommentSection(props: {
  preloadedComments: Preloaded<typeof api.comments.getCommentsByPostId>;
}) {
  const params = useParams<{ blogId: Id<"post"> }>();
  const [isPending, startTransition] = useTransition();

  const comments = usePreloadedQuery(props.preloadedComments);
  const mutation = useMutation(api.comments.createComment);

  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      postId: params.blogId,
      content: "",
    },
  });

  const onFormSubmit = (data: z.infer<typeof commentSchema>) => {
    startTransition(async () => {
      try {
        await mutation({
          postId: data.postId,
          body: data.content,
        });

        form.reset();
        toast.success("Comment posted successfully.");
      } catch {
        toast.error("Failed to post comment!");
      }
    });
  };

  if (comments === undefined) {
    return <h2 className=''>Loading...</h2>;
  }

  return (
    <Card>
      <CardHeader className='border-b'>
        <CardTitle className='flex items-center gap-2'>
          <MessageSquare className='size-5 text-primary' />
          <p className='text-xl font-bold'>{comments.length} Comments</p>
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-8'>
        <form onSubmit={form.handleSubmit(onFormSubmit)}>
          <FieldGroup>
            <Controller
              name='content'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='content'>Write comment</FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      {...field}
                      id='content'
                      placeholder='Share your thoughts...'
                      rows={6}
                      className='min-h-24 resize-none'
                      aria-invalid={fieldState.invalid}
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
            <Button type='submit' disabled={isPending}>
              {isPending ? (
                <>
                  <Spinner /> Loading...
                </>
              ) : (
                <span>Post comment</span>
              )}
            </Button>
          </FieldGroup>
        </form>

        {comments?.length > 0 && <Separator />}

        <main className='space-y-6'>
          {comments?.map((comment) => (
            <div key={comment._id} className='flex gap-4'>
              <Avatar className='size-10 shrink-0'>
                <AvatarImage
                  src={`https://avatar.vercel.sh/${comment.authorName}`}
                  alt={comment.authorName}
                />
                <AvatarFallback>
                  {comment.authorName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className='flex-1 space-y-1'>
                <div className='flex items-center justify-between'>
                  <h2 className='font-semibold text-sm'>
                    {comment.authorName}
                  </h2>
                  <p className='text-muted-foreground text-xs'>
                    {new Date(comment._creationTime).toLocaleDateString()}
                  </p>
                </div>

                <p className='text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed'>
                  {comment.body}
                </p>
              </div>
            </div>
          ))}
        </main>
      </CardContent>
    </Card>
  );
}
