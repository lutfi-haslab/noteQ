import { nanoid } from '@/lib/uuid';
import { redirect } from "next/navigation";

export default async function Home() {
  redirect(`/${nanoid()}`)
}

export const dynamic = 'force-dynamic'