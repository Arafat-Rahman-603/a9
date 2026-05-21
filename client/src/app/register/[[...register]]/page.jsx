"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FaGoogle, FaUser, FaEnvelope, FaImage, FaLock, FaEye, FaEyeSlash, FaCheck, FaTimes } from "react-icons/fa";

export default function Register() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    photoURL: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    document.title = "MediQueue | Register";
  }, []);

  const hasUppercase = /[A-Z]/.test(formData.password);
  const hasLowercase = /[a-z]/.test(formData.password);
  const isLongEnough = formData.password.length >= 6;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrorMsg("");
  };

  const handleGoogleRegister = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (err) {
      toast.error("Failed to start Google registration");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLongEnough || !hasUppercase || !hasLowercase) {
      setErrorMsg("Password does not meet all criteria.");
      toast.error("Please enter a valid password.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    const { data, error } = await authClient.signUp.email(
      {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        image: formData.photoURL || undefined,
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
      const errorText = error.message || "Registration failed. Please try again.";
      setErrorMsg(errorText);
      toast.error(errorText);
      return;
    }

    toast.success("Registration successful! Please log in.");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-base-200/30 flex items-center justify-center p-4 py-20 relative overflow-hidden">
      {}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg bg-base-100 rounded-[2.5rem] shadow-2xl overflow-hidden border border-base-content/5 relative z-10"
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
            Create Account
          </motion.h1>
          <p className="text-white/80 text-sm">Join MediQueue to start scheduling tutoring sessions.</p>
        </div>

        <div className="p-8 md:p-10 space-y-6 bg-base-100">
          {}
          <button
            type="button"
            onClick={handleGoogleRegister}
            className="btn w-full btn-outline border-base-content/20 rounded-2xl flex items-center justify-center gap-3 hover:bg-base-content/5 transition-all h-12 text-base-content/80 hover:text-base-content"
          >
            <FaGoogle className="text-red-500 text-lg" />
            <span>Continue with Google</span>
          </button>

          <div className="flex items-center my-4">
            <div className="flex-grow h-px bg-base-content/10" />
            <span className="px-4 text-xs font-semibold uppercase tracking-wider text-base-content/40">Or register with email</span>
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
                <span className="label-text text-xs font-bold uppercase tracking-wider text-base-content/70">Full Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-base-content/30">
                  <FaUser className="text-sm" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="input input-bordered w-full pl-11 rounded-2xl focus:input-primary transition-all text-sm h-12"
                  required
                />
              </div>
            </div>

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
              <label className="label py-1">
                <span className="label-text text-xs font-bold uppercase tracking-wider text-base-content/70">Photo URL</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-base-content/30">
                  <FaImage className="text-sm" />
                </div>
                <input
                  type="url"
                  name="photoURL"
                  value={formData.photoURL}
                  onChange={handleChange}
                  placeholder="https://example.com/avatar.jpg"
                  className="input input-bordered w-full pl-11 rounded-2xl focus:input-primary transition-all text-sm h-12"
                />
              </div>
            </div>

            {}
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-xs font-bold uppercase tracking-wider text-base-content/70">Password</span>
              </label>
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

              {}
              <div className="mt-3 bg-base-200/50 p-4 rounded-2xl space-y-2 border border-base-content/5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-base-content/50 mb-1">Password Requirements</p>
                <div className="flex items-center gap-2 text-xs">
                  {isLongEnough ? (
                    <span className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0"><FaCheck className="text-[9px]" /></span>
                  ) : (
                    <span className="w-4 h-4 rounded-full bg-base-content/10 text-base-content/30 flex items-center justify-center shrink-0"><FaTimes className="text-[9px]" /></span>
                  )}
                  <span className={isLongEnough ? "text-emerald-500 font-medium" : "text-base-content/50"}>At least 6 characters</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  {hasUppercase ? (
                    <span className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0"><FaCheck className="text-[9px]" /></span>
                  ) : (
                    <span className="w-4 h-4 rounded-full bg-base-content/10 text-base-content/30 flex items-center justify-center shrink-0"><FaTimes className="text-[9px]" /></span>
                  )}
                  <span className={hasUppercase ? "text-emerald-500 font-medium" : "text-base-content/50"}>At least one uppercase letter (A-Z)</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  {hasLowercase ? (
                    <span className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0"><FaCheck className="text-[9px]" /></span>
                  ) : (
                    <span className="w-4 h-4 rounded-full bg-base-content/10 text-base-content/30 flex items-center justify-center shrink-0"><FaTimes className="text-[9px]" /></span>
                  )}
                  <span className={hasLowercase ? "text-emerald-500 font-medium" : "text-base-content/50"}>At least one lowercase letter (a-z)</span>
                </div>
              </div>
            </div>

            {}
            <button
              type="submit"
              disabled={loading}
              className="btn w-full gradient-bg text-white border-0 rounded-2xl h-12 shadow-lg shadow-primary/25 btn-glow mt-2 font-semibold"
            >
              {loading ? <span className="loading loading-spinner"></span> : "Register"}
            </button>
          </form>

          {}
          <p className="text-center text-sm text-base-content/60">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline font-semibold">
              Log in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
