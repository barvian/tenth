import { useUser } from '@supabase/auth-helpers-react';
import clsx from 'clsx';
import Link from 'next/link';
import Logo from './icons/Logo';

export default function({ className }: { className?: string}) {
    const { user } = useUser()

    return (
        <div className={clsx('inner flex items-center justify-between', className)}>
            <Link href="/">
                <a className="block w-min"><Logo /></a>
            </Link>

            {user ? (
                <Link href="/api/auth/logout">Sign out</Link>
            ) : (
                <Link href="/login"><a className="text-dim text-sm">Sign in</a></Link>
            )}
        </div>
    )
}