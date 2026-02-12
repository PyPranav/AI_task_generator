import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {generateTasks, generateUserStories} from "~/server/api/utils/geminiInfer";
import { generateBasePrompt } from "../utils/prompts";

interface UserStory {
  title: string;
  details: string;
}

interface Task {
  title: string;
  details: string;
  category: string;
}

export const specRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  generate: publicProcedure
    .input(
      z.object({
        title: z.string().min(1),
        projectGoals: z.string().min(1),
        projectConstraints: z.string().min(1),
        targetUsers: z.string().min(1),
        risks: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      console.log("Generate form submitted:", input);
      const finalPrompt = generateBasePrompt(input);
      const userStoriesRaw = await generateUserStories(finalPrompt);
      
      if (!userStoriesRaw) {
        throw new Error("Failed to generate user stories");
      }

      const updatedPrompt = generateBasePrompt({ ...input, userStories: userStoriesRaw });
      const tasksRaw = await generateTasks(updatedPrompt);

      if (!tasksRaw) {
        throw new Error("Failed to generate tasks");
      }
      try{
        const userStories = JSON.parse(userStoriesRaw.replaceAll('```json', '').replaceAll('```', '').trim()) as UserStory[];
        const tasks = JSON.parse(tasksRaw.replaceAll('```json', '').replaceAll('```', '').trim()) as Task[];

        console.log("User Stories count:", userStories.length);
        console.log("Tasks count:", tasks.length);

        return await ctx.db.$transaction(async (tx) => {
          const spec = await tx.spec.create({
            data: {
              title: input.title,
              goal: input.projectGoals,
              users: input.targetUsers,
              constraints: input.projectConstraints,
              risks: input.risks,
            },
          });

          // Insert Stories in bulk with order starting from 0
          await tx.workItem.createMany({
            data: userStories.map((story, index) => ({
              title: story.title,
              details: story?.details??"",
              type: "STORY",
              specId: spec.id,
              order: index,
            })),
          });

          // Insert Tasks in bulk with order continuing after stories
          const storyCount = userStories.length;
          await tx.workItem.createMany({
            data: tasks.map((task, index) => ({
              title: task.title,
              details: task?.details??"",
              category: task.category,
              type: "TASK",
              specId: spec.id,
              order: storyCount + index,
            })),
          });

          return { success: true, specId: spec.id };
        });
      }
      catch(error){
        console.log(error);
        return { success: false };
      }
    }),

  getLatest: publicProcedure.query(async ({ ctx }) => {
    const spec = await ctx.db.spec.findFirst({
      orderBy: { createdAt: "desc" },
    });

    return spec ?? null;
  }),

  list: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(5),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor } = input;

      const items = await ctx.db.spec.findMany({
        take: limit + 1,
        orderBy: { createdAt: "desc" },
        ...(cursor
          ? {
              cursor: { id: cursor },
              skip: 1,
            }
          : {}),
      });

      let nextCursor: string | undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem?.id;
      }

      return { items, nextCursor };
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.spec.findUniqueOrThrow({
        where: { id: input.id },
      });
    }),

  getWorkItems: publicProcedure
    .input(z.object({ specId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.workItem.findMany({
        where: { specId: input.specId },
        orderBy: { order: "asc" },
      });
    }),

  updateWorkItemStatus: publicProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(["TODO", "IN_PROGRESS", "DONE"]),
        // Full ordered list of item IDs in the destination column
        orderedIds: z.array(z.string()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.$transaction(async (tx) => {
        // Update the dragged item's status
        await tx.workItem.update({
          where: { id: input.id },
          data: { status: input.status },
        });

        // Re-order every item in the destination column
        await Promise.all(
          input.orderedIds.map((itemId, index) =>
            tx.workItem.update({
              where: { id: itemId },
              data: { order: index },
            }),
          ),
        );
      });

      return { success: true };
    }),

  updateWorkItem: publicProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1),
        details: z.string().nullable(),
        category: z.string().nullable(),
        type: z.enum(["STORY", "TASK"]),
        status: z.enum(["TODO", "IN_PROGRESS", "DONE"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      await ctx.db.workItem.update({
        where: { id },
        data,
      });
      return { success: true };
    }),

  deleteWorkItem: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.workItem.delete({
        where: { id: input.id },
      });
      return { success: true };
    }),
});
