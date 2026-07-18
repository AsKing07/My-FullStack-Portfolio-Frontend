import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
    </div>
  );
}
