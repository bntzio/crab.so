alter table "public"."profiles" drop constraint "profiles_id_fkey";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES users(id) not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

create function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$;

create trigger on_user_created
  after insert on public.users
  for each row execute procedure public.handle_new_user_profile();
