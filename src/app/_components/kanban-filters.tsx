"use client";

import { Badge } from "~/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import { Filter, Layers, Tag } from "lucide-react";

interface KanbanFiltersProps {
  // Type filter
  activeType: string;
  onTypeChange: (value: string) => void;
  // Category filter
  categories: string[];
  activeCategory: string;
  onCategoryChange: (value: string) => void;
  // Counts
  storyCount: number;
  taskCount: number;
}

export function KanbanFilters({
  activeType,
  onTypeChange,
  categories,
  activeCategory,
  onCategoryChange,
  storyCount,
  taskCount,
}: KanbanFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 px-6 pt-5">
      {/* Filter icon label */}
      <div className="flex items-center gap-2 text-muted-foreground">
        <Filter className="size-4" />
        <span className="text-xs font-semibold uppercase tracking-wider">Filters</span>
      </div>

      <div className="h-5 w-px bg-border/50" />

      {/* Type filter */}
      <div className="flex items-center gap-2">
        <Layers className="size-3.5 text-muted-foreground/60" />
        <ToggleGroup
          type="single"
          value={activeType}
          onValueChange={(val) => onTypeChange(val)}
          variant="outline"
          size="sm"
        >
          <ToggleGroupItem value="ALL" className="gap-1.5 text-xs">
            All
            <Badge variant="secondary" className="ml-0.5 px-1.5 text-[10px]">
              {storyCount + taskCount}
            </Badge>
          </ToggleGroupItem>
          <ToggleGroupItem value="STORY" className="gap-1.5 text-xs">
            Stories
            <Badge variant="secondary" className="ml-0.5 px-1.5 text-[10px]">
              {storyCount}
            </Badge>
          </ToggleGroupItem>
          <ToggleGroupItem value="TASK" className="gap-1.5 text-xs">
            Tasks
            <Badge variant="secondary" className="ml-0.5 px-1.5 text-[10px]">
              {taskCount}
            </Badge>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Category filter — only show when tasks are visible */}
      {(activeType === "ALL" || activeType === "TASK") && categories.length > 0 && (
        <>
          <div className="h-5 w-px bg-border/50" />
          <div className="flex items-center gap-2">
            <Tag className="size-3.5 text-muted-foreground/60" />
            <ToggleGroup
              type="single"
              value={activeCategory}
              onValueChange={(val) => onCategoryChange(val)}
              variant="outline"
              size="sm"
            >
              <ToggleGroupItem value="ALL" className="text-xs">
                All Categories
              </ToggleGroupItem>
              {categories.map((cat) => (
                <ToggleGroupItem key={cat} value={cat} className="text-xs capitalize">
                  {cat.toLowerCase()}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        </>
      )}
    </div>
  );
}
