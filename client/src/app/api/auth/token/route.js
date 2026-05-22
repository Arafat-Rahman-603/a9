import { getSessionCookie } from "better-auth/cookies";
import { headers } from "next/headers";

export async function GET() {
  const token = getSessionCookie(await headers());

  if (!token) {
    return Response.json({ error: "No session" }, { status: 401 });
  }

  return Response.json({ token });
}
