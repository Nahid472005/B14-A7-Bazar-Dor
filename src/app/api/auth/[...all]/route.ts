import { auth, seedDemoUser } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

const handler = toNextJsHandler(auth.handler);

export async function GET(request: Request) {
  await seedDemoUser();
  return handler.GET(request);
}

export async function POST(request: Request) {
  await seedDemoUser();
  return handler.POST(request);
}
