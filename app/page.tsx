import * as crypto from 'crypto';
import { redirect } from "next/navigation";

export default async function Home() {
  redirect(`/${crypto.randomBytes(7).toString('hex')}`)
}