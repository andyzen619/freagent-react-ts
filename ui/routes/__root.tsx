import { Outlet, createRootRoute } from "@tanstack/react-router";
import { Navigation } from "@/components/Navigation";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}
