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
                chatId: z.string().optional(), // Optional; if provided, we'll upsert the chat.
                title: z.string().optional(),
                prompt: z.string(), // The user's prompt
                response: z.string(), // The system's response (e.g., generated legal document text)
            })
        )
        .mutation(async ({ ctx, input }) => {
            if (!ctx.user.userId) {
                throw new Error("Unauthorized client");
            }

            const { chatId, title, prompt, response } = input;

            // Use upsert if chatId is provided; otherwise, create a new chat.
            const chat = chatId
                ? await ctx.db.chat.upsert({
                    where: { id: chatId },
                    update: {
                        updatedAt: new Date(),


                    },
                    create: {
                        id: chatId, // Use provided ID on creation
                        userId: ctx.user.userId,
                        title: title ?? "New Chat",
                    },
                })
                : await ctx.db.chat.create({
                    data: {
                        userId: ctx.user.userId,
                        title: title ?? "New Chat",
                    },
                });

            // Add the message (prompt/response) to the Message table.
            const message = await ctx.db.message.create({
                data: {
                    chatId: chatId!,
                    prompt,
                    response,
                },
            });

            // Return both the chat and the newly created message.
            return { chat, message };
        }),

    getHistory: protectedProcedure.query(async ({ ctx }) => {

        if (!ctx.user.userId) {
            throw new Error("An Error occured");
        }

        const history = await ctx.db.chat.findMany({
            where: {
                userId: ctx.user.userId,
            },
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                title: true,
                id: true,
                messages: {
                    select: {
                        prompt: true,
                        response: true,
                        id: true,

                    }
                }
            }
        })

        return history;
    })

})