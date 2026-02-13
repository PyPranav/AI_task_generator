# AI Task Generator

A web application that generates detailed project specifications, user stories, and engineering tasks from a simple idea using AI.

# Demo Video
![20260213-0619-20 2086544](https://cdn.discordapp.com/attachments/772095706004717578/1471753146555568292/20260213-0616-30.2967034.mp4?ex=6990146d&is=698ec2ed&hm=6f721e89cfce781e44d03bf24b54a0fe5fcb181b1b30a862e8c7922e6b6fb213&)


## Features (What is Done)

- **AI-Powered Spec Generation**: Enter a project idea, goals, and constraints to generate a full specification using Google Gemini Flash.
- **Interactive Kanban Board**: Manage generated tasks with a drag-and-drop interface.
    - **Reorder**: Drag tasks between columns or reorder within columns.
    - **Edit**: Edit task details, types, and categories.
    - **Filter**: Filter tasks by type (Story/Task) or Category.
- **Export Functionality**: Export your spec to a formatted Markdown file or copy to clipboard.
- **History**: View and navigate through the last 5 generated specs via the sidebar.
- **Status Page**: Monitor system health (Database, LLM, Backend) at `/status`.
- **Modern UI**: Built with Shadcn/UI, Tailwind CSS, and Framer Motion for a polished, responsive, dark-mode experience.

## What is Not Done

- **Authentication**: Currently, the app is open and does not require login.
- **Complex Team Features**: No multi-user real-time collaboration (though optimistic UI is implemented).
- **Custom LLM Configuration**: Currently hardcoded to use Gemini Flash via environment variables.

## How to Run

1.  **Clone the repository**
2.  **Install dependencies**:
    ```bash
    bun install
    ```
3.  **Set up Environment Variables**:
    - Copy `.env.example` to `.env`
    - Add your `DATABASE_URL` (PostgreSQL)
    - Add your `GEMINI_API_KEY`
4.  **Initialize Database**:
    ```bash
    bunx prisma db push
    ```
5.  **Run Development Server**:
    ```bash
    bun run dev
    ```
    Open [http://localhost:3000](http://localhost:3000)

## Deployment

To build for production:
```bash
bun run build
bun start
```

## Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/UI
- **Database**: PostgreSQL (via Prisma)
- **State/API**: tRPC, TanStack Query
- **AI**: Google Gemini Flash
