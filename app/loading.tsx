import { Loader2 } from "lucide-react";


export default function Loading() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#040A1D]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-[#8735C9]" />
        <p className="text-lg font-medium text-white/80 animate-pulse">Loading...</p>
      </div>
    </div>
  );
}