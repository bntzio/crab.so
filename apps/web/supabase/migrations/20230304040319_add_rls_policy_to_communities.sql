create policy "Allow read access to public"
on "public"."communities"
as permissive
for select
to public
using (true);



