// Shared file — coordinate with Student 2 before editing.

import { cookies } from "next/headers";
import { DEFAULT_LANG, LANG_COOKIE, dictionaries, type Lang } from "./dictionary";

export async function getLang(): Promise<Lang> {
  const store = await cookies();
  const value = store.get(LANG_COOKIE)?.value;
  return value === "en" ? "en" : DEFAULT_LANG;
}

export async function getDictionary() {
  const lang = await getLang();
  return { lang, t: dictionaries[lang] };
}
