"use client";

import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";
import { useConvexAuth } from "convex/react";
import { authClient } from "@/lib/auth-client";
import { Button, buttonVariants } from "../ui/button";
import SearchInput from "./search-input";

const nav_links = [
  { id: 1, label: "Home", href: "/" },
  { id: 2, label: "Blog", href: "/blog" },
  { id: 3, label: "Create", href: "/create" },
];

export function Navbar() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Logged out successfully.");
          router.push("/");
        },
        onError: (e) => {
          toast.error(e.error.message);
        },
      },
    });
  };

  return (
    <nav className='w-full py-5 flex items-center justify-between'>
      <div className='flex items-center gap-8'>
        <Link href='/' className='text-3xl font-bold'>
          Next <span className='text-primary'>Pro</span>
        </Link>

        <div className='flex items-center gap-2'>
          {nav_links.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              className={cn(buttonVariants({ variant: "ghost" }))}>
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <div className='flex items-center gap-2'>
        <div className='hidden md:block mr-2'>
          <SearchInput />
        </div>

        {isLoading ? null : isAuthenticated ? (
          <Button onClick={handleLogout}>Logout</Button>
        ) : (
          <>
            <Link href='/sign-up' className={cn(buttonVariants())}>
              Sign Up
            </Link>
            <Link
              href='/login'
              className={cn(buttonVariants({ variant: "outline" }))}>
              Login
            </Link>
          </>
        )}
        <ThemeToggle />
      </div>
    </nav>
  );
}
