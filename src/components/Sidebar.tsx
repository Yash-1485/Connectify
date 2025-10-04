import { currentUser } from '@clerk/nextjs/server'
import React from 'react'
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import ProfileCard from './ProfileCard';
import { getUserByClerkId } from '@/actions/user.action'
import { SignInButton, SignUpButton } from '@clerk/nextjs'

const Sidebar = async () => {

    const authUser = await currentUser();
    if (!authUser) return <UnAuthorizedSidebar />;

    const user = await getUserByClerkId(authUser.id);
    if (!user) return null;

    return (
        <div className='sticky top-28'>
            <ProfileCard user={user} />
        </div>
    )
}

export default Sidebar

const UnAuthorizedSidebar = () => {
    return (
        <Card className="w-full max-w-full p-2 flex flex-col justify-center gap-3 text-center sticky top-28">
            <CardHeader className='flex flex-col gap-4'>
                <CardTitle className='text-2xl font-bold text-nowrap'>Welcome Back! 😊</CardTitle>
                <CardDescription>
                    Log into your account to access your profile and connect with others
                </CardDescription>
            </CardHeader>
            <CardContent className='flex flex-col gap-3'>
                <SignInButton mode='modal'>
                    <Button variant={"default"} size={'lg'} className="w-full">
                        Login
                    </Button>
                </SignInButton>
                <SignUpButton mode='modal'>
                    <Button variant={"outline"} size={"lg"} className="w-full">
                        Sign Up
                    </Button>
                </SignUpButton>
            </CardContent>
        </Card>
    )
}