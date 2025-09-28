"use client"

import { createPost } from "@/actions/post.action";
import { useState } from "react";
import toast from "react-hot-toast";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { ImageIcon, Send } from "lucide-react";
import ImageUpload from "./ImageUpload";

const CreatePost = () => {
    const { user } = useUser();
    const [content, setContent] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [imageUpload, setImageUpload] = useState(false);
    const [posting, setPosting] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!content.trim() && !imageUrl.trim()) {
            toast('Please enter any content or image', {
                icon: 'ℹ️',
                duration: 1000,
            });
            return;
        }

        try {

            setPosting(true);

            const result = await createPost({ content, imageUrl });
            if (result?.success) {
                toast.success(result?.message);
                setContent("");
                setImageUrl("");
            } else {
                toast.error(result?.message ? result.message : "Post creation failed");
            }
        } catch (error) {
            console.error("Error while creating post", error);
            toast.error("Post creation failed");
        } finally {
            setPosting(false);
        }
    }

    return (
        <Card>
            <CardContent>
                <CardHeader className="text-xl font-bold truncate">
                    Create a Post
                </CardHeader>
                <div className="space-y-4">
                    <div className="flex w-full space-x-2">
                        <Avatar className="w-10 h-10 mb-4 rounded-full border-2 border-zinc-300 hover:scale-105 transition-all cursor-pointer">
                            <AvatarImage src={user?.imageUrl || ""} alt={user?.username || "user"} />
                            <AvatarFallback>{user?.fullName}</AvatarFallback>
                        </Avatar>

                        <Textarea placeholder="What's on your mind today??" className="h-20 rounded-xl px-4 py-2" value={content} onChange={(e) => setContent(e.target.value)} />
                    </div>

                    {(imageUpload || imageUrl) && (
                        <div className="border rounded-lg p-4">
                            <ImageUpload
                                endpoint="postImage"
                                value={imageUrl}
                                onChange={(url) => {
                                    setImageUrl(url);
                                    if (!url) setImageUpload(false);
                                }}
                                
                            />
                        </div>
                    )}

                    <div className="flex justify-between space-x-2">
                        <Button
                            variant={"ghost"}
                            size={"default"}
                            onClick={() => {
                                setImageUpload(true);
                            }}
                        >
                            <ImageIcon className="w-4 h-4 mr-0.5" />
                            Image
                        </Button>

                        <Button size={"default"} onClick={(e) => { handleSubmit(e); }} disabled={posting} className="dark:bg-slate-200 dark:hover:bg-white bg-none">
                            <Send className="w-4 h-4 mr-0.5" />
                            {
                                posting
                                    ? (
                                        <span>Posting...</span>
                                    ) : (
                                        <span>Post</span>
                                    )
                            }
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default CreatePost