alter table "public"."communities" add column "owner" uuid not null;

alter table "public"."communities" add constraint "communities_owner_fkey" FOREIGN KEY (owner) REFERENCES users(id) not valid;

alter table "public"."communities" validate constraint "communities_owner_fkey";
