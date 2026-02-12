"use client";

import { useState, useCallback, useMemo } from "react";
import {
  DragDropContext,
  type DropResult,
} from "@hello-pangea/dnd";
import { api } from "~/trpc/react";
import { KanbanColumn } from "./kanban-column";
import { KanbanFilters } from "./kanban-filters";
import type { WorkItem } from "generated/prisma";

const COLUMNS = ["TODO", "IN_PROGRESS", "DONE"] as const;

interface KanbanBoardProps {
  specId: string;
}

export function KanbanBoard({ specId }: KanbanBoardProps) {
  const utils = api.useUtils();

  // Filter state
  const [activeType, setActiveType] = useState("ALL");
  const [activeCategory, setActiveCategory] = useState("ALL");

  const { data: workItems, isLoading } = api.spec.getWorkItems.useQuery(
    { specId },
    {
      refetchOnWindowFocus: false,
    },
  );

  const updateMutation = api.spec.updateWorkItemStatus.useMutation({
    onMutate: async ({ id, status: newStatus, orderedIds }) => {
      await utils.spec.getWorkItems.cancel({ specId });
      const previousItems = utils.spec.getWorkItems.getData({ specId });

      utils.spec.getWorkItems.setData({ specId }, (old) => {
        if (!old) return old;
        return old.map((item) => {
          if (item.id === id) {
            const newOrder = orderedIds.indexOf(id);
            return { ...item, status: newStatus, order: newOrder !== -1 ? newOrder : item.order };
          }
          const destIndex = orderedIds.indexOf(item.id);
          if (destIndex !== -1) {
            return { ...item, order: destIndex, status: newStatus };
          }
          return item;
        });
      });

      return { previousItems };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousItems) {
        utils.spec.getWorkItems.setData({ specId }, context.previousItems);
      }
    },
    onSettled: () => {
      void utils.spec.getWorkItems.invalidate({ specId });
    },
  });

  const allItems = useMemo(() => workItems ?? [], [workItems]);

  // Derive unique categories from tasks
  const categories = useMemo(() => {
    const cats = new Set<string>();
    allItems.forEach((item) => {
      if (item.type === "TASK" && item.category) {
        cats.add(item.category.toUpperCase());
      }
    });
    return Array.from(cats).sort();
  }, [allItems]);

  // Counts for filter badges
  const storyCount = useMemo(() => allItems.filter((i) => i.type === "STORY").length, [allItems]);
  const taskCount = useMemo(() => allItems.filter((i) => i.type === "TASK").length, [allItems]);

  // Apply filters
  const filteredItems = useMemo(() => {
    return allItems.filter((item) => {
      // Type filter
      if (activeType !== "ALL" && item.type !== activeType) return false;
      // Category filter (only applies to tasks)
      if (activeCategory !== "ALL" && item.type === "TASK") {
        if ((item.category?.toUpperCase() ?? "") !== activeCategory) return false;
      }
      // If filtering by a specific category, hide stories too
      if (activeCategory !== "ALL" && item.type === "STORY") return false;
      return true;
    });
  }, [allItems, activeType, activeCategory]);

  // Group filtered items by status
  const columns = COLUMNS.reduce(
    (acc, status) => {
      acc[status] = filteredItems
        .filter((item) => item.status === status)
        .sort((a, b) => a.order - b.order);
      return acc;
    },
    {} as Record<(typeof COLUMNS)[number], WorkItem[]>,
  );

  const handleDragEnd = useCallback(
    (result: DropResult) => {
      const { destination, source, draggableId } = result;

      if (!destination) return;

      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      ) {
        return;
      }

      const sourceStatus = source.droppableId as WorkItem["status"];
      const destStatus = destination.droppableId as WorkItem["status"];

      const sourceItems = [...columns[sourceStatus]];
      const destItems =
        sourceStatus === destStatus
          ? sourceItems
          : [...columns[destStatus]];

      const [movedItem] = sourceItems.splice(source.index, 1);
      if (!movedItem) return;

      const updatedItem = { ...movedItem, status: destStatus };
      if (sourceStatus === destStatus) {
        sourceItems.splice(destination.index, 0, updatedItem);
      } else {
        destItems.splice(destination.index, 0, updatedItem);
      }

      const finalDestItems =
        sourceStatus === destStatus ? sourceItems : destItems;
      const orderedIds = finalDestItems.map((item) => item.id);

      updateMutation.mutate({
        id: draggableId,
        status: destStatus,
        orderedIds,
      });
    },
    [columns, updateMutation],
  );

  // Reset category when switching type away from TASK
  const handleTypeChange = useCallback((val: string) => {
    setActiveType(val || "ALL");
    if (val === "STORY") {
      setActiveCategory("ALL");
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 animate-spin rounded-full border-2 border-muted-foreground/20 border-t-primary" />
          <p className="text-sm text-muted-foreground">Loading board…</p>
        </div>
      </div>
    );
  }

  if (allItems.length === 0) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium text-muted-foreground">
            No work items yet
          </p>
          <p className="mt-1 text-sm text-muted-foreground/60">
            Generate a spec to populate the board
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <KanbanFilters
        activeType={activeType}
        onTypeChange={handleTypeChange}
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={(val) => setActiveCategory(val || "ALL")}
        storyCount={storyCount}
        taskCount={taskCount}
      />
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-6 overflow-x-auto p-6">
          {COLUMNS.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              items={columns[status]}
            />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}

