"use client";

import { SignIn } from "@clerk/nextjs";
import { motion } from "framer-motion";

export default function Login() {
  return (
    <div className="min-h-screen bg-base-200/30 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        <SignIn signUpUrl="/register" forceRedirectUrl="/" path="/login" />
      </motion.div>
    </div>
  );
}
