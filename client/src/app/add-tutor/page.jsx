"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
export default function AddTutor() {
  const {
    data: session,
    isPending
  } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login?callbackUrl=/add-tutor");
    }
    document.title = "MediQueue | Add Tutor";
  }, [isPending, session, router]);
  if (isPending || !session?.user) {
    return <div className="min-h-screen flex items-center justify-center bg-base-100">
        <div className="relative w-16 h-16"><div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div><div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div></div>
      </div>;
  }
  const user = session.user;
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    const form = e.target;
    const tutorData = {
      name: form.tutorName.value,
      email: user.email,
      photo: form.photo.value,
      subject: form.subject.value,
      availableDays: form.availableDays.value,
      hourlyFee: parseFloat(form.hourlyFee.value),
      totalSlot: parseInt(form.totalSlot.value),
      initialSlot: parseInt(form.totalSlot.value),
      sessionDate: form.sessionDate.value,
      experience: form.experience.value,
      location: form.location.value,
      teachingMode: form.teachingMode.value,
      addedByEmail: user.email
    };
    try {
      const res = await api.post("/tutors", tutorData);
      if (res.data.insertedId) {
        toast.success("Tutor added successfully!");
        form.reset();
        router.push("/my-tutors");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add tutor");
    } finally {
      setLoading(false);
    }
  };
  return <div className="min-h-screen bg-base-200/30 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} className="bg-base-100 rounded-[2.5rem] shadow-xl overflow-hidden border border-base-content/5">
          <div className="gradient-bg p-8 text-white text-center">
            <h1 className="text-3xl font-extrabold mb-2" style={{
            fontFamily: "var(--font-jakarta)"
          }}>Offer a Tutoring Session</h1>
            <p className="opacity-90">Share your knowledge and help students achieve their goals.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label"><span className="label-text text-xs font-bold uppercase tracking-wider">Tutor Name</span></label>
                <input type="text" name="tutorName" defaultValue={user.name} className="input input-bordered w-full rounded-xl" required />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text text-xs font-bold uppercase tracking-wider">Email</span></label>
                <input type="email" defaultValue={user.email} className="input input-bordered w-full rounded-xl bg-base-200/50" readOnly />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text text-xs font-bold uppercase tracking-wider">Photo URL</span></label>
                <input type="url" name="photo" defaultValue={user.image || ""} placeholder="https://..." className="input input-bordered w-full rounded-xl" required />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text text-xs font-bold uppercase tracking-wider">Subject / Category</span></label>
                <select name="subject" className="select select-bordered w-full rounded-xl" defaultValue="" required>
                  <option value="" disabled>Select a subject</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="English">English</option>
                  <option value="History">History</option>
                  <option value="Music">Music</option>
                </select>
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text text-xs font-bold uppercase tracking-wider">Available Days & Time</span></label>
                <input type="text" name="availableDays" placeholder="Sun - Thu 5:00 PM - 8:00 PM" className="input input-bordered w-full rounded-xl" required />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text text-xs font-bold uppercase tracking-wider">Hourly Fee (BDT)</span></label>
                <input type="number" name="hourlyFee" min="1" step="0.01" placeholder="10000" className="input input-bordered w-full rounded-xl" required />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text text-xs font-bold uppercase tracking-wider">Total Slots</span></label>
                <input type="number" name="totalSlot" min="1" placeholder="10" className="input input-bordered w-full rounded-xl" required />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text text-xs font-bold uppercase tracking-wider">Session Start Date</span></label>
                <input type="date" name="sessionDate" className="input input-bordered w-full rounded-xl" required />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text text-xs font-bold uppercase tracking-wider">Institution & Experience</span></label>
                <input type="text" name="experience" placeholder="5 Years, Dhaka University" className="input input-bordered w-full rounded-xl" required />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text text-xs font-bold uppercase tracking-wider">Location</span></label>
                <input type="text" name="location" placeholder="Mirpur, Bangladesh" className="input input-bordered w-full rounded-xl" required />
              </div>
              <div className="form-control md:col-span-2">
                <label className="label"><span className="label-text text-xs font-bold uppercase tracking-wider">Teaching Mode</span></label>
                <select name="teachingMode" className="select select-bordered w-full rounded-xl" defaultValue="" required>
                  <option value="" disabled>Select mode</option>
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                  <option value="Both">Both</option>
                </select>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn w-full gradient-bg text-white border-0 rounded-xl h-12 shadow-lg shadow-primary/30 btn-glow mt-4">
              {loading ? <span className="loading loading-spinner"></span> : "Submit Tutor Session"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
}