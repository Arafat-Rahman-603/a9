"use client";

import { SignUp } from "@clerk/nextjs";
import { motion } from "framer-motion";

export default function Register() {
  return (
    <div className="min-h-screen bg-base-200/30 flex items-center justify-center p-4 py-12 relative overflow-hidden">
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        <SignUp signInUrl="/login" forceRedirectUrl="/" path="/register" />
      </motion.div>
    </div>
  );
}
