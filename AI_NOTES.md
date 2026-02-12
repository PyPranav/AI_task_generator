# AI Development Notes

This file tracks the evolution of the **taskGenerator** project, distinguishing between manual effort and AI assistance.

## 🛠️ Manual Work (Personal)

- [x] Initial T3 Stack setup
- [x] Database setup
- [x] Schema definition
- [x] Shadcn UI initialization
- [x] Fixed some issue with prisma schema related to new sidebar component
- [x] added logic to hit gemini and generate tasks and user query
- [x] Created router function for that integrates genereta tasks and user query funtion

## 🤖 AI-Assisted Work

- [x] Created the sidebar component using shadcn ui
- [x] Created the generation form inputs
- [x] Added new spec button to the sidebar
- [x] fixed build errors so far
- [x] kanban card edit and delete functionality
- [x] export functionality
- [x] added status page
- [x] also have externally used gpt and gemini for the md files

## AI model used for spec generation
I have went ahead with gemini with "gemini-flash-latest" set as model, it currently points to gemini 2.5 flash and will be updated to point to new flash model as google releases stable versions for them. I the major reason for choosing gemini is that the flash model is exceptionally capable for cost effectivness and inference speed, also it suits small projects like this one as we can test stuff out free of cost.