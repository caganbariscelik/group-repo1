-- item-images storage bucket: public read, writes scoped to the caller's
-- own {user_id}/ folder.

insert into storage.buckets (id, name, public)
values ('item-images', 'item-images', true)
on conflict (id) do nothing;

create policy "item_images_public_read"
on storage.objects for select
using (bucket_id = 'item-images');

create policy "item_images_owner_insert"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'item-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "item_images_owner_update"
on storage.objects for update
to authenticated
using (bucket_id = 'item-images' and (storage.foldername(name))[1] = auth.uid()::text)
with check (bucket_id = 'item-images' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "item_images_owner_delete"
on storage.objects for delete
to authenticated
using (bucket_id = 'item-images' and (storage.foldername(name))[1] = auth.uid()::text);
