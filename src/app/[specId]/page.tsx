"use client";

import { use } from "react";
import { api } from "~/trpc/react";
import { KanbanBoard } from "~/app/_components/kanban-board";
import { SpecExportButton } from "~/app/_components/spec-export-button";
import { Skeleton } from "~/components/ui/skeleton";

interface SpecPageProps {
  params: Promise<{ specId: string }>;
}

export default function SpecPage({ params }: SpecPageProps) {
  const { specId } = use(params);
  const { data: spec, isLoading } = api.spec.getById.useQuery({ id: specId });
  const { data: workItems } = api.spec.getWorkItems.useQuery({ specId });

  return (
    <main className="min-h-[calc(100vh-3rem)]">
      {/* Spec Header */}
      <div className="border-b border-border/50 bg-card/30 px-8 py-6">
        {isLoading ? (
          <div className="mx-auto flex max-w-7xl flex-col gap-2">
            <Skeleton className="h-8 w-72" />
            <Skeleton className="h-4 w-48" />
          </div>
        ) : (
          <div className="mx-auto max-w-7xl">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    {spec?.title}
                  </h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Created{" "}
                    {spec?.createdAt
                      ? new Date(spec.createdAt).toLocaleDateString(undefined, {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                      : ""}
                  </p>
                </div>
                {spec && workItems && (
                  <SpecExportButton spec={spec} workItems={workItems} />
                )}
              </div>
          </div>
        )}
      </div>

      {/* Kanban Board — centered */}
      <div className="mx-auto max-w-7xl">
        <KanbanBoard specId={specId} />
      </div>
    </main>
  );
}
