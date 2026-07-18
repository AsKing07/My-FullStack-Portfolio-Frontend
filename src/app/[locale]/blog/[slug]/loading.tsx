import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Loader2 className="animate-spin w-10 h-10 text-blue-600" />
    </div>
  );
}
