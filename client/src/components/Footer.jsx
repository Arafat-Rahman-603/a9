import Link from "next/link";
import { FaTwitter, FaFacebook, FaInstagram, FaGithub, FaXTwitter } from "react-icons/fa6";
export default function Footer() {
  return <footer className="bg-base-200 text-base-content mt-auto">
      <div className="footer p-10 max-w-7xl mx-auto grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
        <aside className="col-span-1 md:col-span-3 lg:col-span-1 flex flex-col items-start gap-4">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            MediQueue
          </Link>
          <p className="max-w-xs text-sm text-base-content/70">
            Empowering students with top-tier tutors. Book your learning
            sessions instantly, without the hassle.
          </p>
          <div className="flex gap-4 mt-2">
            <a href="#" className="text-base-content/70 hover:text-primary transition-colors">
              <FaXTwitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-base-content/70 hover:text-primary transition-colors">
              <FaFacebook className="h-5 w-5" />
            </a>
            <a href="#" className="text-base-content/70 hover:text-primary transition-colors">
              <FaInstagram className="h-5 w-5" />
            </a>
            <a href="#" className="text-base-content/70 hover:text-primary transition-colors">
              <FaGithub className="h-5 w-5" />
            </a>
          </div>
        </aside>

        <nav>
          <header className="footer-title text-primary uppercase font-bold opacity-100">
            Services
          </header>
          <Link href="/tutors" className="link link-hover">
            Browse Tutors
          </Link>
          <Link href="/register" className="link link-hover">
            Become a Student
          </Link>
          <Link href="/add-tutor" className="link link-hover">
            Become a Tutor
          </Link>
        </nav>

        <nav>
          <header className="footer-title text-primary uppercase font-bold opacity-100">
            Company
          </header>
          <a className="link link-hover">About us</a>
          <a className="link link-hover">Contact</a>
          <a className="link link-hover">Careers</a>
          <a className="link link-hover">Press kit</a>
        </nav>

        <nav>
          <header className="footer-title text-primary uppercase font-bold opacity-100">
            Legal
          </header>
          <a className="link link-hover">Terms of use</a>
          <a className="link link-hover">Privacy policy</a>
          <a className="link link-hover">Cookie policy</a>
        </nav>
      </div>

      <div className="footer footer-center p-4 border-t border-base-300 bg-base-300 text-base-content/80">
        <aside>
          <p>
            Copyright © {new Date().getFullYear()} - All right reserved by
            MediQueue Tutors Ltd.
          </p>
        </aside>
      </div>
    </footer>
}