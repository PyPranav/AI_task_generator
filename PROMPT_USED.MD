# Project Prompt History

This file logs the major prompts used with AI assistants to help build and refine **taskGenerator**. (Logging and formatting of this file performed using **Gemini Flash in Antigravity**)

---

## 📝 Prompt Log

### 🚀 Sidebar Navigation
**Goal:** Create a collapsible sidebar navigation that displays a paginated list of previously generated specifications.

**Prompt:**
> make a side nav component that show all previously generated specs(upto 5 with load more to load older) in a collapsible sidenav use @shadcn_skill.md place the component in @src/app/page.tsx and add it to @src/app/layout.tsx

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

**Outcome/Notes:** 
- [x] Updated `src/app/page.tsx` with a multi-input form using shadcn components.
- [x] Implemented `generate` mutation in `src/server/api/routers/spec.ts`.
- [x] Added state management for loading states during mutation.

## 📋 Template for New Entries
*Copy and paste this when adding a new prompt log.*

```markdown
### 🚀 [Feature Name] - YYYY-MM-DD
**Goal:** 

**Prompt:**
> 

**Outcome/Notes:** 
```
