"use client";

import { useActionState } from "react";
import { CATEGORY_OPTIONS } from "@/lib/types/domain";
import type { Item } from "@/lib/types/domain";
import type { ItemFormState } from "@/lib/actions/items";
import type { Dictionary } from "@/lib/i18n/dictionary";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Alert } from "@/components/ui/Alert";
import { Spinner } from "@/components/ui/Spinner";
import { ImageUploadField } from "@/components/forms/ImageUploadField";

const emptyState: ItemFormState = { error: null, fieldErrors: {} };

export function ItemForm({
  action,
  initialValues,
  submitLabel,
  t,
}: {
  action: (prevState: ItemFormState, formData: FormData) => Promise<ItemFormState>;
  initialValues?: Item;
  submitLabel: string;
  t: Dictionary;
}) {
  const [state, formAction, pending] = useActionState(action, emptyState);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-medium text-slate-800">
          {t.itemForm.typeLegend} <span className="text-red-600">*</span>
        </legend>
        <div className="flex gap-4">
          {(["lost", "found"] as const).map((option) => (
            <label key={option} className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="radio"
                name="type"
                value={option}
                defaultChecked={
                  initialValues ? initialValues.type === option : option === "lost"
                }
                required
              />
              {t.itemType[option]}
            </label>
          ))}
        </div>
      </fieldset>

      <Input
        id="title"
        name="title"
        label={t.itemForm.titleLabel}
        required
        defaultValue={initialValues?.title}
        error={state.fieldErrors.title}
        placeholder={t.itemForm.titlePlaceholder}
      />

      <Textarea
        id="description"
        name="description"
        label={t.itemForm.descriptionLabel}
        required
        rows={4}
        defaultValue={initialValues?.description}
        error={state.fieldErrors.description}
        placeholder={t.itemForm.descriptionPlaceholder}
      />

      <Select
        id="category"
        name="category"
        label={t.itemForm.categoryLabel}
        required
        options={CATEGORY_OPTIONS}
        optionLabels={t.categories}
        placeholder={t.itemForm.categoryPlaceholder}
        defaultValue={initialValues?.category ?? ""}
        error={state.fieldErrors.category}
      />

      <Input
        id="item_date"
        name="item_date"
        label={t.itemForm.dateLabel}
        type="date"
        required
        defaultValue={initialValues?.item_date}
        error={state.fieldErrors.item_date}
      />

      <Input
        id="location"
        name="location"
        label={t.itemForm.locationLabel}
        required
        defaultValue={initialValues?.location}
        error={state.fieldErrors.location}
        placeholder={t.itemForm.locationPlaceholder}
      />

      <ImageUploadField
        required={!initialValues}
        existingImageUrl={initialValues?.image_url}
        serverError={state.fieldErrors.image}
        t={t}
      />

      {state.error && <Alert variant="error">{state.error}</Alert>}

      <Button type="submit" disabled={pending}>
        {pending && <Spinner />}
        {submitLabel}
      </Button>
    </form>
  );
}
