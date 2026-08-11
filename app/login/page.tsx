import LoginForm from "@/components/auth/LoginForm";
import { NeonMesh } from "@/components/ui/neon-mesh";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { redirect?: string };
}) {
  const redirectTo = searchParams.redirect || "/browse";

  return (
    <>
      <NeonMesh variant="backdrop" />
      <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-sm items-center justify-center py-10">
        <div className="w-full rounded-2xl bg-white p-8 shadow-2xl shadow-black/50">
          <h1 className="mb-6 text-2xl font-semibold text-gray-900">Log in</h1>
          <LoginForm redirectTo={redirectTo} />
        </div>
      </div>
    </>
  );
}
