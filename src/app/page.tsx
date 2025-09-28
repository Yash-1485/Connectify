import { getPosts } from "@/actions/post.action";
import { getDbUserId } from "@/actions/user.action";
import CreatePost from "@/components/CreatePost";
import PostCard from "@/components/PostCard";
import { Card, CardTitle } from "@/components/ui/card";
import WhomToFollow from "@/components/WhomToFollow";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  const user = await currentUser();
  const posts = await getPosts();
  const dbUserId = await getDbUserId();
  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-2">
      <div className="col-span-6">
        {user ? <CreatePost /> : null}

        {
          user
            ? (
              <div className="space-y-2 mt-2">
                {
                  posts.length > 0
                    ? (
                      posts.map((post) => (
                        <PostCard key={post.id} post={post} dbUserId={dbUserId} />
                      ))
                    ) : (
                      <Card className="px-2 py-4 rounded-xl">
                        <CardTitle className="text-xl text-center font-bold truncate">
                          No posts found!!!
                        </CardTitle>
                      </Card>
                    )
                }
              </div>
            ) : (
              <div className="space-y-2">
                {
                  posts.length > 0
                    ? (
                      posts.slice(0, 3).map((post) => (
                        <PostCard key={post.id} post={post} dbUserId={dbUserId} />
                      ))
                    ) : (
                      <Card className="px-2 py-4 rounded-xl">
                        <CardTitle className="text-xl text-center font-bold truncate">
                          No posts found!!!
                        </CardTitle>
                      </Card>
                    )
              }
              </div>
            )
        }
      </div>

      <div className="hidden lg:block lg:col-span-4">
        <WhomToFollow />
      </div>
    </div>
  );
}
