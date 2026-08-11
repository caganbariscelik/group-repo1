"use client";

import { useActionState } from "react";
import Link from "next/link";
import { submitClaim } from "@/lib/actions/claims";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { Spinner } from "@/components/ui/Spinner";
import type { Dictionary } from "@/lib/i18n/dictionary";

const emptyState = { error: null, success: false };

export function ClaimForm({ itemId, t }: { itemId: string; t: Dictionary }) {
  const boundSubmitClaim = submitClaim.bind(null, itemId);
  const [state, formAction, pending] = useActionState(boundSubmitClaim, emptyState);

  if (state.success) {
    return (
      <Alert variant="success">
        {t.claimForm.submittedMessagePrefix}
        <Link href="/sent-claims" className="font-medium underline">
          {t.claimForm.submittedLinkLabel}
        </Link>
        {t.claimForm.submittedMessageSuffix}
      </Alert>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <Textarea
        id="message"
        name="message"
        label={t.claimForm.proofLabel}
        required
        rows={4}
        placeholder={t.claimForm.proofPlaceholder}
      />

      {state.error && <Alert variant="error">{state.error}</Alert>}

      <Button type="submit" disabled={pending} className="sm:w-auto">
        {pending && <Spinner />}
        {pending ? t.claimForm.submittingBtn : t.claimForm.submitBtn}
      </Button>
    </form>
  );
}
