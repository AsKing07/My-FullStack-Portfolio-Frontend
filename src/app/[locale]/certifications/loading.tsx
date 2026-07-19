import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 dark:from-slate-900 dark:via-amber-950 dark:to-slate-950">
      <Loader2 className="animate-spin w-8 h-8 text-amber-600" />
    </div>
  );
}
