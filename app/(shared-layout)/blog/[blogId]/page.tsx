import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";
import { getToken } from "@/lib/auth-server";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Separator } from "@/components/ui/separator";
import { buttonVariants } from "@/components/ui/button";
import { fetchQuery, preloadQuery } from "convex/nextjs";
import CommentSection from "@/components/web/comment-section";
import { PostPresence } from "@/components/web/post-presence";

type Props = {
  params: Promise<{ blogId: Id<"post"> }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { blogId } = await params;

  const post = await fetchQuery(api.post.getPostById, { postId: blogId });

  if (!post) {
    return {
      title: "Post not found",
    };
  }

  return {
    title: post.title,
    description: post.body,
  };
}

export default async function BlogIdPage({ params }: Props) {
  const { blogId } = await params;

  const token = await getToken();

  const [post, preloadedComments, userId] = await Promise.all([
    await fetchQuery(api.post.getPostById, { postId: blogId }),
    await preloadQuery(api.comments.getCommentsByPostId, {
      postId: blogId,
    }),
    await fetchQuery(api.presence.getUserId, {}, { token }),
  ]);

  if (!userId) {
    return redirect("/login");
  }

  // console.log("comments are:", preloadedComments);

  if (!post) return <h1 className='text-3xl'>Post Not Found</h1>;

  return (
    <section className='max-w-3xl mx-auto py-8 px-4 animate-in fade-in duration-500'>
      <Link
        href='/blog'
        className={cn(buttonVariants({ variant: "outline" }), "mb-8")}>
        <ArrowLeft /> Go Back
      </Link>

      <div className='relative h-[400px] w-full mb-8 rounded-xl shadow-sm overflow-hidden'>
        <Image
          src={
            post.imageUrl ??
            "https://images.unsplash.com/photo-1761839271800-f44070ff0eb9?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }
          alt={post.title ?? "post image"}
          fill
          className='object-cover hover:scale-105 transition-transform duration-500'
        />
      </div>

      <div className='space-y-4 flex flex-col'>
        <h1 className='text-4xl font-bold tracking-tight'>{post.title}</h1>

        <div className='flex items-center gap-4'>
          <p className='text-sm text-muted-foreground'>
            Posted on:{" "}
            {post._creationTime
              ? new Date(post._creationTime).toLocaleDateString()
              : "-"}
          </p>

          <span className='w-0.5 h-5 bg-muted-foreground' />

          {post._id && <PostPresence roomId={post._id} />}
        </div>
      </div>

      <Separator className='my-8' />

      <p className='text-lg leading-relaxed text-foreground/90 whitespace-pre-wrap'>
        {post.body}
      </p>

      <Separator className='my-8' />

      <CommentSection preloadedComments={preloadedComments} />
    </section>
  );
}
