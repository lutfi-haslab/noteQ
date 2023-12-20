import dynamic from "next/dynamic";
import { useMemo } from "react";


export default function DocumentPage() {
  const RichTextEditor = useMemo(() => {
    return dynamic(() => import("@/components/Editor"), {
      loading: () => <p>loading...</p>,
      ssr: false,
    });
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center px-2 lg:px-20">
      <div className=" my-10 flex flex-col items-center justify-center">
        <p className="text-4xl font-bold text-blue-500">noteQ</p>
        <p className="text-xl">your personal sharing notes for free</p>
      </div>
      <RichTextEditor />
    </main>
  )
}