create table "public"."community_requests" (
    "id" uuid not null,
    "created_at" timestamp with time zone default now(),
    "name" text not null,
    "slug" text not null,
    "about" text not null,
    "user_id" uuid not null
);


alter table "public"."community_requests" enable row level security;

CREATE UNIQUE INDEX community_requests_pkey ON public.community_requests USING btree (id);

alter table "public"."community_requests" add constraint "community_requests_pkey" PRIMARY KEY using index "community_requests_pkey";

alter table "public"."community_requests" add constraint "community_requests_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) not valid;

alter table "public"."community_requests" validate constraint "community_requests_user_id_fkey";

alter table "public"."community_requests" alter column "id" set default uuid_generate_v4();
