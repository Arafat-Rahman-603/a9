import { useUser } from "@clerk/nextjs";

export function useSession() {
  const { user, isLoaded, isSignedIn } = useUser();
  if (!isLoaded) {
    return { data: null, isPending: true };
  }
  if (!isSignedIn || !user) {
    return { data: null, isPending: false };
  }
  return {
    data: {
      user: {
        name: user.fullName || user.username || "",
        email: user.primaryEmailAddress?.emailAddress || "",
        image: user.imageUrl || ""
      }
    },
    isPending: false
  };
}

export const signOut = async (options) => {
  if (typeof window !== "undefined" && window.Clerk) {
    await window.Clerk.signOut();
    if (options?.fetchOptions?.onSuccess) {
      options.fetchOptions.onSuccess();
    }
  }
};