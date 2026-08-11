"use client";

import { useState, type ChangeEvent } from "react";
import Image from "next/image";
import { validateImageFile } from "@/lib/validation/itemSchema";
import { MAX_IMAGE_MB } from "@/lib/constants";
import type { Dictionary } from "@/lib/i18n/dictionary";

export function ImageUploadField({
  required,
  existingImageUrl,
  serverError,
  t,
}: {
  required: boolean;
  existingImageUrl?: string | null;
  serverError?: string;
  t: Dictionary;
}) {
  const [preview, setPreview] = useState<string | null>(existingImageUrl ?? null);
  const [clientError, setClientError] = useState<string | null>(null);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    const error = validateImageFile(file, required && !existingImageUrl, t);
    setClientError(error);

    if (file && !error) {
      setPreview(URL.createObjectURL(file));
    } else if (!file) {
      setPreview(existingImageUrl ?? null);
    }
  }

  const error = clientError ?? serverError;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="image" className="text-sm font-medium text-slate-800">
        {t.imageUpload.label}
        {required && <span className="text-red-600"> *</span>}
      </label>
      <input
        id="image"
        name="image"
        type="file"
        accept="image/jpeg,image/png"
        onChange={handleChange}
        className="block w-full text-sm text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-slate-800"
      />
      <p className="text-xs text-slate-500">
        {t.imageUpload.helpTextPrefix}
        {MAX_IMAGE_MB}
        {t.imageUpload.helpTextSuffix}
      </p>
      {preview && (
        <Image
          src={preview}
          alt={t.imageUpload.previewAlt}
          width={160}
          height={160}
          unoptimized
          className="h-40 w-40 rounded-md border border-slate-200 object-cover"
        />
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
