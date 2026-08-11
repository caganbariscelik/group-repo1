import type { OwnerClaimDetail } from "@/lib/types/domain";
import type { Dictionary } from "@/lib/i18n/dictionary";
import { ClaimRow } from "@/components/my-listings/ClaimRow";

export function ClaimsPanel({ claims, t }: { claims: OwnerClaimDetail[]; t: Dictionary }) {
  if (claims.length === 0) {
    return <p className="mt-2 text-sm text-slate-500">{t.claims.noClaims}</p>;
  }

  return (
    <div className="mt-2">
      <h4 className="text-sm font-medium text-slate-800">
        {t.claims.claimsHeadingPrefix}
        {claims.length}
        {t.claims.claimsHeadingSuffix}
      </h4>
      <ul className="mt-2 flex flex-col gap-2">
        {claims.map((claim) => (
          <ClaimRow key={claim.claim_id} claim={claim} t={t} />
        ))}
      </ul>
    </div>
  );
}
