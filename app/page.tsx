import { redirect } from "next/navigation";
import * as crypto from 'crypto';

export default function Home() {
  redirect(`/${crypto.randomBytes(5).toString('hex')}`)
}