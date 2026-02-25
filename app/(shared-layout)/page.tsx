import Link from "next/link";
import { Metadata } from "next";
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { buttonVariants } from "@/components/ui/button";
import { RecentPosts } from "@/components/web/recent-posts";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Home | next.js 16 Tutorial",
  description:
    "A modern blog built with Next.js 16, showcasing server components, Convex, and more.",
};

export default async function Home() {
  return (
    <main className='py-16 space-y-16'>
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

      <section className='space-y-6'>
        <h2 className='text-3xl font-semibold tracking-tight text-center'>
          Latest posts
        </h2>

        <Suspense fallback={<LoadingUi />}>
          <RecentPosts />
        </Suspense>
      </section>
    </main>
  );
}

function LoadingUi() {
  return (
    <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {[...Array(3)].map((_, i) => (
        <Card key={i + "w"} className='pt-0'>
          <Skeleton className='h-48 w-full rounded-t-xl rounded-b-none' />
          <CardContent className='space-y-2'>
            <Skeleton className='h-6 w-3/5' />
            <Skeleton className='h-4 w-4/5' />
          </CardContent>
          <CardFooter>
            <Skeleton className='h-7 w-full' />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
