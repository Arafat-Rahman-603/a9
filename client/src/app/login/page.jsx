"use client";

import { useState, Suspense } from "react";
import { signIn } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { FaGoogle, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion";
function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleLogin = async e => {
    e.preventDefault();
    setLoading(true);
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;
    const {
      data,
      error
    } = await signIn.email({
      email,
      password
    });
    setLoading(false);
    if (error) {
      toast.error(error.message || "Invalid email or password!");
    } else {
      toast.success("Login successful!");
      router.push(callbackUrl);
      router.refresh();
    }
  };
  const handleGoogleSignIn = async () => {
    const origin = window.location.origin;
    const absoluteCallbackUrl = callbackUrl.startsWith("http") 
      ? callbackUrl 
      : `${origin}${callbackUrl.startsWith("/") ? "" : "/"}${callbackUrl}`;
    await signIn.social({
      provider: "google",
      callbackURL: absoluteCallbackUrl
    });
  };
  return <div className="min-h-screen bg-base-200/30 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.5
    }} className="card w-full max-w-md bg-base-100 shadow-2xl border border-base-content/5 rounded-[2rem] relative z-10">
        <div className="card-body p-8 md:p-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold gradient-text" style={{
            fontFamily: "var(--font-jakarta)"
          }}>Welcome Back</h1>
            <p className="text-base-content/60 mt-2 text-sm">Log in to book your next learning session</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="form-control">
              <label className="label"><span className="label-text text-xs font-bold uppercase tracking-wider text-base-content/70">Email</span></label>
              <div className="relative">
                <FaEnvelope className="absolute top-4 left-4 text-base-content/40" />
                <input type="email" name="email" placeholder="email@example.com" className="input input-bordered w-full pl-11 rounded-xl h-12" required />
              </div>
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text text-xs font-bold uppercase tracking-wider text-base-content/70">Password</span></label>
              <div className="relative">
                <FaLock className="absolute top-4 left-4 text-base-content/40" />
                <input type={showPassword ? "text" : "password"} name="password" placeholder="••••••••" className="input input-bordered w-full pl-11 rounded-xl h-12" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute top-4 right-4 text-base-content/40 hover:text-primary transition-colors">
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <label className="label mt-1">
                <a href="#" className="label-text-alt link link-hover text-primary font-medium text-xs">Forgot password?</a>
              </label>
            </div>

            <button type="submit" disabled={loading} className="btn w-full gradient-bg text-white border-0 rounded-xl h-12 shadow-lg shadow-primary/30 btn-glow mt-2">
              {loading ? <span className="loading loading-spinner"></span> : "Log In"}
            </button>
          </form>

          <div className="divider text-base-content/40 text-xs my-6">OR CONTINUE WITH</div>

          <button onClick={handleGoogleSignIn} className="btn btn-outline w-full rounded-xl h-12 hover:bg-base-200 hover:text-base-content flex gap-2 border-base-content/10">
            <FaGoogle className="text-red-500" /> Google
          </button>

          <p className="text-center text-sm mt-8 text-base-content/60">
           {" Don't have an account?"} <Link href="/register" className="text-primary font-bold hover:underline">Register here</Link>
          </p>
        </div>
      </motion.div>
    </div>
}

export default function Login() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-base-200/30 flex items-center justify-center p-4 relative overflow-hidden">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}