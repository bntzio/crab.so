insert into auth.users
  (id, email)
values
  ('cc898a26-1b71-4ed0-b567-63e18776cb45', 'shaggy@email.com');

insert into public.communities
  (name, public_key, owner, slug)
values
  ('Ghosts', 'FhFUg8VTf5fq97X3q8Cr7yRFAbFGCm2czFhx1WxD92yK', 'cc898a26-1b71-4ed0-b567-63e18776cb45', 'ghosts');
