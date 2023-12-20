import { prisma } from "@/lib/prisma";
import dynamic from "next/dynamic";
import { useMemo } from "react";


export default async function DocumentPage({ params }: { params: { docId: string } }) {
  const RichTextEditor = useMemo(() => {
    return dynamic(() => import("@/components/Editor"), {
      loading: () => <p>loading...</p>,
      ssr: false,
    });
  }, []);

  const document = await prisma.document.findUnique({
    where: {
      id: String(params?.docId),
    }
  });

  return (
    <main className="flex min-h-screen flex-col items-center px-2 lg:px-20">
      <div className=" my-10 flex flex-col items-center justify-center">
        <p className="text-4xl font-bold text-blue-500">noteQ</p>
        <p className="text-xl">your personal sharing notes for free</p>
      </div>

      {document ? <RichTextEditor props={document} /> : <RichTextEditor props={{
        id: params.docId,
        data_doc: '',
        isPassword: false,
        password: ''
      }} />}
    </main>
  )
}