"use client";

import { useState, useEffect, use } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { FaMapMarkerAlt, FaChalkboardTeacher, FaCalendarAlt, FaEnvelope, FaMoneyBillWave } from "react-icons/fa";
import { motion } from "framer-motion";
export default function TutorDetails({ params }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const {
    data: session,
    isPending
  } = useSession();
  const router = useRouter();
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [phone, setPhone] = useState("");
  useEffect(() => {
    const fetchTutor = async () => {
      try {
        const res = await api.get(`/tutors/${id}`);
        setTutor(res.data);
        document.title = `MediQueue | ${res.data?.name || "Tutor Details"}`;
      } catch (error) {
        console.error("Error fetching tutor:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchTutor();
  }, [id]);
  const handleBooking = async e => {
    e.preventDefault();
    if (!session?.user) {
      toast.error("Please login to book a session!");
      router.push("/login");
      return;
    }
    if (tutor.totalSlot <= 0) {
      toast.error("No available slots left.");
      return;
    }
    setBookingLoading(true);
    const bookingData = {
      tutorId: tutor._id,
      tutorName: tutor.name,
      tutorEmail: tutor.email,
      phone
    };
    try {
      const res = await api.post("/bookings", bookingData);
      if (res.data.insertedId) {
        toast.success("Session booked successfully!");
        setTutor({
          ...tutor,
          totalSlot: tutor.totalSlot - 1
        });
        document.getElementById("booking-modal").close();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to book session");
    } finally {
      setBookingLoading(false);
    }
  };
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>;
  }
  if (!tutor) {
    return <div className="min-h-screen flex items-center justify-center text-2xl font-bold">
        Tutor not found!
      </div>;
  }
  return <div className="min-h-screen bg-base-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} className="bg-base-100 shadow-2xl rounded-3xl overflow-hidden border border-base-200">
          <div className="relative h-64 md:h-80 w-full bg-base-300">
            <img src={tutor.photo || "https://i.ibb.co/placeholder.jpg"} alt={tutor.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
              <div className="p-6 md:p-8 text-white w-full flex flex-col md:flex-row md:items-end justify-between">
                <div>
                  <h1 className="text-3xl md:text-5xl font-bold mb-2">
                    {tutor.name}
                  </h1>
                  <p className="text-lg md:text-xl text-primary font-semibold">
                    {tutor.subject}
                  </p>
                </div>
                <div className="mt-4 md:mt-0 text-right">
                  <p className="text-2xl font-bold text-secondary">
                    {tutor.hourlyFee} BDT
                    <span className="text-sm font-normal text-gray-300">
                      /hour
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold border-b border-base-200 pb-2 mb-3">
                    Tutor Information
                  </h3>
                  <ul className="space-y-3 text-base-content/80">
                    <li className="flex items-center gap-3">
                      <FaEnvelope className="text-primary" />{" "}
                      {tutor.email || "N/A"}
                    </li>
                    <li className="flex items-center gap-3">
                      <FaMapMarkerAlt className="text-primary" />{" "}
                      {tutor.location}
                    </li>
                    <li className="flex items-center gap-3">
                      <FaChalkboardTeacher className="text-primary" />{" "}
                      {tutor.experience} Experience
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-bold border-b border-base-200 pb-2 mb-3">
                    Availability
                  </h3>
                  <ul className="space-y-3 text-base-content/80">
                    <li className="flex items-center gap-3">
                      <span className="font-semibold text-primary w-24">
                        Days:
                      </span>{" "}
                      {tutor.availableDays || "Flexible"}
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="font-semibold text-primary w-24">
                        Mode:
                      </span>{" "}
                      {tutor.teachingMode || "Both"}
                    </li>
                    <li className="flex items-center gap-3">
                      <FaCalendarAlt className="text-primary mr-2" /> Next
                      Session: {tutor.sessionDate || "TBA"}
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-base-200 p-6 rounded-2xl flex flex-col justify-center items-center text-center border border-base-300">
                <div className="radial-progress text-primary mb-4" style={{
                "--value": tutor.totalSlot / (tutor.initialSlot || 10) * 100 || 100,
                "--size": "6rem"
              }} role="progressbar">
                  <span className="text-xl font-bold text-base-content">
                    {tutor.totalSlot > 0 ? tutor.totalSlot : 0}
                  </span>
                </div>
                <h4 className="font-bold text-lg mb-1">Available Slots</h4>
                <p className="text-sm text-base-content/60 mb-6">
                  Book your spot before they fill up!
                </p>

                {tutor.totalSlot > 0 ? <button className="btn btn-primary w-full rounded-full bg-gradient-to-r from-primary to-secondary text-white border-0 shadow-lg" onClick={() => {
                if (!session?.user) {
                  toast.error("Please log in first!");
                  router.push("/login");
                } else {
                  document.getElementById("booking-modal").showModal();
                }
              }}>
                    Book Session
                  </button> : <button className="btn btn-disabled w-full rounded-full" disabled>
                    Fully Booked
                  </button>}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {}
      <dialog id="booking-modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-base-100">
          <h3 className="font-bold text-2xl mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Book Your Session
          </h3>

          <form onSubmit={handleBooking} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Student Name</span>
              </label>
              <input type="text" value={session?.user?.name || ""} className="input input-bordered w-full bg-base-200 text-base-content/70" readOnly />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Student Email</span>
              </label>
              <input type="email" value={session?.user?.email || ""} className="input input-bordered w-full bg-base-200 text-base-content/70" readOnly />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Tutor Name</span>
              </label>
              <input type="text" value={tutor.name} className="input input-bordered w-full bg-base-200 text-base-content/70" readOnly />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">
                  Your Phone Number
                </span>
              </label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 234 567 890" className="input input-bordered w-full" required />
            </div>

            <div className="modal-action mt-6">
              <button type="button" className="btn btn-ghost" onClick={() => document.getElementById("booking-modal").close()}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary text-white" disabled={bookingLoading}>
                {bookingLoading ? <span className="loading loading-spinner"></span> : "Confirm Booking"}
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
}