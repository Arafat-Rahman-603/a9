import { createAuthClient } from "better-auth/react";

const BETTER_AUTH_URL =
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000";

const saveAuthToken = (token) => {
  if (token && typeof window !== "undefined") {
    localStorage.setItem("auth-token", token);
  }
};

export const authClient = createAuthClient({
  baseURL: BETTER_AUTH_URL,
  fetchOptions: {
    onSuccess: (ctx) => {
      saveAuthToken(ctx.response?.headers?.get("set-auth-token"));
    },
  },
});


export async function syncAuthToken() {
  if (typeof window === "undefined") return;

  try {
    const res = await fetch("/api/auth/token", { credentials: "include" });
    if (!res.ok) return;
    const { token } = await res.json();
    saveAuthToken(token);
  } catch (error) {
    console.error("Failed to sync auth token:", error);
  }
}

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
