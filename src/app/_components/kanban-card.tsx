"use client";

import { Draggable } from "@hello-pangea/dnd";
import { MoreHorizontal, CheckCircle2, Trash2 } from "lucide-react";
import type { WorkItem } from "generated/prisma";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Badge } from "~/components/ui/badge";
import { ScrollArea } from "~/components/ui/scroll-area";

// Category → color mapping for task badges
const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  FRONTEND: { bg: "bg-blue-500/15", text: "text-blue-400" },
  BACKEND: { bg: "bg-amber-500/15", text: "text-amber-400" },
  API: { bg: "bg-orange-500/15", text: "text-orange-400" },
  DEVOPS: { bg: "bg-emerald-500/15", text: "text-emerald-400" },
  DESIGN: { bg: "bg-pink-500/15", text: "text-pink-400" },
  RESEARCH: { bg: "bg-slate-500/15", text: "text-slate-400" },
  TESTING: { bg: "bg-cyan-500/15", text: "text-cyan-400" },
  ML: { bg: "bg-violet-500/15", text: "text-violet-400" },
  DATABASE: { bg: "bg-yellow-500/15", text: "text-yellow-400" },
};

function getCategoryStyle(category: string | null) {
  if (!category) return { bg: "bg-muted", text: "text-muted-foreground" };
  const upper = category.toUpperCase();
  return CATEGORY_COLORS[upper] ?? { bg: "bg-muted", text: "text-muted-foreground" };
}

interface KanbanCardProps {
  item: WorkItem;
  index: number;
}

export function KanbanCard({ item, index }: KanbanCardProps) {
  const utils = api.useUtils();
  const deleteMutation = api.spec.deleteWorkItem.useMutation({
    onSuccess: async () => {
      toast.success("Task deleted");
      await utils.spec.getWorkItems.invalidate({ specId: item.specId });
    },
    onError: (err) => {
      toast.error(`Delete failed: ${err.message}`);
    },
  });

  const isStory = item.type === "STORY";
  const categoryStyle = getCategoryStyle(item.category);
  const isDone = item.status === "DONE";

  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided, snapshot) => (
        <Dialog>
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <DialogTrigger asChild>
              <div
                className={`group mb-3 rounded-xl border p-4 transition-all duration-200 cursor-pointer
                  ${snapshot.isDragging
                    ? "rotate-[2deg] scale-[1.02] border-primary/40 bg-card shadow-2xl shadow-primary/10 ring-2 ring-primary/20"
                    : "border-border/50 bg-card hover:border-border hover:shadow-lg hover:shadow-black/20"
                  }`}
              >
                {/* Badge + menu */}
                <div className="mb-2 flex items-center justify-between">
                  {isStory ? (
                    <span className="rounded-md bg-indigo-500/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-indigo-400">
                      User Story
                    </span>
                  ) : (
                    <span className={`rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${categoryStyle.bg} ${categoryStyle.text}`}>
                      {item.category ?? "Task"}
                    </span>
                  )}

                  <div className="flex items-center gap-1">
                    {isDone && (
                      <CheckCircle2 className="size-4 text-emerald-400" />
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          className="rounded-md p-1 text-muted-foreground/50 opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100 outline-none"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="size-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive gap-2"
                          onClick={() => deleteMutation.mutate({ id: item.id })}
                        >
                          <Trash2 className="size-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Title */}
                <h4 className={`mb-1 text-sm font-semibold leading-tight ${isDone ? "text-muted-foreground line-through" : "text-foreground"}`}>
                  {item.title}
                </h4>

                {/* Details */}
                {item.details && (
                  <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-muted-foreground/70">
                    {item.details}
                  </p>
                )}

                {/* Footer for stories - linked tasks count */}
                {isStory && (
                  <div className="mt-2 border-t border-border/30 pt-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50">
                      Linked Tasks: ••
                    </span>
                  </div>
                )}
              </div>
            </DialogTrigger>
          </div>

          <DialogContent className="sm:max-w-[600px] border-border/50 bg-card/95 backdrop-blur-xl">
            <DialogHeader>
              <div className="mb-2 flex items-center gap-2">
                {isStory ? (
                  <Badge variant="outline" className="border-indigo-500/30 bg-indigo-500/10 text-indigo-400">
                    User Story
                  </Badge>
                ) : (
                  <Badge variant="outline" className={`${categoryStyle.bg} ${categoryStyle.text} border-current/20`}>
                    {item.category ?? "Task"}
                  </Badge>
                )}
                <Badge variant="outline" className="border-border/50 uppercase text-[10px]">
                  {item.status}
                </Badge>
              </div>
              <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
                {item.title}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground/60 text-xs font-medium uppercase tracking-wider">
                Created {new Date(item.createdAt).toLocaleDateString()}
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <h5 className="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground/50">Description</h5>
              <ScrollArea className="max-h-[300px] rounded-lg bg-black/20 p-4">
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                  {item.details ?? "No further details provided."}
                </p>
              </ScrollArea>
            </div>
            {isStory && (
              <div className="mt-6 border-t border-border/30 pt-4">
                <h5 className="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground/50">Details</h5>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border border-border/30 p-3 bg-muted/30">
                    <span className="block text-[10px] uppercase text-muted-foreground/50 mb-1">Type</span>
                    <span className="text-sm font-semibold">User Story</span>
                  </div>
                  <div className="rounded-lg border border-border/30 p-3 bg-muted/30">
                    <span className="block text-[10px] uppercase text-muted-foreground/50 mb-1">Id</span>
                    <span className="text-sm font-mono text-xs">{item.id}</span>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </Draggable>
  );
}
