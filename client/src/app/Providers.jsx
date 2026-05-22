"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import AuthTokenSync from "@/components/AuthTokenSync";


export default function Providers({ children }) {
  return (
    <ThemeProvider attribute="data-theme" defaultTheme="light" enableSystem={false}>
      <AuthTokenSync />
      {children}
      <Toaster position="top-center" reverseOrder={false} />
    </ThemeProvider>
  );
}