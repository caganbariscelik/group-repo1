# Campus Lost & Found

Kampüs için ortak Lost & Found web uygulaması. Next.js (App Router) + Supabase (Auth/DB/Storage) + Tailwind CSS ile geliştirildi.

## Branch Yapısı

- `student1` — Student 1 (Report & Manage): login, item report, my listings, edit/close/delete, claim accept/reject, returned akışı. Ayrıca ortak DB şeması + RLS bu branch'te kuruldu.
- Student 2 kendi branch'inde browse/search/claim-submission tarafını geliştirecek.

## Kurulum

```bash
npm install
cp .env.local.example .env.local   # sonra kendi Supabase URL/anon key değerlerini gir
npm run dev
```

`.env.local` git'e gönderilmez.

## Supabase

`supabase/migrations/` altındaki dosyalar sırayla (0001 → 0002 → 0003) Supabase SQL Editor'da çalıştırılmalı:

- `0001_init_schema.sql` — tablolar (`profiles`, `items`, `claims`), enum'lar, RLS policy'leri, view'lar (`profiles_public`, `owner_claim_details`), claim accept/reject RPC'leri
- `0002_storage.sql` — `item-images` storage bucket'ı ve policy'leri
- `0003_claim_refinements.sql` — claimant'ın accepted claim sonrası owner bilgisini görmesi, tekrar claim engeli, kendi item'ına claim atamama koruması

Authentication → URL Configuration'da Site URL ve Redirect URLs `http://localhost:3000` olarak ayarlanmalı (magic link için).

## Paylaşılan Kontrat (Student 2 için)

- `public.items` herkese (anon dahil) okunabilir — Browse sayfası login gerektirmez.
- `public.profiles_public(id, name)` herkese açık (email içermez).
- `item_status`: `open | claimed | returned | closed` · `claim_status`: `pending | accepted | rejected`
- Claim'ler yalnızca `type = 'found'` ve `status = 'open'` olan item'lara, item'ın sahibi olmayan kullanıcılar tarafından atılabilir (DB trigger ile zorunlu kılınıyor).
- Yeni migration ihtiyaçların olursa `0001_init_schema.sql`'i değiştirme, yeni numaralı bir dosya ekle.
- `src/lib/supabase/*`, `src/lib/types/domain.ts`, `src/lib/constants.ts`, `src/lib/i18n/*` paylaşılan dosyalar — değiştirmeden önce koordine ol.

## Dil

Arayüz TR/EN dil seçiciyle geliyor (`src/lib/i18n/`), varsayılan Türkçe.
