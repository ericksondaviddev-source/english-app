import { cn } from "../../utils/cn";

export default function GlassCard({ children, className, animate = true, ...props }) {
  return (
    <div
      className={cn(
        "glass rounded-xl p-4 shadow-md transition-smooth",
        animate && "hover-lift",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
