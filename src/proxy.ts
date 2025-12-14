import { NextRequest, NextResponse } from "next/server";
import { redis } from "./lib/redis";

export const proxy = async (req: NextRequest) => {
  const pathname = req.nextUrl.pathname;

  const askMatch = pathname.match(/^\/ask\/([^/]+)$/);
  if (!askMatch) return NextResponse.next();

  const questionId = askMatch[1];

  const meta = await redis.hgetall(`question:${questionId}`);

  if (!meta) {
    return NextResponse.redirect(
      new URL("/?error=question-not-found", req.url)
    );
  }

  return NextResponse.next();
};

export const config = {
  matcher: "/ask/:path*",
};
