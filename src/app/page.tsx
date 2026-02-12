"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { Spinner } from "~/components/ui/spinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

const LOADING_MESSAGES = [
  "Analyzing your project requirements…",
  "Generating user stories…",
  "Breaking down tasks…",
  "Identifying edge cases…",
  "Crafting acceptance criteria…",
  "Prioritizing work items…",
  "Mapping out dependencies…",
  "Structuring the spec document…",
  "Almost there, polishing details…",
  "Reviewing generated content…",
  "Finalizing your project spec…",
];

export default function Home() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [projectGoals, setProjectGoals] = useState("");
  const [projectConstraints, setProjectConstraints] = useState("");
  const [targetUsers, setTargetUsers] = useState("");
  const [risks, setRisks] = useState("");

  const [messageIndex, setMessageIndex] = useState(0);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const utils = api.useUtils();

  const generate = api.spec.generate.useMutation({
    onSuccess: async (data) => {
      if (data?.success && "specId" in data && data.specId) {
        setIsRedirecting(true);
        // Invalidate the sidebar spec list so it includes the new spec
        await utils.spec.list.invalidate();
        router.push(`/${data.specId}`);
      }
    },
  });

  const isLoading = generate.isPending || isRedirecting;

  // Cycle through loading messages while generating or redirecting
  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setMessageIndex(0);
      generate.mutate({
        title,
        projectGoals,
        projectConstraints,
        targetUsers,
        risks,
      });
    },
    [title, projectGoals, projectConstraints, targetUsers, risks, generate],
  );

  return (
    <>
      {/* ── Full-page loading overlay ── */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-background/80 backdrop-blur-sm">
          <Spinner className="size-12 text-primary" />
          <p
            key={messageIndex}
            className="animate-in fade-in duration-500 text-center text-lg font-medium text-muted-foreground"
          >
            {LOADING_MESSAGES[messageIndex]}
          </p>
        </div>
      )}

      <main className="flex min-h-[calc(100vh-3rem)] items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Generate Project Spec</CardTitle>
            <CardDescription>
              Fill in the details below to generate a project specification.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Project title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectGoals">Project Goals</Label>
                <Textarea
                  id="projectGoals"
                  placeholder="What are the main goals of this project?"
                  value={projectGoals}
                  onChange={(e) => setProjectGoals(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectConstraints">
                  Project Constraints
                </Label>
                <Textarea
                  id="projectConstraints"
                  placeholder="What constraints does this project have?"
                  value={projectConstraints}
                  onChange={(e) => setProjectConstraints(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetUsers">Target Users</Label>
                <Textarea
                  id="targetUsers"
                  placeholder="Who are the target users for this project?"
                  value={targetUsers}
                  onChange={(e) => setTargetUsers(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="risks">Risks / Constraints</Label>
                <Textarea
                  id="risks"
                  placeholder="Any risks or additional constraints? (optional)"
                  value={risks}
                  onChange={(e) => setRisks(e.target.value)}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                Generate
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
