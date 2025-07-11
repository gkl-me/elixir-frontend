import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function PlanCardSkeleton() {
  return ( 
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index} className="bg-navy border-blueDark relative overflow-hidden">
          <CardHeader className="text-center space-y-2">
            <Skeleton className="h-6 w-32 mx-auto bg-blueDark" />
            <div className="flex items-center justify-center space-x-2">
              <Skeleton className="h-6 w-16 bg-blueDark" />
              <Skeleton className="h-4 w-12 bg-blueDark" />
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <Skeleton className="w-4 h-4 mr-2 rounded-full bg-blueDark" />
                <Skeleton className="h-4 w-48 bg-blueDark" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <Skeleton className="w-4 h-4 mr-2 rounded-full bg-blueDark" />
                <Skeleton className="h-4 w-48 bg-blueDark" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <Skeleton className="w-4 h-4 mr-2 rounded-full bg-blueDark" />
                <Skeleton className="h-4 w-48 bg-blueDark" />
              </div>
            </div>

            <div className="pt-4 border-t border-blueDark space-y-2">
              <div className="flex justify-between items-center text-sm">
                <Skeleton className="h-4 w-24 bg-blueDark" />
                <Skeleton className="h-5 w-16 rounded-md bg-blueDark" />
              </div>
              <div className="flex justify-between items-center text-sm">
                <Skeleton className="h-4 w-24 bg-blueDark" />
                <Skeleton className="h-5 w-16 rounded-md bg-blueDark" />
              </div>
            </div>

            <Skeleton className="h-10 w-full rounded-md bg-blueDark" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
