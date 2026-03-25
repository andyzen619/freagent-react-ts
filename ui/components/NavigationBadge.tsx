import { Badge, type BadgeProps } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function NavigationBadge({ className, children, ...props }: BadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-sm px-4 py-2 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors",
        className
      )}
      {...props}
    >
      {children}
    </Badge>
  );
}
