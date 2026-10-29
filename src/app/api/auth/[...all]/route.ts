import { auth, seedDemoUser } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

seedDemoUser().catch(() => {});

export const { POST, GET } = toNextJsHandler(auth.handler);
