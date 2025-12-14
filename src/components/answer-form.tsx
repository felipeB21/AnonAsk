"use client";

import { useState } from "react";
import { api } from "@/lib/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function AnswerForm({ questionId }: { questionId: string }) {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!value.trim()) return;

    setLoading(true);
    setError(null);

    try {
      await api.ask({ questionId }).answer.post({
        content: value,
      });

      setSent(true);
      setValue("");
    } catch {
      setError("Failed to send answer");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <p className="mt-20 text-muted-foreground">Answer sent anonymously ✓</p>
    );
  }

  return (
    <div className="mt-20 flex flex-col gap-4">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type what you think about..."
      />

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button onClick={submit} disabled={loading}>
        {loading ? "Sending..." : "Send anonymously"}
      </Button>
    </div>
  );
}
