alter table "public"."communities" add column "slug" text not null;

CREATE UNIQUE INDEX communities_slug_key ON public.communities USING btree (slug);

alter table "public"."communities" add constraint "communities_slug_key" UNIQUE using index "communities_slug_key";
