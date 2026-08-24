import { cn } from "../../utils/cn";

export default function IconBadge({ 
  icon: Icon, 
  variant = "primary", 
  size = "md",
  className 
}) {
  const variants = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    error: "bg-error/10 text-error",
    warning: "bg-warning/10 text-warning",
    purple: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
    cyan: "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400"
  };

  const sizes = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg"
  };

  return (
    <div className={cn(
      "rounded-xl flex items-center justify-center transition-smooth",
      "group-hover:scale-110",
      variants[variant],
      sizes[size],
      className
    )}>
      <Icon className="w-1/2 h-1/2" />
    </div>
  );
}
