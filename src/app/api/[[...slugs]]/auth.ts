import { redis } from "@/lib/redis";
import Elysia from "elysia";

class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

type Role = "owner" | "public";

export const authMiddleware = new Elysia({ name: "auth" })
  .error({ AuthError })
  .onError(({ code, set }) => {
    if (code === "AuthError") {
      set.status = 401;
      return { error: "Unauthorized" };
    }
  })
  .derive({ as: "scoped" }, async ({ query, cookie: { token }, params }) => {
    const questionId = params.questionId ?? query.questionId;
    const authToken = token?.value ?? "";

    if (!questionId) {
      throw new AuthError("Missing questionId");
    }

    const data = await redis.hgetall<{
      ownerToken: string;
      content: string;
    }>(`question:${questionId}`);

    if (!data?.content || !data?.ownerToken) {
      throw new AuthError("Question not found");
    }

    const role: Role = authToken === data.ownerToken ? "owner" : "public";

    return {
      auth: {
        questionId,
        token,
        role,
        question: data.content,
      },
    };
  });
