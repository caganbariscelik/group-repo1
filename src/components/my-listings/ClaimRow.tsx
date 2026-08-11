import type { OwnerClaimDetail } from "@/lib/types/domain";
import type { Dictionary } from "@/lib/i18n/dictionary";
import { ClaimStatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { acceptClaim, rejectClaim } from "@/lib/actions/claims";

export function ClaimRow({ claim, t }: { claim: OwnerClaimDetail; t: Dictionary }) {
  return (
    <li className="flex flex-col gap-2 rounded-md border border-slate-200 bg-slate-50 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-medium text-slate-900">
          {claim.claimant_name ?? t.claims.unknown}
        </span>
        <ClaimStatusBadge status={claim.claim_status} t={t} />
      </div>
      <p className="text-sm text-slate-700">{claim.message}</p>
      {claim.claim_status === "accepted" ? (
        <p className="text-xs text-slate-500">{claim.claimant_email}</p>
      ) : (
        <p className="text-xs text-slate-400">{t.claims.emailHidden}</p>
      )}
      {claim.claim_status === "pending" && (
        <div className="flex gap-2">
          <form action={acceptClaim}>
            <input type="hidden" name="claimId" value={claim.claim_id} />
            <Button type="submit" variant="primary" className="px-3 py-1 text-xs">
              {t.claims.accept}
            </Button>
          </form>
          <form action={rejectClaim}>
            <input type="hidden" name="claimId" value={claim.claim_id} />
            <Button type="submit" variant="danger" className="px-3 py-1 text-xs">
              {t.claims.reject}
            </Button>
          </form>
        </div>
      )}
    </li>
  );
}
