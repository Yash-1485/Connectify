import { Card, CardContent, CardDescription, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import { Separator } from "./ui/separator";
import { LinkIcon, MapPin } from "lucide-react";

const ProfileCard = ({ user }) => {
    // console.log(user);
    return (
        <>
            <Card className="w-full max-w-full">
                <CardContent className="pt-6">
                    <div className="flex flex-col items-center justify-center">
                        <Link href={`/profile/${user.username ?? user.emailAddress[0].emailAddress.split('@')[0]}`} className="flex flex-col items-center justify-center">
                            <Avatar className="w-16 h-16 mb-4">
                                <AvatarImage src={user.image || ""} alt={user.name} />
                                <AvatarFallback>{user.name}</AvatarFallback>
                            </Avatar>

                            <CardTitle className="text-lg font-medium">{user.name || user.emailAddress[0].emailAddress.split('@')[0]}</CardTitle>
                            <CardDescription className="text-sm text-muted-foreground">@{user.username || user.emailAddress[0].emailAddress.split('@')[0]}</CardDescription>
                        </Link>
                        <Separator className="my-4" />
                        <div className="flex justify-between w-full px-2">
                            <div className="followers flex flex-col items-center gap-1">
                                <div className="text-sm text-secondary-foreground">{user._count.followers}</div>
                                <div className="text-sm text-muted-foreground">Followers</div>
                            </div>
                            <div className="following flex flex-col items-center gap-1">
                                <div className="text-sm text-secondary-foreground">{user._count.following}</div>
                                <div className="text-sm text-muted-foreground">Following</div>
                            </div>
                            <div className="following flex flex-col items-center gap-1">
                                <div className="text-sm text-secondary-foreground">{user._count.posts}</div>
                                <div className="text-sm text-muted-foreground">Posts</div>
                            </div>
                        </div>
                        {
                            (user.bio || user.location || user.website) && <Separator className="my-4" />
                        }
                        <div className="flex w-full flex-col px-2 gap-3">
                            {
                                user.bio && <p className="text-sm text-muted-foreground">{user.bio}</p>
                            }
                            <div className="flex flex-col items-start gap-2 text-sm text-muted-foreground">
                                <p className="flex gap-1 items-center">
                                    <MapPin className="size-4" />
                                    {
                                        user.location
                                            ? <span className="truncate">{user.location}</span>
                                            : "No location"
                                    }
                                </p>
                                <p className="flex gap-1 items-center">
                                    <LinkIcon className="size-4" />
                                    {
                                        user.website
                                            ? <a href={`${user.website}`} className="hover:underline hover:text-secondary-foreground transition truncate" target="_blank">{user.website}</a>
                                            : "No website"
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}

export default ProfileCard;