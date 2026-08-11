import Link from "next/link";
import { LogoutButton } from "@/components/auth/LogoutButton";

export function AuthStatusBar({
  name,
  email,
  logoutLabel,
}: {
  name: string;
  email: string;
  logoutLabel: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="text-sm text-slate-300">
        <span className="font-medium text-white">{name}</span>{" "}
        <span className="text-slate-500">{email}</span>
      </div>
      <LogoutButton label={logoutLabel} />
    </div>
  );
}

export function LoginLink({ label }: { label: string }) {
  return (
    <Link
      href="/login"
      className="text-sm font-medium text-white hover:text-slate-300"
    >
      {label}
    </Link>
  );
}
