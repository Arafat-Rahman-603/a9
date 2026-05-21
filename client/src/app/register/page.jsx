"use client";

import { useState } from "react";
import { signIn, signUp } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { FaGoogle, FaUser, FaEnvelope, FaImage, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion";
export default function Register() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const validatePassword = password => {
    if (password.length < 6) return "Password must be at least 6 characters";
    if (!/[A-Z]/.test(password)) return "Must have at least one uppercase letter";
    if (!/[a-z]/.test(password)) return "Must have at least one lowercase letter";
    return "";
  };
  const handleRegister = async e => {
    e.preventDefault();
    const form = e.target;
    const name = form.fullName.value;
    const email = form.email.value;
    const image = form.photoURL.value;
    const password = form.password.value;
    const error = validatePassword(password);
    if (error) {
      setPasswordError(error);
      toast.error(error);
      return;
    }
    setPasswordError("");
    setLoading(true);
    const {
      data,
      error: signUpError
    } = await signUp.email({
      name,
      email,
      password,
      image
    });
    setLoading(false);
    if (signUpError) {
      toast.error(signUpError.message || "Registration failed!");
    } else {
      toast.success("Registration successful! Please log in.");
      router.push("/login");
    }
  };
  const handleGoogleSignIn = async () => {
    await signIn.social({
      provider: "google",
      callbackURL: window.location.origin + "/"
    });
  };
  return <div className="min-h-screen bg-base-200/30 flex items-center justify-center p-4 py-12 relative overflow-hidden">
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div initial={{
      opacity: 0,
      scale: 0.95
    }} animate={{
      opacity: 1,
      scale: 1
    }} transition={{
      duration: 0.5
    }} className="card w-full max-w-lg bg-base-100 shadow-2xl border border-base-content/5 rounded-[2rem] relative z-10">
        <div className="card-body p-8 md:p-10">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-extrabold gradient-text" style={{
            fontFamily: "var(--font-jakarta)"
          }}>Create Account</h1>
            <p className="text-base-content/60 mt-2 text-sm">Join MediQueue to start your learning journey</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="form-control">
              <label className="label"><span className="label-text text-xs font-bold uppercase tracking-wider text-base-content/70">Name</span></label>
              <div className="relative">
                <FaUser className="absolute top-4 left-4 text-base-content/40" />
                <input type="text" name="fullName" placeholder="John Doe" className="input input-bordered w-full pl-11 rounded-xl h-12" required />
              </div>
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text text-xs font-bold uppercase tracking-wider text-base-content/70">Email</span></label>
              <div className="relative">
                <FaEnvelope className="absolute top-4 left-4 text-base-content/40" />
                <input type="email" name="email" placeholder="email@example.com" className="input input-bordered w-full pl-11 rounded-xl h-12" required />
              </div>
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text text-xs font-bold uppercase tracking-wider text-base-content/70">Photo URL</span></label>
              <div className="relative">
                <FaImage className="absolute top-4 left-4 text-base-content/40" />
                <input type="url" name="photoURL" placeholder="https://example.com/photo.jpg" className="input input-bordered w-full pl-11 rounded-xl h-12" required />
              </div>
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text text-xs font-bold uppercase tracking-wider text-base-content/70">Password</span></label>
              <div className="relative">
                <FaLock className="absolute top-4 left-4 text-base-content/40" />
                <input type={showPassword ? "text" : "password"} name="password" placeholder="••••••••" className={`input input-bordered w-full pl-11 rounded-xl h-12 ${passwordError ? 'input-error' : ''}`} onChange={() => setPasswordError("")} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute top-4 right-4 text-base-content/40 hover:text-primary transition-colors">
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {passwordError && <span className="text-error text-xs mt-2 font-medium">{passwordError}</span>}
              <div className="mt-2 flex gap-2 flex-wrap">
                <span className="badge badge-xs badge-ghost">6+ chars</span>
                <span className="badge badge-xs badge-ghost">Uppercase</span>
                <span className="badge badge-xs badge-ghost">Lowercase</span>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn w-full gradient-bg text-white border-0 rounded-xl h-12 shadow-lg shadow-primary/30 btn-glow mt-4">
              {loading ? <span className="loading loading-spinner"></span> : "Create Account"}
            </button>
          </form>

          <div className="divider text-base-content/40 text-xs my-6">OR CONTINUE WITH</div>

          <button onClick={handleGoogleSignIn} className="btn btn-outline w-full rounded-xl h-12 hover:bg-base-200 hover:text-base-content flex gap-2 border-base-content/10">
            <FaGoogle className="text-red-500" /> Google
          </button>

          <p className="text-center text-sm mt-8 text-base-content/60">
            Already have an account? <Link href="/login" className="text-primary font-bold hover:underline">Log in here</Link>
          </p>
        </div>
      </motion.div>
    </div>
}