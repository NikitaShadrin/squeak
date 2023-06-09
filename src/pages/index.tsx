import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

import { api } from "~/utils/api";
import { LoadingPage, LoadingSpinner } from "~/components/loading";
import { useState } from "react";
import toast from "react-hot-toast";
import { PageLayout } from "~/components/layout";
import { PostView } from "~/components/postview";

const CreatePostWizard = () => {
  const { user } = useUser()

  const [input, setInput] = useState("");

  const ctx = api.useContext();

  const {mutate, isLoading: isPosting} = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.posts.getAll.invalidate();
    },
    onError: (e) => {
      const erorrMessage = e.data?.zodError?.fieldErrors.content
      if (erorrMessage && erorrMessage[0]) {
        toast.error(erorrMessage[0]);
      } else {
        toast.error("Failed to post! Try again later.")
      }
    }
  });

  if (!user) return null

  return (
    <div className="flex gap-4 w-full items-center">
      <UserButton />
      <input 
        placeholder="What's on your mind?" 
        className="bg-transparent grow outline-none h-10"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if(e.key === "Enter") {
            e.preventDefault();
            if (input !== "") {
              mutate({content: input});
            }
          }
        }}
        disabled={isPosting}
      />
      {input !== "" && !isPosting && (<button onClick={() => mutate({ content: input})}
      className="bg-violet-700 hover:bg-violet-900 transition-colors duration-180 text-violet-100 font-bold py-2 px-4 rounded-full" >
        Post
      </button>)}
      {isPosting && <div className="flex justify-center items-center"><LoadingSpinner size={20} /></div>}
    </div>
  ) 
}




const Feed = () => {
  const { data, isLoading: postsLoading } = api.posts.getAll.useQuery()

  if (postsLoading) return <LoadingPage />

  if (!data) return <div>Something went wrong</div>

  return (
    <div className="flex flex-col">
      {data.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>
  )
}

const Home: NextPage = () => {

  const {isLoaded: userLoaded, isSignedIn} = useUser()

  api.posts.getAll.useQuery()

  if (!userLoaded) return <div/>

  return (
    <PageLayout>
      <div className="border-b border-slate-400 p-4 flex">
      {!isSignedIn && (
        <div className="flex justify-center">
          <SignInButton/>
        </div>)}
      {isSignedIn && <CreatePostWizard/>}
      </div>
        <Feed />
    </PageLayout>
  )
}

export default Home