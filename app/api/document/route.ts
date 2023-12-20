import { prisma } from "@/lib/prisma"


export async function POST(req: Request) {
    const res = await req.json()
    const data = {
        id: res.id,
        data_doc: res.data_doc,
        isPassword: res.isPassword,
        password: res.password
    }

    const document = await prisma.document.upsert({
        create: data,
        update: data,
        where: { id: data.id }
    })

    return Response.json(document)
}

export async function PUT(req: Request) {
    const res = await req.json()
    const data = {
        oldId: res.id,
        newId: res.newId
    }

    const document = await prisma.document.update({
        where: {
            id: data.oldId
        },
        data: {
            id: data.newId
        }
    })

    return Response.json(document)
}