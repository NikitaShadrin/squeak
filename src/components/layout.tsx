import { PropsWithChildren } from "react";


export const PageLayout = (props: PropsWithChildren<{}>) => {
  return (
      <main className="h-screen flex justify-center">
        <div className="w-full md:max-w-2xl border-x h-full border-slate-400 ">
          {props.children}
        </div>
      </main>
    )
}