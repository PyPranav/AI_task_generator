"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export default function Home() {
  const [title, setTitle] = useState("");
  const [projectGoals, setProjectGoals] = useState("");
  const [projectConstraints, setProjectConstraints] = useState("");
  const [targetUsers, setTargetUsers] = useState("");
  const [risks, setRisks] = useState("");

  const generate = api.spec.generate.useMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generate.mutate({
      title,
      projectGoals,
      projectConstraints,
      targetUsers,
      risks,
    });
  };

  return (
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
              <Label htmlFor="projectConstraints">Project Constraints</Label>
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
              disabled={generate.isPending}
            >
              {generate.isPending ? "Generating..." : "Generate"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
