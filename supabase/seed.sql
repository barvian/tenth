INSERT INTO auth.users (id, email) VALUES
('b9511b07-87eb-4e02-bfb5-3b7095129c73', 'unregistered@test.com'),
('6ce7faef-966c-40f3-bb32-d7852c6e8430', 'registered@test.com');

INSERT INTO public.profiles (user_id, first_name, last_name, stripe_id, change_id, percentage) VALUES
('6ce7faef-966c-40f3-bb32-d7852c6e8430', 'Registered', 'User', 'fake-stripe-id', 'fake-change-id', 0.100);