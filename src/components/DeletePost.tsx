"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Loader2Icon, Trash } from "lucide-react"

interface deletePostProps {
    isDeleting: boolean;
    onDelete: () => Promise<void>;
}

export default function DeletePost({ isDeleting, onDelete }: deletePostProps) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size={"sm"}>
                    {
                        isDeleting
                            ? (
                                <Loader2Icon className="size-4 animate-spin" />
                            ) : (
                                <Trash className="size-4" />
                            )
                    }
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure to want to delete post?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action is not revesible
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        className="hover:bg-rose-600 bg-rose-500 dark:text-zinc-300"
                        onClick={onDelete}
                        disabled={isDeleting}
                    >Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}