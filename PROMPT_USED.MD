# Project Prompt History

This file logs the major prompts used with AI assistants to help build and refine **taskGenerator**. (Logging and formatting of this file performed using **Gemini Flash in Antigravity**)

---

## 📝 Prompt Log

### 🚀 Sidebar Navigation
**Goal:** Create a collapsible sidebar navigation that displays a paginated list of previously generated specifications.

**Prompt:**
> make a side nav component that show all previously generated specs(upto 5 with load more to load older) in a collapsible sidenav use @shadcn_skill.md place the component in @src/app/page.tsx and add it to @src/app/layout.tsx

**Tool Used:** Claude Code
**Reason:** Fairly complex prompt, with a lot to do

**Outcome/Notes:** 
- [x] Successfully implemented collapsible sidebar with shadcn/ui.
- [x] Integrated with Prisma to fetch and display specs.
- [x] Wrapped application layout with `SidebarProvider`.
- [x] Added `updatedAt` to Prisma schema.

---

### 🚀 Project Spec Generation Form
**Goal:** Create a form on the homepage to take project details and hit a TRPC mutation that logs the input.

**Prompt:**
> lets change the homepage(/) to a form page that takes the following inputs and hits a function in @src/server/api/routers/ make this funtion empty for now just log the form, we need to take input of title, project goals, project constraints, target users for the project, and any risk/constraints that maybe present in the project, and have a generate button which on clicks hits the function then it should go into a loading state till the funtion is completed

**Tool Used:** Claude Code
**Reason:** Fairly complex prompt, with a lot to do

**Outcome/Notes:** 
- [x] Updated `src/app/page.tsx` with a multi-input form using shadcn components.
- [x] Implemented `generate` mutation in `src/server/api/routers/spec.ts`.
- [x] Added state management for loading states during mutation.

---

### 🚀 "New Spec" Button in Sidebar
**Goal:** Add a "New Spec" button in the sidebar to allow users to navigate back to the generation form.

**Prompt:**
> now add a button to side nav on top of previous specs so that i can click on it at any pont to go back to generate screen (/) call in new with + icon

**Tool Used:** Antigravity with Gemini 3 Flash
**Reason:** Simple task of just adding a button

**Outcome/Notes:** 
- [x] Added a "New Spec" button to the sidebar above the previous specs list.
- [x] Styled the button with a "+" icon and hover animations.
- [x] Integrated navigation to the home page (`/`).

---

### 🚀 Kanban Board Interface
**Goal:** Build a draggable Kanban board UI similar to the provided reference, integrated with Supabase.

**Prompt:**
> now add components to _component for required to make ui similar to in image and also i have installed hello-pangea/dnd use it for this just make the ui look similar to the image in dark theme though similar to our current setup, the task/userstory should be dragable and everything should update in supabase accordingly by hitting an appropriate router function

**Tool Used:** Claude Code
**Reason:** Fairly complex prompt, with a lot to do

**Outcome/Notes:** 
- [x] Created `KanbanBoard`, `KanbanColumn`, and `KanbanCard` components.
- [x] Integrated `@hello-pangea/dnd` for drag-and-drop functionality.
- [x] Synchronized board state with Supabase via TRPC mutations.

---

### 🚀 Optimistic UI for Kanban
**Goal:** Prevent "snapping back" during drag-and-drop by implementing optimistic updates.

**Prompt:**
> everything is great but we need optimistic updates after dragging it snaps back to the original location then goes to new locaiton once db is done.

**Tool Used:** Claude Code
**Reason:** Refining UX for better responsiveness

**Outcome/Notes:** 
- [x] Implemented `onMutate`, `onError`, and `onSettled` in TRPC mutation for immediate UI feedback.
- [x] Manually updated query cache to reflect changes before server confirmation.

---

### 🚀 Kanban Filtering
**Goal:** Implement a filter bar to filter work items by type (Story/Task) and by categories.

**Prompt:**
> now add a filter that lets me show and interact with just a category or type use shadcn_skill.md

**Tool Used:** Claude Code
**Reason:** Complex filtering logic integration with existing DnD board

**Outcome/Notes:** 
- [x] Installed shadcn `badge` and `toggle-group` components.
- [x] Created `KanbanFilters` component with type and category toggles.
- [x] Added filter state to `KanbanBoard` and implemented filtering logic.
- [x] Dynamically derived category list from available work items.
- [x] Integrated badge counts for each filter option.

---

### 🚀 Build & Linting Fixes - 2026-02-12
**Goal:** Fix build failures and ESLint errors caused by strict linting rules.

**Prompt:**
> do bun run build and fix errors

**Tool Used:** Antigravity with Gemini 3.0 Flash
**Reason:** Resolving build-time TypeScript and ESLint issues.

**Outcome/Notes:** 
- [x] Fixed unnecessary type assertions in `kanban-board.tsx`.
- [x] Wrapped `allItems` in `useMemo` for hook dependency compliance.
- [x] Added `UserStory` and `Task` interfaces in `spec.ts` for type-safe JSON parsing.
- [x] Replaced `||` with `??` in `toggle-group.tsx` to satisfy `@typescript-eslint/prefer-nullish-coalescing`.
- [x] Successful build completion via `bun run build`.

---

### 🚀 Kanban Card Edit Feature - 2026-02-12
**Goal:** Add an edit option to each task card, accessible from both the dropdown menu and within the detail dialog, allowing full editing of all task fields.

**Prompt:**
> now to kanban-card.tsx add an edit option in dropdown and also inside dialog this should let me edit everything about that task

**Tool Used:** Antigravity with Claude
**Reason:** Adding inline edit functionality with form state management and a new backend mutation

**Outcome/Notes:**
- [x] Added `updateWorkItem` mutation to `spec.ts` for persisting edits (title, details, category, type, status).
- [x] Added "Edit" option with pencil icon to the dropdown menu.
- [x] Dialog toggles between view mode and edit mode.
- [x] Edit mode includes inputs for title, description, type, status, and a pill-based category selector.
- [x] Form resets on cancel or dialog close.

## 📋 Template for New Entries
*Copy and paste this when adding a new prompt log.*

```markdown
### 🚀 [Feature Name] - YYYY-MM-DD
**Goal:** 

**Prompt:**
> 

**Tool Used:** 
**Reason:** 

**Outcome/Notes:** 
```
