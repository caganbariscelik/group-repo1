import SignupForm from "@/components/auth/SignupForm";

export default function SignupPage({
  searchParams,
}: {
  searchParams: { redirect?: string };
}) {
  const redirectTo = searchParams.redirect || "/browse";

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">Create an account</h1>
      <SignupForm redirectTo={redirectTo} />
    </div>
  );
}
