import Link from 'next/link'
import React from 'react'
import DesktopMenu from './DesktopMenu'
import MobileMenu from './MobileMenu'
import { currentUser } from '@clerk/nextjs/server'
import { syncUser } from '@/actions/user.action'

const Navbar = async () => {

    const user = await currentUser();
    if (user) await syncUser();

    return (
        <nav className='w-full h-20 flex justify-center items-center border-b sticky top-0 z-50 bg-white dark:bg-black' >
            <div className="w-full max-w-6xl px-4 py-2 flex justify-between items-center">
                <div className="px-2">
                    <Link href={"/"} className='text-3xl text-nowrap font-bold'>Connectify</Link>
                </div>

                <DesktopMenu />
                <MobileMenu />
            </div>
        </nav>
    )
}

export default Navbar