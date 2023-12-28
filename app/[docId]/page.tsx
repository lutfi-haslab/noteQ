import { prisma } from "@/lib/prisma";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton"



const fetchDoc = async (id: string) => {
  const document = await prisma.document.findUnique({
    where: {
      id: String(id),
    }
  });

  if (!document) {
    return {
      id,
      data_doc: '',
      isPassword: false,
      password: ''
    }
  } else {
    return document
  }
}

export default async function DocumentPage({ params }: { params: { docId: string } }) {
  const RichTextEditor = useMemo(() => {
    return dynamic(() => import("@/components/Editor"), {
      loading: () => <>
        <Skeleton className="h-10 w-full bg-gray-600" />
        <Skeleton className=" h-32 w-full bg-gray-600 mt-2" />
      </>,
      ssr: false,
    });
  }, []);

  const document = await fetchDoc(params.docId);
  console.log(document);




  return (
    <main className="flex min-h-screen flex-col items-center px-2 lg:px-20">
      <div className=" my-10 flex flex-col items-center justify-center">
        <p className="text-4xl font-bold text-blue-500">noteQ</p>
        <p className="text-xl">your personal sharing notes for free</p>
      </div>

      {document && <RichTextEditor props={document} className="editor-1" />}
    </main>
  )
}