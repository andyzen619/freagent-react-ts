import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Loader2, Check, XCircle } from "lucide-react";

interface OAuthAuthenticationCardProps {
  loading: boolean;
  error: string | null;
  success: boolean;
  onRetry: () => void;
}

export function OAuthAuthenticationCard({
  loading,
  error,
  success,
  onRetry,
}: OAuthAuthenticationCardProps) {
  return (
    <Card className="w-full max-w-md text-center">
      <CardHeader>
        <CardTitle className="text-2xl">Authentication</CardTitle>
        <CardDescription>Connecting to Yahoo Fantasy Sports...</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center gap-6 py-8">
        {error ? (
          <>
            <div className="rounded-full bg-destructive/10 p-4">
              <XCircle className="h-10 w-10 text-destructive" />
            </div>
            <div className="space-y-2">
              <p className="font-medium text-destructive">
                Authentication Failed
              </p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </>
        ) : success ? (
          <>
            <div className="rounded-full bg-green-100 p-4 dark:bg-green-900/20">
              <Check className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <div className="space-y-2">
              <p className="font-medium text-green-600 dark:text-green-400">
                Successfully Authorized!
              </p>
              <p className="text-sm text-muted-foreground">
                You can now close this window or return to the dashboard.
              </p>
            </div>
          </>
        ) : loading ? (
          <>
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-muted-foreground">Exchanging token...</p>
          </>
        ) : null}
      </CardContent>
      <CardFooter className="flex justify-center pb-8 gap-4">
        {error ? (
          <Button onClick={onRetry} variant="outline">
            Retry Authentication
          </Button>
        ) : (
          <Button asChild variant={error ? "destructive" : "default"}>
            <Link to="/">Return to Dashboard</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
