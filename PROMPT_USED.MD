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

### 🚀 Build & Linting Fixes 
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

### 🚀 Kanban Card Edit Feature
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

---

### 🚀 Spec Export Button
**Goal:** Add an export button next to the spec title that lets users download or copy the entire spec state as a pretty-formatted Markdown file.

**Prompt:**
> now in the title of @[src/app/[specId]] next to it add a export button that triggers a drop down with 2 option, download as md or copy as md, and give the entire current state of the spec in a preaty looking markdown format

**Tool Used:** Antigravity with Claude
**Reason:** Creating a new component with markdown generation logic, dropdown UI, and clipboard/download integration

**Outcome/Notes:**
- [x] Created `SpecExportButton` component with dropdown menu (Download as .md / Copy as Markdown).
- [x] Generates structured Markdown with spec metadata, progress summary table, user stories by status, and tasks grouped by category.
- [x] Integrated into spec page header next to title.
- [x] Uses sonner toasts for success/error feedback.
- [x] Fetches work items on the spec page to pass full data to the export component.

---

### 🚀 System Status Page
**Goal:** Add a page to monitor the operational status of the database, LLM service, and backend API.

**Prompt:**
> add a status page that shows operational status of db, llm, and backend and add the button to nav top right

**Tool Used:** Antigravity with Gemini 3.0 Flash
**Reason:** To provide real-time visibility into the health of critical system components.

**Outcome/Notes:**
- [x] Created `src/app/status/page.tsx` displaying status for Backend, Database, and LLM.
- [x] Added visual indicators (Green/Red/Yellow) for different states.
- [x] Added "System Status" button to the top-right navigation in `root` layout.

---

### 🚀 Full-Page Loading Overlay & Auto-Redirect
**Goal:** Replace the inline button loader with a full-page loading overlay featuring a spinner and randomly cycling status messages, and automatically redirect to the generated spec page.

**Prompt:**
> when you click on generate right now it shows loader on button and doesnt even redirect to result once done, i want it to be a full page loader (spinner) and have random changing test below saying generating specs and stuff on that line, use shadcn_skill.md as needed and make sure to redirect to /{id} once done

**Tool Used:** Antigravity with Claude
**Reason:** Improving UX during long-running generation — the inline button spinner was insufficient and lacked redirect logic.

**Outcome/Notes:**
- [x] Installed shadcn `spinner` component.
- [x] Added full-page overlay with `Spinner` and 11 rotating status messages (cycling every 2.5s with fade-in animation).
- [x] Added `onSuccess` handler to redirect to `/{specId}` after generation.
- [x] Added `isRedirecting` state to keep the loader visible until page navigation completes.
- [x] Invalidated `spec.list` query on success so the sidebar updates with the new spec immediately.
- [x] Added active route highlighting in the sidebar via `usePathname()` and `isActive` prop.

---

### 🐛 Load More Button Fix
**Goal:** Fix the "Load More" button in the sidebar that wasn't loading older specs.

**Prompt:**
> the load more button doenst add older specs? the loader acts like working and doesnt add anything once loader finishes

**Tool Used:** Claude Code
**Reason:** Debugging cursor-based pagination issue in tRPC v11 infinite query

**Outcome/Notes:**
- [x] Added `initialCursor: undefined` to `useInfiniteQuery` options in `spec-sidebar.tsx` — required by tRPC v11 + React Query v5 for cursor-based pagination to work.

---
