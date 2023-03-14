alter table "public"."users" add column "username" text;

CREATE UNIQUE INDEX users_username_key ON public.users USING btree (username);

alter table "public"."users" add constraint "users_username_key" UNIQUE using index "users_username_key";
