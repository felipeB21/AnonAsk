import { Elysia } from "elysia";
import { redis } from "@/lib/redis";
import { nanoid } from "nanoid";
import z from "zod";
import { authMiddleware } from "./auth";
import { cors } from "@elysiajs/cors";
import { realtime } from "@/lib/realtime";

const Q_TTL_SECONDS = 60 * 60 * 24;

export const ask = new Elysia({ prefix: "/ask" })
  .use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  )
  .post(
    "/",
    async ({ body, cookie: { token } }) => {
      const questionId = nanoid();
      const ownerToken = nanoid(32);

      await redis
        .multi()
        .hset(`question:${questionId}`, {
          id: questionId,
          content: body.question,
          ownerToken,
          createdAt: Date.now(),
        })
        .set(`questionId:${questionId}`, questionId)
        .expire(`question:${questionId}`, Q_TTL_SECONDS)
        .expire(`questionId:${questionId}`, Q_TTL_SECONDS)
        .exec();

      token.set({
        path: "/",
        httpOnly: true,
        value: ownerToken,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        maxAge: Q_TTL_SECONDS,
      });
      return { publicUrl: `/ask/${questionId}` };
    },
    {
      body: z.object({
        question: z.string().min(3).max(300),
      }),
    }
  )
  .use(authMiddleware)
  .get(
    "/:questionId",
    async ({ auth }) => {
      if (auth.role === "owner") {
        const answers = await redis.lrange<{
          id: string;
          questionId: string;
          content: string;
          createdAt: number;
          sender: string;
        }>(`answers:${auth.questionId}`, 0, -1);

        return {
          role: "owner",
          question: auth.question,
          questionId: auth.questionId,
          answers: answers.map((a) => ({
            ...a,
          })),
        };
      }

      return {
        role: "public",
        question: auth.question,
      };
    },
    {
      params: z.object({
        questionId: z.string(),
      }),
    }
  )
  .post(
    "/:questionId/answer",
    async ({ body, auth, set }) => {
      if (auth.role === "owner") {
        set.status = 403;
        return { error: "Owner cannot answer own question" };
      }
      const sender = `anon-${nanoid(5)}`;
      const answer = {
        id: nanoid(),
        sender,
        content: body.content,
        createdAt: Date.now(),
      };

      await redis.rpush(`answers:${auth.questionId}`, JSON.stringify(answer));
      await realtime
        .channel(auth.questionId)
        .emit("answer.content", answer.content);
      await redis.expire(`answers:${auth.questionId}`, Q_TTL_SECONDS);
      return { ok: true };
    },
    {
      params: z.object({
        questionId: z.string(),
      }),
      body: z.object({
        content: z.string().min(2).max(200),
      }),
    }
  );

const app = new Elysia({ prefix: "/api" }).use(ask);

export const GET = app.fetch;
export const POST = app.fetch;
export const DELETE = app.fetch;

export type App = typeof app;
