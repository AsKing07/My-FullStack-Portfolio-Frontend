import { LoadingSpinner } from "@/components/ui/loading_spinner";

export default function Loading() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <LoadingSpinner size="lg" />
    </div>
  );
}
