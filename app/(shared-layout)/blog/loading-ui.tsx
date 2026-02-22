import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export default function LoadingUi() {
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
