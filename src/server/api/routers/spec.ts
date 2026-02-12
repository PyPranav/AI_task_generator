import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const specRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: publicProcedure
    .input(z.object({ title: z.string().min(1), goal: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.spec.create({
        data: {
          title: input.title,
          goal: input.goal,
        },
      });
    }),

  getLatest: publicProcedure.query(async ({ ctx }) => {
    const spec = await ctx.db.spec.findFirst({
      orderBy: { createdAt: "desc" },
    });

    return spec ?? null;
  }),
});
