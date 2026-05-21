import { createAuthClient } from "better-auth/react";

const BETTER_AUTH_URL =
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000";


export const authClient = createAuthClient({
  baseURL: BETTER_AUTH_URL,
  fetchOptions: {
    onSuccess: (ctx) => {

      const token = ctx.response?.headers?.get("set-auth-token");
      if (token && typeof window !== "undefined") {
        localStorage.setItem("auth-token", token);
      }
    },
  },
});


export function useSession() {
  const { data, isPending } = authClient.useSession();

  if (isPending) return { data: null, isPending: true };
  if (!data?.user) return { data: null, isPending: false };

  return {
    data: {
      user: {
        name: data.user.name || "",
        email: data.user.email || "",
        image: data.user.image || "",
      },
    },
    isPending: false,
  };
}


export const signOut = async (options) => {
  await authClient.signOut({
    fetchOptions: {
      onSuccess: () => {

        if (typeof window !== "undefined") {
          localStorage.removeItem("auth-token");
        }
        options?.fetchOptions?.onSuccess?.();
      },
    },
  });
};