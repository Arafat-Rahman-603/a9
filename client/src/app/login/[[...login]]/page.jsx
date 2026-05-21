"use client";

import { useState, useEffect, Suspense } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FaGoogle, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaTimes, FaQuestionCircle } from "react-icons/fa";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    document.title = "MediQueue | Login";
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrorMsg("");
  };

  const handleGoogleLogin = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: callbackUrl,
      });
    } catch (err) {
      toast.error("Failed to start Google login");
    }
  };

  const handleForgetPassword = (e) => {
    e.preventDefault();
    toast.error("Forget password is disabled during evaluation as requested.", {
      icon: "💡",
      duration: 4000,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const { data, error } = await authClient.signIn.email(
      {
        email: formData.email,
        password: formData.password,
      },
      {
        onSuccess: (ctx) => {

          const token = ctx.response?.headers?.get("set-auth-token");
          if (token && typeof window !== "undefined") {
            localStorage.setItem("auth-token", token);
          }
        },
      }
    );

    setLoading(false);

    if (error) {
      setErrorMsg("Invalid email or password. Please verify your credentials.");
      toast.error("Invalid email or password.");
      return;
    }

    toast.success("Welcome back! Logged in successfully.");
    router.push(callbackUrl);
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-base-200/30 flex items-center justify-center p-4 py-20 relative overflow-hidden">
      {}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-base-100 rounded-[2.5rem] shadow-2xl overflow-hidden border border-base-content/5 relative z-10"
      >
        {}
        <div className="gradient-bg p-8 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10 pointer-events-none" />
          <motion.h1
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-3xl font-extrabold mb-2 tracking-tight"
            style={{ fontFamily: "var(--font-jakarta)" }}
          >
            Welcome Back
          </motion.h1>
          <p className="text-white/80 text-sm">Please log in to manage your tutoring sessions.</p>
        </div>

        <div className="p-8 md:p-10 space-y-6 bg-base-100">
          {}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="btn w-full btn-outline border-base-content/20 rounded-2xl flex items-center justify-center gap-3 hover:bg-base-content/5 transition-all h-12 text-base-content/80 hover:text-base-content"
          >
            <FaGoogle className="text-red-500 text-lg" />
            <span>Continue with Google</span>
          </button>

          <div className="flex items-center my-4">
            <div className="flex-grow h-px bg-base-content/10" />
            <span className="px-4 text-xs font-semibold uppercase tracking-wider text-base-content/40">Or sign in with email</span>
            <div className="flex-grow h-px bg-base-content/10" />
          </div>

          {}
          <form onSubmit={handleSubmit} className="space-y-5">
            {errorMsg && (
              <div className="alert alert-error rounded-2xl py-3 px-4 text-sm flex items-start gap-2 bg-error/10 text-error border-0">
                <FaTimes className="shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {}
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-xs font-bold uppercase tracking-wider text-base-content/70">Email Address</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-base-content/30">
                  <FaEnvelope className="text-sm" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="input input-bordered w-full pl-11 rounded-2xl focus:input-primary transition-all text-sm h-12"
                  required
                />
              </div>
            </div>

            {}
            <div className="form-control">
              <div className="flex justify-between items-center py-1">
                <label className="label p-0">
                  <span className="label-text text-xs font-bold uppercase tracking-wider text-base-content/70">Password</span>
                </label>
                {}
                <button
                  type="button"
                  onClick={handleForgetPassword}
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  <FaQuestionCircle className="text-[10px]" />
                  <span>Forget Password?</span>
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-base-content/30">
                  <FaLock className="text-sm" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input input-bordered w-full pl-11 pr-11 rounded-2xl focus:input-primary transition-all text-sm h-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-base-content/30 hover:text-base-content/65 transition-colors"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {}
            <button
              type="submit"
              disabled={loading}
              className="btn w-full gradient-bg text-white border-0 rounded-2xl h-12 shadow-lg shadow-primary/25 btn-glow mt-2 font-semibold"
            >
              {loading ? <span className="loading loading-spinner"></span> : "Log In"}
            </button>
          </form>

          {}
          <p className="text-center text-sm text-base-content/60">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary hover:underline font-semibold">
              Register
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-base-100">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
            <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin" />
          </div>
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
