import { betterAuth } from "better-auth";
import { memoryAdapter } from "better-auth/adapters/memory";

// Global database instance to persist data across Next.js dev reloads
const globalForAuth = globalThis as unknown as {
  authDb?: {
    user: any[];
    session: any[];
    account: any[];
    verification: any[];
  };
};

if (!globalForAuth.authDb) {
  globalForAuth.authDb = {
    user: [],
    session: [],
    account: [],
    verification: [],
  };
}

const db = globalForAuth.authDb;

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET || "bazardor-secret-key-super-secure-token-12345",
  database: memoryAdapter(db),
  trustedOrigins: async (request) => {
    const origin = (request as any)?.headers?.get ? (request as any).headers.get("origin") : null;
    return origin
      ? [origin]
      : [
          "http://localhost:3000",
          "http://127.0.0.1:3000",
          "http://localhost:3001",
          "http://127.0.0.1:3001",
          "http://192.168.43.3:3000",
        ];
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "mock-google-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "mock-google-client-secret",
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || "mock-github-client-id",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "mock-github-client-secret",
    },
  },
});

// Seed default demo account from Figma ("rezwanahmed@gmail.com") if not already present
let isSeeded = false;
export async function seedDemoUser() {
  if (isSeeded) return;
  isSeeded = true;
  try {
    let existing = db.user.find((u) => u.email === "rezwanahmed@gmail.com");
    if (!existing) {
      const res = await auth.api.signUpEmail({
        body: {
          name: "Rezwan Ahmed",
          email: "rezwanahmed@gmail.com",
          password: "password123",
        },
      });
      existing = res.user;
      console.log("Seeded demo account: rezwanahmed@gmail.com / password123");
    }
    if (existing) {
      existing.image = "/avatar.png";
    }
  } catch (err) {
    // Already exists or initialized
  }
}

// Automatically trigger seed
seedDemoUser().catch(() => {});
