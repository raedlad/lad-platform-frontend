import { cn } from "@/lib/utils";

interface ShimmerSkeletonProps extends React.ComponentProps<"div"> {
  variant?: "default" | "card" | "text" | "circular";
  lines?: number;
}

function ShimmerSkeleton({
  className,
  variant = "default",
  lines = 1,
  ...props
}: ShimmerSkeletonProps) {
  const baseClasses = "shimmer-skeleton";

  const variantClasses = {
    default: "h-4 w-full rounded",
    card: "h-32 w-full rounded-lg",
    text: "h-4 w-full rounded",
    circular: "h-10 w-10 rounded-full",
  };

  if (variant === "text" && lines > 1) {
    return (
      <div className={cn("space-y-2", className)} {...props}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(
              baseClasses,
              variantClasses[variant],
              index === lines - 1 && "w-3/4" // Last line is shorter
            )}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(baseClasses, variantClasses[variant], className)}
      {...props}
    />
  );
}

export { ShimmerSkeleton };
