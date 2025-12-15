"use client";

import SpinnerClient from "@/components/spinner";
import { api } from "@/lib/client";
import { useRealtime } from "@/lib/realtime-client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";

export default function UseAnswer({ questionId }: { questionId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const openId = searchParams.get("answer");

  const { data, refetch, isLoading } = useQuery({
    queryKey: ["answers", questionId],
    queryFn: async () => {
      const res = await api.ask({ questionId }).get();
      return res.data;
    },
  });

  useRealtime({
    channels: [questionId],
    events: ["answer.content"],
    onData({ event }) {
      if (event === "answer.content") refetch();
    },
  });

  const openAnswer = (id: string) => {
    router.replace(`?answer=${id}`, { scroll: false });
  };

  const closeAnswer = () => {
    router.replace("?", { scroll: false });
  };

  if (isLoading) return <SpinnerClient />;

  return (
    <>
      <ul className="flex flex-col gap-4 p-3">
        {data?.answers?.map((a) => (
          <li
            key={a.id}
            onClick={() => openAnswer(a.id)}
            className="cursor-pointer max-w-md rounded-2xl border-3 border-purple-500/50
                       bg-linear-to-r from-violet-600 to-indigo-600 p-4 shadow-sm
                       hover:scale-[1.01] transition"
          >
            <div className="flex flex-col gap-1 w-[300px]">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm text-orange-300">
                  {a.sender}
                </p>
                <span
                  className="text-xs text-stone-300"
                  suppressHydrationWarning
                >
                  {format(new Date(a.createdAt), "HH:mm")}
                </span>
              </div>

              <p className="text-sm text-stone-50 leading-relaxed wrap-break-words">
                {a.content}
              </p>
            </div>
          </li>
        ))}
      </ul>

      {openId && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center"
          onClick={closeAnswer}
        >
          <div
            className="bg-zinc-900 rounded-xl p-6 max-w-md w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeAnswer}
              className="absolute top-3 right-3 text-zinc-400 hover:text-white"
            >
              ✕
            </button>

            {data?.answers
              ?.filter((a) => a.id === openId)
              .map((a) => (
                <div key={a.id}>
                  <p className="text-sm text-orange-300 font-semibold">
                    {a.sender}
                  </p>

                  <p className="text-zinc-200 mt-3 whitespace-pre-wrap">
                    {a.content}
                  </p>

                  <p
                    className="text-xs text-zinc-500 mt-4"
                    suppressHydrationWarning
                  >
                    {format(new Date(a.createdAt), "dd/MM/yyyy HH:mm")}
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}
    </>
  );
}
