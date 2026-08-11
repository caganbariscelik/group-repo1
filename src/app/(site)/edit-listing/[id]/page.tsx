import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateItem } from "@/lib/actions/items";
import { ItemForm } from "@/components/forms/ItemForm";
import { getDictionary } from "@/lib/i18n/server";

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { t } = await getDictionary();

  if (!user) {
    redirect(`/login?next=/edit-listing/${id}`);
  }

  const { data: item } = await supabase.from("items").select("*").eq("id", id).single();

  if (!item) {
    notFound();
  }

  if (item.owner_id !== user.id) {
    redirect("/my-listings");
  }

  const boundUpdateItem = updateItem.bind(null, id);

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <div className="rounded-2xl border border-white/10 bg-white p-6 shadow-xl sm:p-8">
        <h1 className="text-2xl font-semibold text-slate-900">{t.editListing.title}</h1>
        <p className="mt-1 text-sm text-slate-600">{t.editListing.description}</p>
        <div className="mt-6">
          <ItemForm
            action={boundUpdateItem}
            initialValues={item}
            submitLabel={t.editListing.submitLabel}
            t={t}
          />
        </div>
      </div>
    </div>
  );
}
