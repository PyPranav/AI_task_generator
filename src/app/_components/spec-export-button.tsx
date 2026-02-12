"use client";

import { useCallback } from "react";
import { Download, Copy, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

interface WorkItem {
  id: string;
  title: string;
  details: string | null;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  type: "STORY" | "TASK";
  order: number;
  category: string | null;
}

interface Spec {
  id: string;
  title: string;
  goal: string;
  users: string;
  constraints: string;
  risks: string;
  createdAt: Date;
}

interface SpecExportButtonProps {
  spec: Spec;
  workItems: WorkItem[];
}

const STATUS_LABELS: Record<string, string> = {
  TODO: "📋 To Do",
  IN_PROGRESS: "🔄 In Progress",
  DONE: "✅ Done",
};

const STATUS_EMOJI: Record<string, string> = {
  TODO: "⬜",
  IN_PROGRESS: "🟡",
  DONE: "✅",
};

function generateMarkdown(spec: Spec, workItems: WorkItem[]): string {
  const createdDate = new Date(spec.createdAt).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const stories = workItems.filter((i) => i.type === "STORY");
  const tasks = workItems.filter((i) => i.type === "TASK");

  // Gather stats
  const totalItems = workItems.length;
  const doneItems = workItems.filter((i) => i.status === "DONE").length;
  const inProgressItems = workItems.filter(
    (i) => i.status === "IN_PROGRESS",
  ).length;
  const todoItems = workItems.filter((i) => i.status === "TODO").length;
  const progressPercent =
    totalItems > 0 ? Math.round((doneItems / totalItems) * 100) : 0;

  // Gather unique categories
  const categories = [
    ...new Set(
      tasks
        .map((t) => t.category)
        .filter(Boolean)
        .sort(),
    ),
  ] as string[];

  let md = "";

  // Title & metadata
  md += `# ${spec.title}\n\n`;
  md += `> **Created:** ${createdDate}  \n`;
  md += `> **Progress:** ${progressPercent}% complete (${doneItems}/${totalItems} items done)\n\n`;
  md += `---\n\n`;

  // Overview section
  md += `## 📌 Project Overview\n\n`;

  md += `### 🎯 Goal\n\n`;
  md += `${spec.goal}\n\n`;

  md += `### 👥 Target Users\n\n`;
  md += `${spec.users}\n\n`;

  if (spec.constraints) {
    md += `### ⚠️ Constraints\n\n`;
    md += `${spec.constraints}\n\n`;
  }

  if (spec.risks) {
    md += `### 🚨 Risks\n\n`;
    md += `${spec.risks}\n\n`;
  }

  md += `---\n\n`;

  // Progress summary
  md += `## 📊 Progress Summary\n\n`;
  md += `| Status | Count |\n`;
  md += `|--------|-------|\n`;
  md += `| ⬜ To Do | ${todoItems} |\n`;
  md += `| 🟡 In Progress | ${inProgressItems} |\n`;
  md += `| ✅ Done | ${doneItems} |\n`;
  md += `| **Total** | **${totalItems}** |\n\n`;

  md += `---\n\n`;

  // User Stories
  if (stories.length > 0) {
    md += `## 📖 User Stories\n\n`;
    const storiesByStatus = groupByStatus(stories);

    for (const status of ["TODO", "IN_PROGRESS", "DONE"] as const) {
      const items = storiesByStatus[status];
      if (items && items.length > 0) {
        md += `### ${STATUS_LABELS[status]}\n\n`;
        for (const story of items) {
          md += `- ${STATUS_EMOJI[story.status]} **${story.title}**\n`;
          if (story.details) {
            md += `  > ${story.details.replace(/\n/g, "\n  > ")}\n`;
          }
          md += `\n`;
        }
      }
    }

    md += `---\n\n`;
  }

  // Tasks
  if (tasks.length > 0) {
    md += `## 🛠️ Tasks\n\n`;

    if (categories.length > 0) {
      // Group by category first, then by status
      for (const category of categories) {
        const catTasks = tasks.filter(
          (t) => t.category?.toUpperCase() === category.toUpperCase(),
        );
        if (catTasks.length === 0) continue;

        const catDone = catTasks.filter((t) => t.status === "DONE").length;
        const catPercent =
          catTasks.length > 0
            ? Math.round((catDone / catTasks.length) * 100)
            : 0;

        md += `### 📂 ${category} (${catPercent}% done)\n\n`;

        const tasksByStatus = groupByStatus(catTasks);
        for (const status of ["TODO", "IN_PROGRESS", "DONE"] as const) {
          const items = tasksByStatus[status];
          if (items && items.length > 0) {
            md += `#### ${STATUS_LABELS[status]}\n\n`;
            for (const task of items) {
              const checkbox =
                task.status === "DONE" ? "- [x]" : "- [ ]";
              md += `${checkbox} **${task.title}**\n`;
              if (task.details) {
                md += `  > ${task.details.replace(/\n/g, "\n  > ")}\n`;
              }
              md += `\n`;
            }
          }
        }
      }

      // Uncategorized tasks
      const uncategorized = tasks.filter(
        (t) => !t.category,
      );
      if (uncategorized.length > 0) {
        md += `### 📂 Uncategorized\n\n`;
        const tasksByStatus = groupByStatus(uncategorized);
        for (const status of ["TODO", "IN_PROGRESS", "DONE"] as const) {
          const items = tasksByStatus[status];
          if (items && items.length > 0) {
            md += `#### ${STATUS_LABELS[status]}\n\n`;
            for (const task of items) {
              const checkbox =
                task.status === "DONE" ? "- [x]" : "- [ ]";
              md += `${checkbox} **${task.title}**\n`;
              if (task.details) {
                md += `  > ${task.details.replace(/\n/g, "\n  > ")}\n`;
              }
              md += `\n`;
            }
          }
        }
      }
    } else {
      // No categories, just group by status
      const tasksByStatus = groupByStatus(tasks);
      for (const status of ["TODO", "IN_PROGRESS", "DONE"] as const) {
        const items = tasksByStatus[status];
        if (items && items.length > 0) {
          md += `### ${STATUS_LABELS[status]}\n\n`;
          for (const task of items) {
            const checkbox =
              task.status === "DONE" ? "- [x]" : "- [ ]";
            md += `${checkbox} **${task.title}**\n`;
            if (task.details) {
              md += `  > ${task.details.replace(/\n/g, "\n  > ")}\n`;
            }
            md += `\n`;
          }
        }
      }
    }
  }

  md += `---\n\n`;
  md += `*Exported from AI Task Generator*\n`;

  return md;
}

function groupByStatus(items: WorkItem[]) {
  const grouped: Record<string, WorkItem[]> = {
    TODO: [],
    IN_PROGRESS: [],
    DONE: [],
  };
  for (const item of items) {
    grouped[item.status]?.push(item);
  }
  return grouped;
}

export function SpecExportButton({ spec, workItems }: SpecExportButtonProps) {
  const markdown = generateMarkdown(spec, workItems);

  const handleDownload = useCallback(() => {
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${spec.title.replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, "_").toLowerCase()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Markdown file downloaded!");
  }, [markdown, spec.title]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      toast.success("Markdown copied to clipboard!");
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  }, [markdown]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          id="spec-export-button"
        >
          <Share2 className="size-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Export Spec</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDownload}>
          <Download className="size-4" />
          Download as .md
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopy}>
          <Copy className="size-4" />
          Copy as Markdown
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
