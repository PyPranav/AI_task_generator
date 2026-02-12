"use client";

import { useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { MoreHorizontal, CheckCircle2, Trash2, Pencil, Save, X } from "lucide-react";
import type { WorkItem } from "generated/prisma";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
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
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";

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

const CATEGORIES = Object.keys(CATEGORY_COLORS);
const STATUSES = ["TODO", "IN_PROGRESS", "DONE"] as const;
const TYPES = ["TASK", "STORY"] as const;

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
  const [isEditing, setIsEditing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Edit form state
  const [editTitle, setEditTitle] = useState(item.title);
  const [editDetails, setEditDetails] = useState(item.details ?? "");
  const [editCategory, setEditCategory] = useState(item.category ?? "");
  const [editType, setEditType] = useState<"STORY" | "TASK">(item.type as "STORY" | "TASK");
  const [editStatus, setEditStatus] = useState<"TODO" | "IN_PROGRESS" | "DONE">(item.status as "TODO" | "IN_PROGRESS" | "DONE");

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

  const updateMutation = api.spec.updateWorkItem.useMutation({
    onSuccess: async () => {
      toast.success("Task updated");
      setIsEditing(false);
      await utils.spec.getWorkItems.invalidate({ specId: item.specId });
    },
    onError: (err) => {
      toast.error(`Update failed: ${err.message}`);
    },
  });

  const handleSave = () => {
    updateMutation.mutate({
      id: item.id,
      title: editTitle.trim(),
      details: editDetails.trim() || null,
      category: editCategory.trim() || null,
      type: editType,
      status: editStatus,
    });
  };

  const handleCancelEdit = () => {
    // Reset form to current values
    setEditTitle(item.title);
    setEditDetails(item.details ?? "");
    setEditCategory(item.category ?? "");
    setEditType(item.type as "STORY" | "TASK");
    setEditStatus(item.status as "TODO" | "IN_PROGRESS" | "DONE");
    setIsEditing(false);
  };

  const handleEditClick = () => {
    // Reset form to latest values, then switch to edit mode
    setEditTitle(item.title);
    setEditDetails(item.details ?? "");
    setEditCategory(item.category ?? "");
    setEditType(item.type as "STORY" | "TASK");
    setEditStatus(item.status as "TODO" | "IN_PROGRESS" | "DONE");
    setIsEditing(true);
    setDialogOpen(true);
  };

  const isStory = item.type === "STORY";
  const categoryStyle = getCategoryStyle(item.category);
  const isDone = item.status === "DONE";

  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided, snapshot) => (
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            handleCancelEdit();
          }
        }}>
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
                          className="gap-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditClick();
                          }}
                        >
                          <Pencil className="size-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
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

              </div>
            </DialogTrigger>
          </div>

          <DialogContent className="sm:max-w-[600px] border-border/50 bg-card/95 backdrop-blur-xl">
            <DialogHeader>
              <div className="mb-2 flex items-center gap-2">
                {isEditing ? (
                  <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-400">
                    Editing
                  </Badge>
                ) : isStory ? (
                  <Badge variant="outline" className="border-indigo-500/30 bg-indigo-500/10 text-indigo-400">
                    User Story
                  </Badge>
                ) : (
                  <Badge variant="outline" className={`${categoryStyle.bg} ${categoryStyle.text} border-current/20`}>
                    {item.category ?? "Task"}
                  </Badge>
                )}
                {!isEditing && (
                  <Badge variant="outline" className="border-border/50 uppercase text-[10px]">
                    {item.status}
                  </Badge>
                )}
              </div>
              {!isEditing ? (
                <>
                  <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
                    {item.title}
                  </DialogTitle>
                  <DialogDescription className="text-muted-foreground/60 text-xs font-medium uppercase tracking-wider">
                    Created {new Date(item.createdAt).toLocaleDateString()}
                  </DialogDescription>
                </>
              ) : (
                <>
                  <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
                    Edit Task
                  </DialogTitle>
                  <DialogDescription className="text-muted-foreground/60 text-xs font-medium uppercase tracking-wider">
                    Modify the fields below and save your changes
                  </DialogDescription>
                </>
              )}
            </DialogHeader>

            {/* ─── VIEW MODE ─── */}
            {!isEditing && (
              <>
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
                <div className="mt-4 flex justify-end gap-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    className="gap-2"
                    onClick={() => deleteMutation.mutate({ id: item.id })}
                  >
                    <Trash2 className="size-3.5" />
                    Delete
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => handleEditClick()}
                  >
                    <Pencil className="size-3.5" />
                    Edit
                  </Button>
                </div>
              </>
            )}

            {/* ─── EDIT MODE ─── */}
            {isEditing && (
              <div className="mt-4 space-y-5">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="edit-title" className="text-xs font-bold uppercase tracking-widest text-muted-foreground/50">
                    Title
                  </Label>
                  <Input
                    id="edit-title"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Task title"
                    className="border-border/50 bg-black/20 focus-visible:ring-primary/30"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="edit-details" className="text-xs font-bold uppercase tracking-widest text-muted-foreground/50">
                    Description
                  </Label>
                  <Textarea
                    id="edit-details"
                    value={editDetails}
                    onChange={(e) => setEditDetails(e.target.value)}
                    placeholder="Add details..."
                    rows={5}
                    className="border-border/50 bg-black/20 focus-visible:ring-primary/30 resize-none"
                  />
                </div>

                {/* Type & Status row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-type" className="text-xs font-bold uppercase tracking-widest text-muted-foreground/50">
                      Type
                    </Label>
                    <select
                      id="edit-type"
                      value={editType}
                      onChange={(e) => setEditType(e.target.value as "STORY" | "TASK")}
                      className="flex h-9 w-full rounded-md border border-border/50 bg-black/20 px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/30 text-foreground"
                    >
                      {TYPES.map((t) => (
                        <option key={t} value={t} className="bg-card text-foreground">
                          {t === "STORY" ? "User Story" : "Task"}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-status" className="text-xs font-bold uppercase tracking-widest text-muted-foreground/50">
                      Status
                    </Label>
                    <select
                      id="edit-status"
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as "TODO" | "IN_PROGRESS" | "DONE")}
                      className="flex h-9 w-full rounded-md border border-border/50 bg-black/20 px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/30 text-foreground"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s} className="bg-card text-foreground">
                          {s.replace("_", " ")}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="edit-category" className="text-xs font-bold uppercase tracking-widest text-muted-foreground/50">
                    Category
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setEditCategory("")}
                      className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all duration-150
                        ${editCategory === ""
                          ? "bg-foreground text-background ring-2 ring-foreground/20"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                    >
                      None
                    </button>
                    {CATEGORIES.map((cat) => {
                      const style = getCategoryStyle(cat);
                      const isActive = editCategory.toUpperCase() === cat;
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setEditCategory(cat)}
                          className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all duration-150
                            ${isActive
                              ? `${style.bg} ${style.text} ring-2 ring-current/20 scale-105`
                              : `${style.bg} ${style.text} opacity-50 hover:opacity-80`
                            }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center justify-end gap-3 pt-2 border-t border-border/30">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCancelEdit}
                    className="gap-2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="size-3.5" />
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={!editTitle.trim() || updateMutation.isPending}
                    className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Save className="size-3.5" />
                    {updateMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </Draggable>
  );
}
