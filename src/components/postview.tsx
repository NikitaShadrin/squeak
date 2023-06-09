import Link from "next/link";
import Image from "next/image";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

import type { RouterOutputs } from "~/utils/api";


type PostWithUser = RouterOutputs["posts"]["getAll"][number]
export const PostView = (props: PostWithUser) => {
  const {post, author} = props
  return (<div key={post.id} className="flex p-4 border-b border-slate-400 gap-3">
    <Image src={author.profilePicture} alt={`@${author.username}'s profile picture`} 
    className="w-12 h-12 rounded-full" width={56} height={56}/>
    <div className="flex flex-col">
      <div className="flex text-slate-300 gap-2 ">
        <Link href={`/@${author.username}`}>
          <span className="text-violet-100 hover:text-violet-400 transition-colors duration-260 " >{`@${author.username}`}</span>
        </Link>
        <Link href={`/post/${post.id}`}>
          <span className="font-thin hover:underline">{dayjs(post.createdAt).fromNow()}</span>
        </Link>
      </div>
      <span className="text-xl">{post.content}</span>
    </div>
  </div>
  )
}