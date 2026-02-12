"use client";

import { Droppable } from "@hello-pangea/dnd";
import { KanbanCard } from "./kanban-card";
import type { WorkItem } from "generated/prisma";
import { ScrollArea } from "~/components/ui/scroll-area";

const STATUS_CONFIG = {
  TODO: {
    label: "TO DO",
    dotColor: "bg-slate-400",
    headerColor: "text-foreground",
  },
  IN_PROGRESS: {
    label: "IN PROGRESS",
    dotColor: "bg-amber-400",
    headerColor: "text-foreground",
  },
  DONE: {
    label: "DONE",
    dotColor: "bg-emerald-400",
    headerColor: "text-emerald-400",
  },
} as const;

interface KanbanColumnProps {
  status: "TODO" | "IN_PROGRESS" | "DONE";
  items: WorkItem[];
}

export function KanbanColumn({ status, items }: KanbanColumnProps) {
  const config = STATUS_CONFIG[status];

  return (
    <div className="flex min-w-[320px] max-w-[360px] flex-1 flex-col">
      {/* Column Header */}
      <div className="mb-4 flex items-center gap-3">
        <div className={`size-2.5 rounded-full ${config.dotColor}`} />
        <h3 className={`text-xs font-bold uppercase tracking-widest ${config.headerColor}`}>
          {config.label}
        </h3>
        <span className="flex size-5 items-center justify-center rounded-md bg-muted text-[10px] font-bold text-muted-foreground">
          {items.length}
        </span>
      </div>

      {/* Droppable Area */}
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 rounded-2xl border-2 border-dashed p-3 transition-all duration-200
              ${snapshot.isDraggingOver
                ? "border-primary/40 bg-primary/5"
                : "border-transparent bg-muted/30"
              }`}
          >
            <ScrollArea className="h-[calc(100vh-14rem)]">
              <div className="pr-2">
                {items.map((item, index) => (
                  <KanbanCard key={item.id} item={item} index={index} />
                ))}
                {provided.placeholder}

                {items.length === 0 && (
                  <div className="flex h-24 items-center justify-center rounded-xl border border-dashed border-border/30">
                    <p className="text-xs text-muted-foreground/40">
                      Drop items here
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        )}
      </Droppable>
    </div>
  );
}
