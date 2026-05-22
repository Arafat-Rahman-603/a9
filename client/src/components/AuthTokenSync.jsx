"use client";

import { useEffect } from "react";
import { authClient, syncAuthToken } from "@/lib/auth-client";

export default function AuthTokenSync() {
  const { data, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;

    if (!data?.user) {
      localStorage.removeItem("auth-token");
      return;
    }

    if (!localStorage.getItem("auth-token")) {
      syncAuthToken();
    }
  }, [data?.user, isPending]);

  return null;
}
