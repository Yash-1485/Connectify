import { getRandomUsers } from "@/actions/user.action"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import FollowButton from "./FollowButton";


const WhomToFollow = async () => {

    const users = await getRandomUsers();

    return (
        <Card className="sticky top-28">
            <CardHeader>
                <CardTitle className="text-xl font-bold truncate">
                    People you may know
                </CardTitle>

                <CardContent className="space-y-4 py-4 px-0">
                    {
                        users.length > 0
                            ? (
                                users.map((user, idx) => (
                                    <div key={idx} className="flex items-start justify-between gap-0.5 w-full border border-muted rounded-xl p-2 cursor-pointer">
                                        <div className="flex items-start">
                                            <Link href={`/profile/${user.username}`}>
                                                <Avatar className="w-9 h-9 mr-2 rounded-full hover:scale-105 transition-all cursor-pointer">
                                                    <AvatarImage src={user?.image || ""} alt={user?.username || "user"} />
                                                    <AvatarFallback>{user?.name}</AvatarFallback>
                                                </Avatar>
                                            </Link>
                                            <div>
                                                <Link href={`/profile/${user.username}`}>
                                                    <p className="text-sm">{user.name}</p>
                                                </Link>
                                                <p className="text-muted-foreground text-xs">@{user.username}</p>
                                                <p className="text-muted-foreground text-xs">Followers {user._count.followers}</p>
                                            </div>
                                        </div>
                                        <div className="flex item-center">
                                            <FollowButton userId={user.id} />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-sm font-bold truncate">
                                    No related users found!!!
                                </div>
                            )
                    }
                </CardContent>
            </CardHeader>
        </Card>
    )
}

export default WhomToFollow