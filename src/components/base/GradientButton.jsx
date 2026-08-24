import { cn } from "../../utils/cn";

export default function GradientButton({ 
  children, 
  variant = "primary", 
  className, 
  disabled,
  ...props 
}) {
  const variants = {
    primary: "bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary text-white shadow-md hover:shadow-lg",
    success: "bg-gradient-to-r from-success to-success-light hover:from-success hover:to-success-light text-white shadow-md hover:shadow-lg",
    ghost: "bg-transparent hover:bg-bg-secondary text-text-secondary hover:text-text",
    outline: "border-2 border-border hover:border-primary hover:bg-primary/5 text-text"
  };

  return (
    <button
      className={cn(
        "px-6 py-3 rounded-xl font-semibold transition-smooth active:scale-[0.98]",
        !disabled && "hover-lift",
        disabled && "opacity-50 cursor-not-allowed",
        variants[variant],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
