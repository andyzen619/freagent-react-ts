import { Link } from "@tanstack/react-router";
import { NavigationBadge } from "@/components/NavigationBadge";

export function Navigation() {
  return (
    <nav className="flex items-center gap-2 border-b p-4 h-16">
      <NavigationBadge asChild>
        <Link to="/" activeProps={{ className: "font-bold bg-accent" }}>
          Home
        </Link>
      </NavigationBadge>
    </nav>
  );
}
