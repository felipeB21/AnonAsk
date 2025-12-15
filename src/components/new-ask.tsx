"use client";

import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { api } from "@/lib/client";
import { useRouter } from "next/navigation";

export default function NewAsk() {
  const { push } = useRouter();
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await api.ask.post({ question });

      if (res.error) {
        const message = res.error.value?.message ?? "Invalid input";

        setError(message);
        return;
      }

      push(res.data.publicUrl);
      setQuestion("");
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-10 w-full max-w-xs">
      <Input
        label="Question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask something anonymously..."
        disabled={loading || success}
        helperText="Only you can read the answers!"
      />

      <Button
        onClick={submit}
        disabled={loading || success}
        className="w-full "
      >
        {loading ? "Sending..." : success ? "Sent!" : "Send"}
      </Button>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
