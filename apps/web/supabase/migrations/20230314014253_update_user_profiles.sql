alter table "public"."profiles" add column "avatar" text;

alter table "public"."profiles" add column "bio" text;

alter table "public"."profiles" add column "created_at" timestamp with time zone not null default now();

alter table "public"."profiles" add column "updated_at" timestamp with time zone;

alter table "public"."profiles" add column "user_id" integer;

alter table "public"."profiles" add column "username" text;

CREATE UNIQUE INDEX profiles_public_key_key ON public.profiles USING btree (user_id);

CREATE UNIQUE INDEX profiles_username_key ON public.profiles USING btree (username);

alter table "public"."profiles" add constraint "profiles_public_key_key" UNIQUE using index "profiles_public_key_key";

alter table "public"."profiles" add constraint "profiles_username_key" UNIQUE using index "profiles_username_key";

create policy "Everyone can read profiles"
on "public"."profiles" for select using (
  true
);

create policy "Users can update their own profiles"
on "public"."profiles" for update using (
  auth.uid() = id
);
