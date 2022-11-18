begin;
select plan(3);

select
    ok(
        email_exists('max@barvian.me') = false,
        'email_exists() fails for new users'
    );

select
    ok(
        email_exists('unregistered@test.com') = false,
        'email_exists() fails for unregistered users'
    );

select
    ok(
        email_exists('registered@test.com'),
        'email_exists() passes for registered users'
    );

select * from finish();
rollback;
