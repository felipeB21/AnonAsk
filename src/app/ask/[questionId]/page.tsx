"use server";
import { api } from "@/lib/client";
import { cookies } from "next/headers";
import { AnswerForm } from "@/components/answer-form";
import { format } from "date-fns";
import Link from "next/link";

export default async function AskPage({
  params,
}: {
  params: { questionId: string };
}) {
  const { questionId } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const { data } = await api.ask({ questionId }).get({
    headers: {
      cookie: token ? `token=${token}` : "",
    },
    fetch: {
      cache: "no-store",
    },
  });

  if (!data) return;

  return (
    <div className="flex flex-col justify-center items-center mt-20">
      <Link href={"/"}>
        <h1 className="text-xl font-bold">AnonAsk</h1>
      </Link>
      <h1 className="text-5xl font-semibold">{data.question}</h1>
      {data.role === "owner" ? (
        <div className="flex flex-col items-center justify-center h-[75dvh]">
          {data.answers?.length === 0 ? (
            <p>No answers yet.</p>
          ) : (
            <ul className="border">
              {data.answers?.map((a) => (
                <li key={a.id}>
                  <div className="flex items-center justify-between">
                    <p>{a.content}</p>
                    <p className="text-xs text-stone-700">
                      {format(a.createdAt, "HH:mm")}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <AnswerForm questionId={questionId} />
      )}
    </div>
  );
}
