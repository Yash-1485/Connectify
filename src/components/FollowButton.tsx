"use client"

import { useState } from "react";
import { Button } from "./ui/button";
import { LoaderCircleIcon } from "lucide-react";
import toast from "react-hot-toast";
import { toggleFollow } from "@/actions/user.action";

const FollowButton = ({ userId }: { userId: string }) => {

    const [isLoading, setIsLoading] = useState(false);

    const handleFollow = async (userId: string) => {
        try {
            setIsLoading(true);
            const response = await toggleFollow(userId);

            if (response?.success) toast.success("User followed successfully");
        } catch (error) {
            toast.error("Error while following");
            console.error("Error while following", error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Button
            variant={"secondary"}
            size={"default"}
            onClick={() => handleFollow(userId)}
            disabled={isLoading}
        >
            {
                isLoading
                    ? (
                        <LoaderCircleIcon className="size-4 animate-spin" />
                    )
                    : (
                        <span>Follow</span>
                    )
            }
        </Button>
    )
}

export default FollowButton