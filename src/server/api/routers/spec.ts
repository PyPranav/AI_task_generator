import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {generateTasks, generateUserStories} from "~/server/api/utils/geminiInfer";
import { generateBasePrompt } from "../utils/prompts";

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
        const userStories = JSON.parse(userStoriesRaw.replaceAll('```json', '').replaceAll('```', '').trim());
        const tasks = JSON.parse(tasksRaw.replaceAll('```json', '').replaceAll('```', '').trim());

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
            data: (userStories as any[]).map((story, index) => ({
              title: story.title,
              details: story?.details??"",
              type: "STORY",
              specId: spec.id,
              order: index,
            })),
          });

          // Insert Tasks in bulk with order continuing after stories
          const storyCount = (userStories as any[]).length;
          await tx.workItem.createMany({
            data: (tasks as any[]).map((task, index) => ({
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
});
