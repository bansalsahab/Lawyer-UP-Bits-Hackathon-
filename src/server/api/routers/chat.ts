import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const chats = createTRPCRouter({
    isChat: protectedProcedure.input(z.object({
        chatId: z.string(),
    })).query(async ({ ctx, input }) => {

        if (!ctx.user.userId) {
            throw new Error("unAuthorized client");
        }

        const foundChat = await ctx.db.chat.findUnique({
            where: {
                id: input.chatId
            }
        })

        return foundChat;
    }),

    createChat: protectedProcedure
        .input(
            z.object({
                chatId: z.string(), // Optional so that a new chat doesn't require an ID
                title: z.string().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            if (!ctx.user.userId) {
                throw new Error("Unauthorized client");
            }

            const { chatId, title } = input;

            if (chatId) {
                return await ctx.db.chat.upsert({
                    where: { id: chatId },
                    update: {
                        updatedAt: new Date(),
                        title: title ?? undefined,
                    },
                    create: {
                        id: chatId, // If you want to set the provided ID on creation
                        userId: ctx.user.userId,
                        title: title ?? "New Chat",
                    },
                });
            } else {
                return await ctx.db.chat.create({
                    data: {
                        userId: ctx.user.userId,
                        title: title ?? "New Chat",
                    },
                });
            }
        })

})