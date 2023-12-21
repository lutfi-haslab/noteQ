import { nanoid } from '@/lib/uuid';
import { redirect } from "next/navigation";

export default function Home() {
  redirect(`/${nanoid()}`)
}

export const dynamic = 'force-dynamic'