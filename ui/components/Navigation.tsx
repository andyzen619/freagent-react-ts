import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function Navigation() {
  return (
    <nav className="flex items-center gap-2 border-b p-2">
      <Button variant="ghost" asChild>
        <Link to="/" activeProps={{ className: "font-bold bg-accent" }}>
          Home
        </Link>
      </Button>
      <Button variant="ghost" asChild>
        <Link to="/oauth_callback" activeProps={{ className: "font-bold bg-accent" }}>
          OAuth Callback
        </Link>
      </Button>
    </nav>
  );
}
