import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className='min-h-screen flex items-center justify-center'>
      <div className='absolute top-10 left-20'>
        <Link href='/' className={cn(buttonVariants({ variant: "outline" }))}>
          <ArrowLeft /> Go Back
        </Link>
      </div>

      <main className='w-full max-w-md'>{children}</main>
    </section>
  );
}
