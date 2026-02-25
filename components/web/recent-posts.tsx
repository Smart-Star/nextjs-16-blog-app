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
import { cn } from "@/lib/utils";
import { connection } from "next/server";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "../ui/separator";

export const RecentPosts = async () => {
  await connection();

  const blogs = await fetchQuery(api.post.getPosts);
  const latestBlogs = blogs?.slice(0, 3) ?? [];

  if (!latestBlogs.length) {
    return (
      <Card className='flex items-center justify-center p-12 text-center max-w-3xl mx-auto'>
        <p className='flex items-center gap-2 text-lg text-muted-foreground'>
          No posts yet.
          <Link
            href='/create'
            className='font-medium text-primary/80 hover:text-primary italic'>
            Create one now?
          </Link>
        </p>
      </Card>
    );
  }

  return (
    <>
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

      {blogs.length > 3 && (
        <div className='mt-12 flex items-center gap-8 w-full'>
          <Separator className='flex-1' />
          <Link
            href='/blog'
            className='text-sm font-medium text-primary/75 italic hover:text-primary shrink-0'>
            View all
          </Link>
        </div>
      )}
    </>
  );
};
