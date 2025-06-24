import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface AnimatePulseProps {
  className?: string;
  children?: React.ReactNode;
}

export default function AnimatePulse({ className, children }: AnimatePulseProps) {
  return (
    <motion.div
      className={cn("animate-pulse bg-gray-200 dark:bg-gray-700 rounded", className)}
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
    >
      {children}
    </motion.div>
  );
}