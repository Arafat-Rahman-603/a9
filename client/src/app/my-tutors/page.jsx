"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { FaEdit, FaTrash, FaPlus, FaSadTear } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
export default function MyTutors() {
  const {
    data: session,
    isPending
  } = useSession();
  const router = useRouter();
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login?callbackUrl=/my-tutors");
    }
  }, [isPending, session, router]);
  useEffect(() => {
    const fetchMyTutors = async () => {
      if (session?.user) {
        try {
          const res = await api.get("/tutors/my-tutors");
          setTutors(res.data);
          document.title = "MediQueue | My Tutors";
        } catch (error) {
          console.error("Error fetching my tutors:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchMyTutors();
  }, [session]);
  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/tutors/${deleteId}`);
      setTutors(tutors.filter(t => t._id !== deleteId));
      toast.success("Tutor deleted successfully!");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.response?.data?.message || "Failed to delete tutor.");
    } finally {
      setDeleteId(null);
      document.getElementById("delete-confirm-modal")?.close();
    }
  };
  const handleUpdate = async e => {
    e.preventDefault();
    const form = e.target;
    const updatedData = {
      photo: form.photo.value,
      subject: form.subject.value,
      availableDays: form.availableDays.value,
      hourlyFee: parseFloat(form.hourlyFee.value),
      totalSlot: parseInt(form.totalSlot.value),
      sessionDate: form.sessionDate.value,
      experience: form.experience.value,
      location: form.location.value,
      teachingMode: form.teachingMode.value
    };
    try {
      await api.put(`/tutors/${selectedTutor._id}`, updatedData);
      setTutors(tutors.map(t => t._id === selectedTutor._id ? {
        ...t,
        ...updatedData
      } : t));
      toast.success("Tutor updated successfully!");
      document.getElementById("update-modal").close();
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.response?.data?.message || "Failed to update tutor.");
    }
  };
  if (isPending || !session?.user || loading) {
    return <div className="min-h-screen flex items-center justify-center bg-base-100">
        <div className="relative w-16 h-16"><div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div><div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div></div>
      </div>;
  }
  return <div className="min-h-screen bg-base-200/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-base-content" style={{
            fontFamily: "var(--font-jakarta)"
          }}>Manage Tutors</h1>
            <p className="text-base-content/60 mt-2">Manage and update your offered tutoring sessions.</p>
          </div>
          <Link href="/add-tutor" className="btn gradient-bg text-white border-0 rounded-xl shadow-lg shadow-primary/30 btn-glow h-12 px-6">
            <FaPlus /> Add New Session
          </Link>
        </div>

        {tutors.length === 0 ? <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} className="bg-base-100 rounded-[2.5rem] border border-base-content/5 shadow-xl p-12 text-center relative overflow-hidden">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
             <div className="w-24 h-24 bg-base-200 rounded-full flex items-center justify-center text-5xl text-base-content/20 mx-auto mb-6"><FaSadTear /></div>
             <h2 className="text-2xl font-bold text-base-content mb-3" style={{
          fontFamily: "var(--font-jakarta)"
        }}>No sessions offered yet</h2>
             <p className="text-base-content/60 max-w-md mx-auto mb-8">You haven't listed any tutoring sessions yet. Start sharing your knowledge by adding a new session.</p>
             <Link href="/add-tutor" className="btn gradient-bg text-white border-0 rounded-xl px-8 h-12 shadow-lg shadow-primary/30">Create First Session</Link>
          </motion.div> : <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} className="bg-base-100 rounded-[2.5rem] shadow-xl border border-base-content/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full text-base-content/80">
                <thead className="bg-base-200/50 text-base-content text-sm uppercase tracking-wider">
                  <tr>
                    <th className="py-5 pl-6">Subject / Info</th>
                    <th className="py-5">Schedule</th>
                    <th className="py-5">Mode & Fee</th>
                    <th className="py-5 text-center">Slots</th>
                    <th className="py-5 text-right pr-6">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tutors.map(tutor => <tr key={tutor._id} className="hover hover:bg-base-200/30 transition-colors border-b border-base-content/5">
                      <td className="py-4 pl-6">
                        <div className="flex items-center gap-4">
                          <div className="avatar"><div className="w-14 h-14 rounded-2xl ring-2 ring-primary/20 shadow-sm"><img src={tutor.photo || "https://i.ibb.co/placeholder.jpg"} alt={tutor.name} /></div></div>
                          <div>
                            <div className="font-bold text-base text-base-content mb-1" style={{
                        fontFamily: "var(--font-jakarta)"
                      }}>{tutor.subject}</div>
                            <div className="text-xs opacity-70 flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-primary rounded-full"></span> {tutor.location}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="font-medium text-sm mb-1">{tutor.availableDays}</div>
                        <div className="text-xs text-primary font-semibold">Starts: {tutor.sessionDate}</div>
                      </td>
                      <td className="py-4">
                        <div className="badge badge-ghost badge-sm font-semibold mb-1 border-base-content/20">{tutor.teachingMode}</div>
                        <div className="font-bold text-base-content">${tutor.hourlyFee}/hr</div>
                      </td>
                      <td className="py-4 text-center">
                        <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl font-bold text-lg shadow-sm ${tutor.totalSlot > 0 ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400'}`}>
                          {tutor.totalSlot}
                        </div>
                        <div className="text-[10px] text-base-content/50 uppercase font-bold mt-1 tracking-wider">Out of {tutor.initialSlot || 10}</div>
                      </td>
                      <td className="py-4 text-right pr-6">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => {
                      setSelectedTutor(tutor);
                      document.getElementById("update-modal").showModal();
                    }} className="btn btn-sm btn-circle btn-ghost text-info hover:bg-info/10" title="Edit">
                            <FaEdit />
                          </button>
                          <button onClick={() => {
                      setDeleteId(tutor._id);
                      document.getElementById("delete-confirm-modal")?.showModal();
                    }} className="btn btn-sm btn-circle btn-ghost text-error hover:bg-error/10" title="Delete">
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>)}
                </tbody>
              </table>
            </div>
          </motion.div>}
      </div>

      <dialog id="delete-confirm-modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-base-100 rounded-[2rem] p-8 max-w-sm shadow-2xl border border-base-content/10 text-center">
          <div className="w-16 h-16 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
            <FaTrash />
          </div>
          <h3 className="font-extrabold text-xl mb-2" style={{ fontFamily: "var(--font-jakarta)" }}>Delete Tutor?</h3>
          <p className="text-base-content/60 mb-6">Are you sure you want to delete this tutoring session? This action cannot be undone.</p>
          <div className="flex gap-3 justify-center">
            <button className="btn btn-ghost rounded-xl px-6" onClick={() => {
              setDeleteId(null);
              document.getElementById("delete-confirm-modal")?.close();
            }}>Keep It</button>
            <button className="btn bg-rose-500 hover:bg-rose-600 text-white border-0 rounded-xl px-6" onClick={handleDelete}>Yes, Delete</button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop bg-base-100/60 backdrop-blur-sm">
          <button onClick={() => setDeleteId(null)}>close</button>
        </form>
      </dialog>

      <dialog id="update-modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-base-100 rounded-[2rem] p-8 max-w-2xl shadow-2xl border border-base-content/10">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 text-base-content/50 hover:bg-base-200" onClick={() => {
          setSelectedTutor(null);
          document.getElementById("update-modal").close();
        }}>✕</button>
          <h3 className="font-extrabold text-2xl mb-6" style={{
          fontFamily: "var(--font-jakarta)"
        }}>Update Session Details</h3>
          
          {selectedTutor && <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label"><span className="label-text text-xs font-bold uppercase tracking-wider text-base-content/70">Photo URL</span></label>
                  <input type="url" name="photo" defaultValue={selectedTutor.photo} className="input input-bordered w-full rounded-xl bg-base-200/50" required />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text text-xs font-bold uppercase tracking-wider text-base-content/70">Subject / Category</span></label>
                  <select name="subject" defaultValue={selectedTutor.subject} className="select select-bordered w-full rounded-xl bg-base-200/50" required>
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
                  <label className="label"><span className="label-text text-xs font-bold uppercase tracking-wider text-base-content/70">Available Days & Time</span></label>
                  <input type="text" name="availableDays" defaultValue={selectedTutor.availableDays} className="input input-bordered w-full rounded-xl bg-base-200/50" required />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text text-xs font-bold uppercase tracking-wider text-base-content/70">Hourly Fee ($)</span></label>
                  <input type="number" name="hourlyFee" min="1" step="0.01" defaultValue={selectedTutor.hourlyFee} className="input input-bordered w-full rounded-xl bg-base-200/50" required />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text text-xs font-bold uppercase tracking-wider text-base-content/70">Total Slots left</span></label>
                  <input type="number" name="totalSlot" min="0" defaultValue={selectedTutor.totalSlot} className="input input-bordered w-full rounded-xl bg-base-200/50" required />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text text-xs font-bold uppercase tracking-wider text-base-content/70">Session Start Date</span></label>
                  <input type="date" name="sessionDate" defaultValue={selectedTutor.sessionDate} className="input input-bordered w-full rounded-xl bg-base-200/50" required />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text text-xs font-bold uppercase tracking-wider text-base-content/70">Institution & Experience</span></label>
                  <input type="text" name="experience" defaultValue={selectedTutor.experience} className="input input-bordered w-full rounded-xl bg-base-200/50" required />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text text-xs font-bold uppercase tracking-wider text-base-content/70">Location</span></label>
                  <input type="text" name="location" defaultValue={selectedTutor.location} className="input input-bordered w-full rounded-xl bg-base-200/50" required />
                </div>
                <div className="form-control md:col-span-2">
                  <label className="label"><span className="label-text text-xs font-bold uppercase tracking-wider text-base-content/70">Teaching Mode</span></label>
                  <select name="teachingMode" defaultValue={selectedTutor.teachingMode} className="select select-bordered w-full rounded-xl bg-base-200/50" required>
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                    <option value="Both">Both</option>
                  </select>
                </div>
              </div>
              <div className="modal-action mt-6">
                <button type="submit" className="btn gradient-bg text-white border-0 rounded-xl h-12 px-8 btn-glow">Save Changes</button>
              </div>
            </form>}
        </div>
        <form method="dialog" className="modal-backdrop bg-base-100/60 backdrop-blur-sm">
          <button onClick={() => setSelectedTutor(null)}>close</button>
        </form>
      </dialog>

    </div>
}