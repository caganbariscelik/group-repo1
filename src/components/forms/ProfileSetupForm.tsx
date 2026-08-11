"use client";

import { useActionState } from "react";
import { updateProfileName, type UpdateProfileNameState } from "@/lib/actions/profile";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { Spinner } from "@/components/ui/Spinner";
import type { Dictionary } from "@/lib/i18n/dictionary";

const initialState: UpdateProfileNameState = { error: null };

export function ProfileSetupForm({
  email,
  next,
  t,
}: {
  email: string;
  next: string;
  t: Dictionary["profileSetup"];
}) {
  const [state, formAction, pending] = useActionState(updateProfileName, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="next" value={next} />
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-slate-800">{t.emailLabel}</span>
        <p className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
          {email}
        </p>
      </div>
      <Input id="name" name="name" label={t.nameLabel} required autoFocus placeholder={t.namePlaceholder} />
      {state.error && <Alert variant="error">{state.error}</Alert>}
      <Button type="submit" disabled={pending}>
        {pending && <Spinner />}
        {t.continueBtn}
      </Button>
    </form>
  );
}
