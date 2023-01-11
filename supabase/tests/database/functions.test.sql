begin;
select plan(3);

insert into auth.users (id, email) values
('b9511b07-87eb-4e02-bfb5-3b7095129c73', 'unregistered@test.com'),
('6ce7faef-966c-40f3-bb32-d7852c6e8430', 'registered@test.com');

insert into public.users (id, stripe_cus_id) values
('6ce7faef-966c-40f3-bb32-d7852c6e8430', 'fake-stripe-id');

-- 

select ok(
    email_exists('max@barvian.me') = false,
    'email_exists() fails for new users'
);

select ok(
    email_exists('unregistered@test.com') = false,
    'email_exists() fails for unregistered users'
);

select ok(
    email_exists('registered@test.com'),
    'email_exists() passes for registered users'
);

select * from finish();
rollback;
