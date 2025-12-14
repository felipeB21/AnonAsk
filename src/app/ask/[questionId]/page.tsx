"use server";
import { api } from "@/lib/client";
import { cookies } from "next/headers";
import { AnswerForm } from "@/components/answer-form";
import { Providers } from "@/components/provider";
import UseAnswer from "@/hooks/use-answer";
import HomeLink from "@/components/home-link";
import { redirect } from "next/navigation";

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

  if (!data) redirect("/");

  return (
    <Providers>
      <div className="flex flex-col justify-center items-center gap-20 mt-20">
        <div className="flex flex-col items-center">
          <HomeLink />
          <h1 className="text-7xl font-semibold mt-5">{data.question}</h1>
        </div>
        {data.role === "owner" ? (
          <div className="flex flex-col items-center justify-center">
            {data.answers?.length === 0 ? (
              <p className="text-stone-700 mt-20">No answers yet.</p>
            ) : (
              <UseAnswer questionId={data.questionId as string} />
            )}
          </div>
        ) : (
          <AnswerForm questionId={questionId} />
        )}
      </div>
    </Providers>
  );
}
