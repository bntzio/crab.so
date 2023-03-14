create table "public"."users" (
    "id" uuid not null,
    "created_at" timestamp with time zone default now(),
    "public_key" text
);


alter table "public"."users" enable row level security;

CREATE UNIQUE INDEX users_pkey ON public.users USING btree (id);

CREATE UNIQUE INDEX users_public_key_key ON public.users USING btree (public_key);

alter table "public"."users" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

alter table "public"."users" add constraint "users_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) not valid;

alter table "public"."users" validate constraint "users_id_fkey";

alter table "public"."users" add constraint "users_public_key_key" UNIQUE using index "users_public_key_key";

drop trigger if exists on_auth_user_created on auth.users;

drop function if exists "public"."handle_new_user"() cascade;

create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id)
  values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
