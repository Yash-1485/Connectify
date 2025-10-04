"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getDbUserId } from "./user.action";

export async function createPost({ content, imageUrl }: { content: string; imageUrl?: string }) {
    try {
        const userId = await getDbUserId();

        if (!userId) return;

        await prisma.post.create({
            data: {
                content,
                image: imageUrl,
                authorId: userId
            }
        });

        revalidatePath("/");
        return { success: true, message: "Post created successfully" }
    } catch (error) {
        console.error("Error while creating posts", error);
        return { success: false, message: "Post creation failed" }
    }
}

export async function getPosts() {
    try {
        const posts = await prisma.post.findMany({
            include: {
                author: {
                    select: {
                        id: true,
                        image: true,
                        username: true,
                        name: true,
                    }
                },
                comments: {
                    include: {
                        author: {
                            select: {
                                id: true,
                                image: true,
                                username: true,
                                name: true,
                            }
                        }
                    },
                    orderBy: {
                        createdAt: "asc"
                    }
                },
                likes: {
                    select: {
                        userId: true,
                    }
                },
                _count: {
                    select: {
                        comments: true,
                        likes: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });
        return posts;
    } catch (error) {
        console.error("Error while getting posts", error);
        return [];
    }
}

export async function toggleLike(postId: string) {
    try {
        const userId = await getDbUserId();
        if (!userId) return;

        const post = await prisma.post.findUnique({
            where: { id: postId },
            select: { authorId: true }
        });

        if (!post) return;

        const existingLike = await prisma.like.findUnique({
            where: {
                userId_postId: {
                    userId,
                    postId
                }
            }
        });

        if (existingLike) {
            await prisma.like.delete({
                where: {
                    userId_postId: {
                        userId,
                        postId
                    }
                }
            })
        } else {
            await prisma.$transaction([
                prisma.like.create({
                    data: {
                        userId,
                        postId
                    }
                }),
                ...(
                    post.authorId === userId
                        ? (
                            []
                        ) : (
                            [prisma.notification.create({
                                data: {
                                    type: "LIKE",
                                    userId: post.authorId,
                                    creatorId: userId,
                                    postId,
                                }
                            })]
                        )
                )
            ])
        }
        revalidatePath("/");
        return { success: true }
    } catch (error) {
        console.error("Error while toggle the likes", error);
        return { success: false, message: "Error while toggling like" }
    }
}

export async function createComment({ postId, content }: { postId: string, content: string }) {
    try {
        const userId = await getDbUserId();

        if (!userId) return;
        if (!content) throw new Error("Content is required");

        const post = await prisma.post.findUnique({
            where: { id: postId },
            select: { authorId: true }
        });

        if (!post) throw new Error("Post doen't exists");

        const [comment] = await prisma.$transaction(async (trx) => {
            const newComment = await trx.comment.create({
                data: {
                    authorId: userId,
                    content: content,
                    postId
                }
            })

            if (post.authorId !== userId) {
                await trx.notification.create({
                    data: {
                        type: "COMMENT",
                        creatorId: userId,
                        userId: post.authorId,
                        postId,
                        commentId: newComment.id
                    }
                })
            }

            return [newComment];
        });

        revalidatePath("/");
        return { success: true, comment }
    } catch (error) {
        console.error("Error while creating comment", error);
        return { success: false, message: "Error while creating comment" }
    }
}

export async function deleteComment(commentId: string) {
    try {
        const userId = await getDbUserId();

        if (!userId) return;

        const comment = await prisma.comment.findUnique({ where: { id: commentId } });

        if (!comment) throw new Error("Comment doesn't exists");
        if (comment.authorId !== userId) throw new Error("You are unauthorized to delete this comment");

        await prisma.comment.delete({
            where: {
                id: commentId
            }
        });

        revalidatePath("/");

        return { success: true }

    } catch (error) {
        console.error("Error while deleting comment", error);
        return { success: false, message: "Error while deleting comment" }
    }
}

export async function deletePost(postId: string) {
    try {
        const userId = await getDbUserId();

        if (!userId) return;

        const post = await prisma.post.findUnique({ where: { id: postId } });

        if (!post) throw new Error("post doesn't exists");
        if (post.authorId !== userId) throw new Error("You are unauthorized to delete this post");

        await prisma.post.delete({
            where: {
                id: postId
            }
        });

        revalidatePath("/");

        return { success: true }
    } catch (error) {
        console.error("Error while deleting post", error);
        return { success: false, message: "Error while deleting post" }
    }
}