import { prisma } from "@/lib/prisma"


export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
        const document = await prisma.document.findUnique({
            where: {
                id: String(id),
            }
        });
        return Response.json(document)
    } else {
        const document = await prisma.document.findMany();
        return Response.json(document)
    }

}

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

    const document = await prisma.document.update({
        where: {
            id: res.id
        },
        data: {
            password: res.password,
            isPassword: res.isPassword,
            id: res.newId ? res.newId : res.id
        }
    })

    return Response.json(document)
}