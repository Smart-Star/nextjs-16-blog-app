"use client";

import Link from "next/link";
import { Input } from "../ui/input";
import { useQuery } from "convex/react";
import { ChangeEvent, useState } from "react";
import { api } from "@/convex/_generated/api";
import { Loader2, Search } from "lucide-react";

export default function SearchInput() {
  const [term, setTerm] = useState("");
  const [open, setOpen] = useState(false);

  const results = useQuery(
    api.post.searchPosts,
    term.length >= 2 ? { limit: 5, term: term } : "skip"
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTerm(e.target.value);
    setOpen(true);
  };

  const closeSearchResults = () => {
    setOpen(false);
    setTerm("");
  };

  return (
    <div className='relative z-10 w-full max-w-sm'>
      <div className='relative'>
        <Search className='absolute left-2.5 top-2.5 size-4 text-muted-foreground' />

        <Input
          type='search'
          placeholder='search posts...'
          className='w-full pl-8 bg-background'
          value={term}
          onChange={handleChange}
        />
      </div>

      {open && term.length >= 2 && (
        <div className='absolute z-50 top-full w-full mt-2 rounded-md border border-input bg-popover dark:bg-input/30 dark:backdrop-blur-2xl text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95'>
          {results === undefined ? (
            <div className='flex items-center justify-center p-4 text-sm text-muted-foreground'>
              <Loader2 className='my-2 size-4 animate-spin mr-2' /> Searching...
            </div>
          ) : results.length === 0 ? (
            <p className='text-center p-4 text-sm text-muted-foreground'>
              No results found!
            </p>
          ) : (
            <div className='py-1'>
              {results.map((post) => (
                <Link
                  key={post._id}
                  href={`/blog/${post._id}`}
                  onClick={closeSearchResults}
                  className='flex flex-col px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer'>
                  <p className='font-medium truncate'>{post.title}</p>
                  <p className='text-xs text-muted-foreground pt-1'>
                    {post.body.substring(0, 60)}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
