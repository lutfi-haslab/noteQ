import { redirect } from "next/navigation";
import { nanoid } from "@/lib/uuid";
import * as crypto from 'crypto';

export default async function Home() {
  redirect(`/${nanoid()}`)
}