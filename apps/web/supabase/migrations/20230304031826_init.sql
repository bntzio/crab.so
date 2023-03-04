create table "public"."communities" (
    "id" uuid not null,
    "updated_at" timestamp with time zone default now(),
    "name" text not null
);


alter table "public"."communities" enable row level security;

CREATE UNIQUE INDEX communities_pkey ON public.communities USING btree (id);

alter table "public"."communities" add constraint "communities_pkey" PRIMARY KEY using index "communities_pkey";
