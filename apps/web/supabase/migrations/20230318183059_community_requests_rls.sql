create policy "Enable insert for authenticated users only"
on "public"."community_requests"
as permissive
for insert
to authenticated
with check (true);

create policy "Enable select by owners only"
on "public"."community_requests"
as permissive
for select
to authenticated
using ((auth.uid() = user_id));
