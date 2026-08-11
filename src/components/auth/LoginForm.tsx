"use client";

import { useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { Spinner } from "@/components/ui/Spinner";
import type { Dictionary } from "@/lib/i18n/dictionary";

type Status = "idle" | "loading" | "sent" | "error";

export function LoginForm({ t }: { t: Dictionary["login"] }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(
          next,
        )}`,
      },
    });

    if (error) {
      setStatus("error");
      setErrorMessage(error.message);
      return;
    }

    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <Alert variant="success">
        {t.sentMessagePrefix}
        <strong>{email}</strong>
        {t.sentMessageSuffix}
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        id="email"
        label={t.emailLabel}
        type="email"
        required
        autoComplete="email"
        placeholder={t.emailPlaceholder}
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      {status === "error" && errorMessage && (
        <Alert variant="error">{errorMessage}</Alert>
      )}
      <Button type="submit" disabled={status === "loading"}>
        {status === "loading" && <Spinner />}
        {t.sendBtn}
      </Button>
    </form>
  );
}
