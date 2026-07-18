import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-gradient-to-br from-purple-50 via-pink-50 to-rose-100 dark:from-slate-900 dark:via-purple-950 dark:to-slate-950">
      <Loader2 className="animate-spin w-8 h-8 text-purple-600" />
    </div>
  );
}
