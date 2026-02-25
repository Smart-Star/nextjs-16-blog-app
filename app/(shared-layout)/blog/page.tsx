import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { Suspense } from "react";
import { cn } from "@/lib/utils";
import LoadingUi from "./loading-ui";
// import { cacheLife } from "next/cache";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { buttonVariants } from "@/components/ui/button";
import { connection } from "next/server";

// export const dynamic = "force-static";
// export const revalidate = 30;

export const metadata: Metadata = {
  title: "Blog | next.js 16 Tutorial",
  description: "Read our latest articles and insights.",
  category: "Web development",
  authors: [{ name: "Mofoluwasho" }],
};

export default async function BlogPage() {
  return (
    <section className='py-12 space-y-12'>
      <div className='text-center space-y-2 pb-12'>
        <h1 className='text-4xl sm:text-5xl font-extrabold tracking-tight'>
          Our Blog
        </h1>
        <p className='text-xl text-muted-foreground'>
          Insights, thoughts, and trends from our team
        </p>
      </div>

      <Suspense fallback={<LoadingUi />}>
        <BlogContent />
      </Suspense>
    </section>
  );
}

async function BlogContent() {
  // await new Promise((resolve) => setTimeout(resolve, 5000));
  // "use cache";
  // cacheLife("hours");

  await connection();
  const blogs = await fetchQuery(api.post.getPosts);

  if (!blogs.length) {
    return (
      <Card className='flex items-center justify-center p-12 text-center max-w-3xl mx-auto'>
        <p className='flex items-center gap-2 text-lg text-muted-foreground'>
          No posts yet. Click now to write your own
          <Link
            href='/create'
            className='font-medium text-primary/80 hover:text-primary italic'>
            blog article.
          </Link>
        </p>
      </Card>
    );
  }

  return (
    <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {blogs?.map((post) => (
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
}
