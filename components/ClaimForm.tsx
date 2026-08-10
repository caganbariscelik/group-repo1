"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitClaim } from "@/lib/actions/claims";

export default function ClaimForm({ itemId }: { itemId: string }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await submitClaim(itemId, message);

    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setSubmitted(true);
    router.refresh();
  }

  if (submitted) {
    return (
      <p className="rounded-md bg-green-50 p-4 text-sm text-green-700">
        Your claim was sent. Track its status on{" "}
        <a href="/sent-claims" className="font-medium underline">
          Sent Claims
        </a>
        .
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label htmlFor="proof" className="block text-sm font-medium text-gray-700">
          Proof of Ownership
        </label>
        <textarea
          id="proof"
          required
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="e.g. The wallet contains a blue student ID and two bank cards."
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60 sm:w-auto"
      >
        {loading ? "Sending…" : "Send Claim"}
      </button>
    </form>
  );
}
