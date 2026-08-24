import { cn } from "../../utils/cn";

export default function LoadingSkeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        "animate-pulse bg-gradient-to-r from-bg-secondary via-bg-tertiary to-bg-secondary rounded-xl",
        className
      )}
      {...props}
    />
  );
}
