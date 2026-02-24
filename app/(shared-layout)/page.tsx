import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import { connection } from "next/server";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Home | next.js 16 Tutorial",
  description:
    "A modern blog built with Next.js 16, showcasing server components, Convex, and more.",
};

export default function Home() {
  return (
    <main className='min-h-screen py-16 space-y-16'>
      <header className='text-center space-y-4'>
        <span className='text-sm font-semibold text-primary uppercase tracking-wide'>
          Next.js 16 blog tutorial
        </span>
        <h2 className='text-4xl sm:text-5xl font-extrabold tracking-tight max-w-2xl mx-auto'>
          Learn Next.js 16 by building a modern blog
        </h2>
        <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
          Explore practical examples of server components, data fetching with
          Convex, and a polished UI, all in one place.
        </p>

        <div className='mt-3 flex items-center justify-center flex-wrap gap-3'>
          <Link href='/blog' className={buttonVariants({ size: "lg" })}>
            Read the blog
          </Link>
          <Link
            href='/blog'
            className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
            Browse all posts
          </Link>
        </div>
      </header>

      <section className='space-y-4'>
        <div className='flex items-center justify-between gap-2'>
          <h2 className='text-2xl font-semibold tracking-tight'>
            Latest posts
          </h2>
          <Link
            href='/blog'
            className='text-sm font-medium text-primary hover:underline'>
            View all
          </Link>
        </div>

        <Suspense
          fallback={
            <p className='text-sm text-muted-foreground'>
              Loading latest posts...
            </p>
          }>
          <RecentPosts />
        </Suspense>
      </section>
    </main>
  );
}

const RecentPosts = async () => {
  await connection();

  const blogs = await fetchQuery(api.post.getPosts);
  const latestBlogs = blogs?.slice(0, 3) ?? [];

  if (!latestBlogs.length) {
    return (
      <p className='flex items-center gap-2 text-sm text-muted-foreground'>
        No posts yet.
        <Link
          href='/create'
          className='text-sm font-medium text-primary hover:underline'>
          Create one now?
        </Link>
      </p>
    );
  }

  return (
    <div className='grid md:grid-cols-3 gap-6'>
      {latestBlogs.map((post) => (
        <Card key={post._id} className='pt-0 justify-between'>
          <CardHeader className='relative h-48 w-full overflow-hidden'>
            <Image
              src={
                post.imageUrl ??
                "https://images.unsplash.com/photo-1761839271800-f44070ff0eb9?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              }
              alt={post.title}
              fill
              className='rounded-t-xl object-cover'
            />
          </CardHeader>
          <CardContent className='space-y-2'>
            <CardTitle>{post.title}</CardTitle>
            <CardDescription>{post.body}</CardDescription>
          </CardContent>
          <CardFooter>
            <Link
              href={`blog/${post._id}`}
              className={cn(buttonVariants(), "w-full font-medium")}>
              Read more
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
