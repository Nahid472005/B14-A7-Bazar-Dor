import { createAuthClient } from "better-auth/react";

export interface AuthUser {
  id: string;
  name?: string;
  email: string;
  image?: string;
  createdAt?: string | Date;
}

export interface AuthSession {
  user: AuthUser;
  session?: {
    id: string;
    userId: string;
    expiresAt: Date;
  };
}

export const authClient = createAuthClient({
  baseURL:
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
});

export const signIn = authClient.signIn;
export const signUp = authClient.signUp;
export const signOut = (options: any = {}): Promise<any> =>
  (authClient.signOut as any)(options);
export const updateUser = (data: any): Promise<any> =>
  (authClient.updateUser as any)(data);

export function useSession() {
  const result = (authClient.useSession as any)();
  return result as {
    data: AuthSession | null;
    isPending: boolean;
    error: any;
  };
}
