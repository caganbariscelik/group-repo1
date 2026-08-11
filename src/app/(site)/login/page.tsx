import { Suspense } from "react";
import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";
import { getDictionary } from "@/lib/i18n/server";

export default async function LoginPage() {
  const { t } = await getDictionary();

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6 px-4 py-16">
      <div className="flex flex-col gap-6 rounded-2xl border border-white/10 bg-white p-6 shadow-xl sm:p-8">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">{t.login.title}</h1>
          <p className="mt-1 text-sm text-slate-600">{t.login.description}</p>
        </div>
        <Suspense>
          <LoginForm t={t.login} />
        </Suspense>
      </div>
      <Link href="/" className="text-center text-sm text-slate-300 hover:text-white">
        {t.login.backHome}
      </Link>
    </div>
  );
}
