"use client";

import { api } from "~/trpc/react";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { CheckCircle2, XCircle, AlertCircle, Loader2 } from "lucide-react";

export default function StatusPage() {
  const { data, isLoading, isError, error } = api.spec.checkHealth.useQuery(undefined, {
    refetchInterval: 30000, 
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
      case "configured":
      case "ok":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "error":
      case "missing_key":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
      case "configured":
      case "ok":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
      case "error":
      case "missing_key":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
      default:
        return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20";
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            System Status
            {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          </CardTitle>
          <CardDescription>Real-time health check of system components</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : isError ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-200">
              <p className="font-semibold">Failed to fetch status</p>
              <p className="text-sm">{error.message}</p>
            </div>
          ) : (
            <div className="space-y-4">
              
              {/* Backend API Status */}
              <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-2 text-primary">
                    <Loader2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">Backend API</p>
                    <p className="text-xs text-muted-foreground">Latency: {data?.latency}ms</p>
                  </div>
                </div>
                <Badge variant="outline" className={getStatusColor(data?.status || "unknown")}>
                  {data?.status === "ok" ? "Operational" : "Degraded"}
                </Badge>
              </div>

              {/* Database Status */}
              <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-2 text-primary">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <ellipse cx="12" cy="5" rx="9" ry="3" />
                      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Database</p>
                    <p className="text-xs text-muted-foreground">Prisma Connection</p>
                  </div>
                </div>
                <Badge variant="outline" className={getStatusColor(data?.database || "unknown")}>
                  {data?.database === "connected" ? "Connected" : "Error"}
                </Badge>
              </div>

              {/* LLM Status */}
              <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-2 text-primary">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10 10 10 0 0 1-10-10 10 10 0 0 1 10-10z" />
                      <path d="M12 8v8" />
                      <path d="M8 12h8" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">LLM Service</p>
                    <p className="text-xs text-muted-foreground">Gemini API Key</p>
                  </div>
                </div>
                <Badge variant="outline" className={getStatusColor(data?.llm || "unknown")}>
                  {data?.llm === "configured" ? "Configured" : "Missing Key"}
                </Badge>
              </div>

            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
