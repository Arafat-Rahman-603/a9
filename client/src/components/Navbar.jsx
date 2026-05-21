"use client";

import Link from "next/link";
import { useSession, signOut } from "@/lib/auth-client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FaMoon, FaSun, FaBars, FaTimes, FaGraduationCap, FaChevronDown } from "react-icons/fa";
const navLinks = [{
  href: "/",
  label: "Home"
}, {
  href: "/tutors",
  label: "Tutors"
}];
const privateLinks = [{
  href: "/add-tutor",
  label: "Add Tutor"
}, {
  href: "/my-tutors",
  label: "My Tutors"
}, {
  href: "/my-bookings",
  label: "My Bookings"
}];
export default function Navbar() {
  const {
    data: session,
    isPending
  } = useSession();
  const {
    theme,
    setTheme
  } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);
  const user = session?.user;
  const allLinks = user ? [...navLinks, ...privateLinks] : navLinks;
  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          router.refresh();
        }
      }
    });
  };
  return <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "glass border-b border-white/10 shadow-lg shadow-black/10" : "bg-transparent"}`}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-xl gradient-bg flex items-center justify-center shadow-lg">
              <FaGraduationCap className="text-white text-sm" />
            </div>
            <span className="text-lg font-bold gradient-text hidden sm:block" style={{
            fontFamily: "var(--font-jakarta)"
          }}>MediQueue</span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {allLinks.map(link => <Link key={link.href} href={link.href} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${pathname === link.href ? "bg-primary/15 text-primary" : "text-base-content/70 hover:text-base-content hover:bg-base-content/5"}`}>
                {link.label}
              </Link>)}
          </div>

          <div className="flex items-center gap-2">
            {mounted && <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="w-9 h-9 rounded-xl flex items-center justify-center text-base-content/60 hover:text-base-content hover:bg-base-content/10 transition-all duration-200">
                <AnimatePresence mode="wait">
                  {theme === "dark" ? <motion.span key="sun" initial={{
                rotate: -90,
                opacity: 0
              }} animate={{
                rotate: 0,
                opacity: 1
              }} exit={{
                rotate: 90,
                opacity: 0
              }} transition={{
                duration: 0.2
              }}><FaSun className="text-amber-400 w-4 h-4" /></motion.span> : <motion.span key="moon" initial={{
                rotate: 90,
                opacity: 0
              }} animate={{
                rotate: 0,
                opacity: 1
              }} exit={{
                rotate: -90,
                opacity: 0
              }} transition={{
                duration: 0.2
              }}><FaMoon className="text-indigo-500 w-4 h-4" /></motion.span>}
                </AnimatePresence>
              </button>}

            {isPending ? <div className="w-8 h-8 rounded-full bg-base-300 animate-pulse" /> : user ? <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="flex items-center gap-2 cursor-pointer px-2 py-1 rounded-xl hover:bg-base-content/5 transition-all duration-200">
                  <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-primary/30">
                    <img alt="avatar" src={user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "U")}&background=6366f1&color=fff`} className="w-full h-full object-cover" />
                  </div>
                  <FaChevronDown className="text-xs text-base-content/50 hidden sm:block" />
                </div>
                <ul tabIndex={0} className="dropdown-content z-[100] mt-2 p-2 shadow-2xl glass-card border border-base-content/10 rounded-2xl w-52">
                  <li className="px-3 py-2">
                    <p className="font-semibold text-sm truncate">{user.name}</p>
                    <p className="text-xs text-base-content/50 truncate">{user.email}</p>
                  </li>
                  <div className="divider my-1 h-px bg-base-content/10" />
                  {privateLinks.map(link => <li key={link.href}><Link href={link.href} className="flex items-center px-3 py-2 rounded-xl text-sm hover:bg-primary/10 hover:text-primary transition-all duration-200">{link.label}</Link></li>)}
                  <div className="divider my-1 h-px bg-base-content/10" />
                  <li><button onClick={handleSignOut} className="w-full text-left px-3 py-2 rounded-xl text-sm text-error hover:bg-error/10 transition-all duration-200">Sign out</button></li>
                </ul>
              </div> : <div className="flex items-center gap-2">
                <Link href="/login" className="px-4 py-1.5 text-sm font-medium text-base-content/70 hover:text-base-content transition-colors">Log in</Link>
                <Link href="/register" className="px-4 py-1.5 text-sm font-semibold text-white rounded-xl gradient-bg btn-glow">Get Started</Link>
              </div>}

            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center hover:bg-base-content/10 transition-all duration-200">
              {mobileOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {mobileOpen && <motion.div initial={{
        opacity: 0,
        y: -20
      }} animate={{
        opacity: 1,
        y: 0
      }} exit={{
        opacity: 0,
        y: -20
      }} transition={{
        duration: 0.2
      }} className="fixed top-16 left-0 right-0 z-40 glass-card border-b border-base-content/10 p-4 lg:hidden">
            <div className="flex flex-col gap-1">
              {allLinks.map(link => <Link key={link.href} href={link.href} className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${pathname === link.href ? "bg-primary/15 text-primary" : "hover:bg-base-content/5"}`}>{link.label}</Link>)}
              {!user && <div className="flex gap-2 mt-2 pt-2 border-t border-base-content/10">
                  <Link href="/login" className="flex-1 btn btn-ghost btn-sm rounded-xl">Log in</Link>
                  <Link href="/register" className="flex-1 btn btn-sm rounded-xl text-white gradient-bg border-0">Get Started</Link>
                </div>}
            </div>
          </motion.div>}
      </AnimatePresence>
    </>
}