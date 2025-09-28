"use client"

import Link from 'next/link'
import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { createComment, deletePost, getPosts, toggleLike } from '@/actions/post.action';
import toast from 'react-hot-toast';
import Image from 'next/image';
import DeletePost from './DeletePost';
import { Button } from './ui/button';
import { Heart, LogInIcon, MessageCircle, SendIcon } from 'lucide-react';
import { SignInButton, useUser } from '@clerk/nextjs';
import { Textarea } from './ui/textarea';
import { formatDistanceToNow } from "date-fns";

type Posts = Awaited<ReturnType<typeof getPosts>>;
type Post = Posts[number];

const PostCard = ({ post, dbUserId }: { post: Post, dbUserId: string | null }) => {

    const postUser = post.author;
    const { user } = useUser();
    const [newComment, setNewComment] = useState("");
    const [hasLiked, setHasLiked] = useState(post.likes.some(like => like.userId === dbUserId));
    const [IsCommenting, setIsCommenting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isLiking, setIsLiking] = useState(false);
    const [likes, setLikes] = useState(post._count.likes);
    const [comments, setComments] = useState(post._count.comments);
    const [showComments, setShowComments] = useState(false);

    const handleToggleLike = async () => {
        if (isLiking) return;
        try {
            setIsLiking(true);
            setHasLiked(prev => !prev);
            setLikes((prev) => prev + (hasLiked ? -1 : 1));
            await toggleLike(post.id);

        } catch (error) {
            setLikes(post._count.likes);
            setHasLiked(post.likes.some(like => like.userId === dbUserId));
            console.error("Error occured while liking a Post", error);
            toast.error("Error occured while Liking a Post");
        } finally {
            setIsLiking(false);
        }
    }

    const handleAddNewComment = async () => {
        setIsCommenting(true);
        try {
            if (!(newComment.trim()) || !newComment) {
                toast.error("Add content to comment");
            }
            const result = await createComment({ content: newComment, postId: post.id });

            if (result?.success) {
                toast.success("Commented on a Post");
                setComments((prev) => prev + 1);
                setNewComment("");
            } else {
                throw new Error(result?.message);
            }
        } catch (error) {
            toast.error("Error occured while adding new comment");
            console.error("Error occured while adding new comment", error);
            setComments(post._count.comments);
        } finally {
            setIsCommenting(false);
        }
    }

    const handleDeletePost = async () => {
        if (isDeleting) return;
        try {
            setIsDeleting(true);
            if (dbUserId !== post.authorId) return;

            const result = await deletePost(post.id);

            if (result?.success) {
                toast.success("Post deleted successfully");
            } else {
                throw new Error(result?.message);
            }
        } catch (error) {
            toast.error("Error occured while deleting post");
            console.error("Error occured while deleting post", error);
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <Card className=''>
            <CardHeader>
                <div className="flex items-start gap-2">
                    <Link href={`/profile/${postUser?.username}`}>
                        <Avatar className="w-8 h-8 mr-2 rounded-full hover:scale-105 transition-all cursor-pointer">
                            <AvatarImage src={postUser?.image || ""} alt={postUser?.username || "user"} />
                            <AvatarFallback>{postUser?.name}</AvatarFallback>
                        </Avatar>
                    </Link>
                    <div>
                        <Link href={`/profile/${postUser?.username}`} className='flex gap-2 items-center'>
                            <CardTitle className="text-md">{postUser?.name}</CardTitle>{" "}
                            <span className="text-muted-foreground text-xs">@{postUser?.username}</span>
                        </Link>
                    </div>
                    {
                        post.authorId === dbUserId ? <div className='ms-auto'>
                            <DeletePost isDeleting={isDeleting} onDelete={handleDeletePost} />
                        </div> : null
                    }
                </div>
            </CardHeader>
            <CardContent>
                <CardDescription className='space-y-3'>
                    {
                        post.content && <div className='text-sm text-muted-foreground'>
                            {post.content}
                        </div>
                    }

                    {
                        post.image && <div className='w-full rounded-xl overflow-hidden'>
                            <Image src={post.image} alt={`Image-${post.author.name}`} className='w-full h-auto object-cover' width={500} height={500}/>
                        </div>
                    }

                    <div className="flex space-x-4 items-center">
                        {
                            user ? (
                                <Button variant={'ghost'} size={'sm'} onClick={() => handleToggleLike()} className={`
                                    text-muted-foreground gap-2 transition duration-300 ${hasLiked ? "text-red-500 hover:text-red-500 fill-red-500" : "text-red-500 hover:text-red-500"}
                                `}>
                                    <Heart className='size-4 fill-inherit' />
                                    <span>{likes}</span>
                                </Button>

                            ) : (
                                <SignInButton mode='modal'>
                                    <Button variant={'ghost'} size={'sm'} className="text-muted-foreground gap-2">
                                        <Heart className='size-4 text-red-500' />
                                        <span>{likes}</span>
                                    </Button>
                                </SignInButton>
                            )
                        }

                        <Button variant={'ghost'} size={'sm'} className={`text-blue-600 hover:text-blue-500 ${showComments ? "fill-blue-500" : "hover:fill-none"}`} onClick={() => { setShowComments((prev) => !prev) }}>
                            <MessageCircle className={`size-4 fill-inherit`} />
                            {comments}
                        </Button>

                    </div>
                    {showComments && (
                        <div className="space-y-4 pt-4 border-t">
                            <div className="space-y-4">
                                {/* DISPLAY COMMENTS */}
                                {post.comments.map((comment) => (
                                    <div key={comment.id} className="flex space-x-3">
                                        <Avatar className="size-8 flex-shrink-0">
                                            <AvatarImage src={comment.author.image ?? "/avatar.png"} />
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                                <span className="font-medium text-sm">{comment.author.name}</span>
                                                <span className="text-sm text-muted-foreground">
                                                    @{comment.author.username}
                                                </span>
                                                <span className="text-sm text-muted-foreground">·</span>
                                                <span className="text-sm text-muted-foreground">
                                                    {formatDistanceToNow(new Date(comment.createdAt))} ago
                                                </span>
                                            </div>
                                            <p className="text-sm break-words">{comment.content}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {user ? (
                                <div className="flex space-x-3">
                                    <Avatar className="size-8 flex-shrink-0">
                                        <AvatarImage src={user?.imageUrl || "/avatar.png"} />
                                    </Avatar>
                                    <div className="flex-1">
                                        <Textarea
                                            placeholder="Write a comment..."
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            className="min-h-[80px] resize-none"
                                        />
                                        <div className="flex justify-end mt-2">
                                            <Button
                                                size="sm"
                                                onClick={handleAddNewComment}
                                                className="flex items-center gap-2"
                                                disabled={!newComment.trim() || IsCommenting}
                                            >
                                                {IsCommenting ? (
                                                    "Posting..."
                                                ) : (
                                                    <>
                                                        <SendIcon className="size-4" />
                                                        Comment
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex justify-center p-4 border rounded-lg bg-muted/50">
                                    <SignInButton mode="modal">
                                        <Button variant="outline" className="gap-2">
                                            <LogInIcon className="size-4" />
                                            Sign in to comment
                                        </Button>
                                    </SignInButton>
                                </div>
                            )}
                        </div>
                    )}
                </CardDescription>
            </CardContent>
        </Card>
    )
}


export default PostCard