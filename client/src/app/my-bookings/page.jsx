"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { FaTimesCircle, FaChalkboardTeacher, FaCalendarAlt, FaSadTear } from "react-icons/fa";
import { motion } from "framer-motion";
import Link from "next/link";
export default function MyBookings() {
  const {
    data: session,
    isPending
  } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelId, setCancelId] = useState(null);
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login?callbackUrl=/my-bookings");
    }
  }, [isPending, session, router]);
  useEffect(() => {
    const fetchMyBookings = async () => {
      if (session?.user) {
        try {
          const res = await api.get("/bookings");
          setBookings(res.data);
          document.title = "MediQueue | My Bookings";
        } catch (error) {
          console.error("Error fetching bookings:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchMyBookings();
  }, [session]);
  const handleCancel = async () => {
    if (!cancelId) return;
    try {
      await api.patch(`/bookings/${cancelId}`);
      setBookings(bookings.map(b => b._id === cancelId ? {
        ...b,
        status: 'cancelled'
      } : b));
      toast.success("Booking cancelled successfully!");
    } catch (error) {
      console.error("Cancel error:", error);
      toast.error(error.response?.data?.message || "Failed to cancel booking.");
    } finally {
      setCancelId(null);
      document.getElementById("cancel-confirm-modal")?.close();
    }
  };
  if (isPending || !session?.user || loading) {
    return <div className="min-h-screen flex items-center justify-center bg-base-100">
        <div className="relative w-16 h-16"><div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div><div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div></div>
      </div>;
  }
  return <div className="min-h-screen bg-base-200/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-extrabold text-base-content" style={{
          fontFamily: "var(--font-jakarta)"
        }}>My Learning Journey</h1>
          <p className="text-base-content/60 mt-2 text-lg">Track and manage your upcoming tutoring sessions.</p>
        </div>

        {bookings.length === 0 ? <motion.div initial={{
        opacity: 0,
        scale: 0.95
      }} animate={{
        opacity: 1,
        scale: 1
      }} className="bg-base-100 rounded-[2.5rem] border border-base-content/5 shadow-xl p-12 text-center relative overflow-hidden">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
             <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center text-5xl mx-auto mb-6 shadow-inner"><FaSadTear /></div>
             <h2 className="text-2xl font-bold text-base-content mb-3" style={{
          fontFamily: "var(--font-jakarta)"
        }}>No sessions booked yet</h2>
             <p className="text-base-content/60 max-w-md mx-auto mb-8">Ready to accelerate your potential? Browse our world-class educators and book your first session today.</p>
             <Link href="/tutors" className="btn gradient-bg text-white border-0 rounded-xl px-8 h-12 shadow-lg shadow-primary/30 btn-glow">Browse Available Tutors</Link>
          </motion.div> : <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {bookings.map((booking, idx) => <motion.div key={booking._id} initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: idx * 0.1
        }} className="bg-base-100 rounded-3xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-base-content/5 relative overflow-hidden">
                <div className={`absolute top-0 inset-x-0 h-1.5 ${booking.status === 'cancelled' ? 'bg-rose-500' : 'gradient-bg'}`} />
                
                <div className="flex justify-between items-start mb-6 pt-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-xl shadow-inner">
                      <FaChalkboardTeacher />
                    </div>
                    <div>
                      <h3 className="font-bold text-base-content text-lg" style={{
                  fontFamily: "var(--font-jakarta)"
                }}>{booking.tutorName || "Tutor"}</h3>
                      <p className="text-xs text-base-content/60 font-medium">Tutor</p>
                    </div>
                  </div>
                  <div className={`badge font-bold border-0 px-3 py-3 rounded-lg shadow-sm ${booking.status === 'cancelled' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                    {booking.status === 'cancelled' ? 'Cancelled' : 'Confirmed'}
                  </div>
                </div>
                
                <div className="bg-base-200/50 rounded-2xl p-4 mb-6 border border-base-content/5 space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <FaCalendarAlt className="text-primary opacity-70" />
                    <span className="text-base-content/70">Booked on:</span>
                    <span className="font-semibold text-base-content ml-auto">{new Date(booking.bookingDate).toLocaleDateString()}</span>
                  </div>
                </div>

                {booking.status !== 'cancelled' ? <button onClick={() => {
                    setCancelId(booking._id);
                    document.getElementById("cancel-confirm-modal")?.showModal();
                  }} className="w-full btn btn-outline border-rose-500/30 text-rose-500 hover:bg-rose-500 hover:text-white hover:border-rose-500 rounded-xl h-12 flex items-center justify-center gap-2 transition-all">
                    <FaTimesCircle /> Cancel Session
                  </button> : <button className="w-full btn bg-base-200 text-base-content/40 border-0 rounded-xl h-12 cursor-not-allowed">
                    Session Cancelled
                  </button>}
              </motion.div>)}
          </motion.div>}
      </div>

      <dialog id="cancel-confirm-modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-base-100 rounded-[2rem] p-8 max-w-sm shadow-2xl border border-base-content/10 text-center">
          <div className="w-16 h-16 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
            <FaTimesCircle />
          </div>
          <h3 className="font-extrabold text-xl mb-2" style={{ fontFamily: "var(--font-jakarta)" }}>Cancel Booking?</h3>
          <p className="text-base-content/60 mb-6">Are you sure you want to cancel this session? This action cannot be undone.</p>
          <div className="flex gap-3 justify-center">
            <button className="btn btn-ghost rounded-xl px-6" onClick={() => {
              setCancelId(null);
              document.getElementById("cancel-confirm-modal")?.close();
            }}>Keep It</button>
            <button className="btn bg-rose-500 hover:bg-rose-600 text-white border-0 rounded-xl px-6" onClick={handleCancel}>Yes, Cancel</button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop bg-base-100/60 backdrop-blur-sm">
          <button onClick={() => setCancelId(null)}>close</button>
        </form>
      </dialog>
    </div>
}