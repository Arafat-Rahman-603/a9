import Link from "next/link";
import { FaHome } from "react-icons/fa";
export default function NotFound() {
  return <div className="min-h-screen bg-base-100 flex flex-col items-center justify-center text-center p-4">
      <div className="max-w-md">
        <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-3xl font-bold text-base-content mb-4">Page Not Found</h2>
        <p className="text-base-content/70 mb-8">
          Oops! The page you are looking for does not exist. It might have been moved or deleted.
        </p>
        <Link href="/" className="btn btn-primary rounded-full px-8 flex gap-2 mx-auto w-fit text-white">
          <FaHome /> Back to Home
        </Link>
      </div>
    </div>
}