"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { FaSearch, FaFilter } from "react-icons/fa";
import TutorCard from "@/components/TutorCard";
import { motion } from "framer-motion";
export default function Tutors() {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  useEffect(() => {
    const fetchTutors = async () => {
      setLoading(true);
      try {
        let url = "/tutors";
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
        const res = await api.get(url);
        setTutors(res.data);
      } catch (error) {
        console.error("Error fetching tutors:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTutors();
    document.title = "MediQueue | Tutors";
  }, [search, startDate, endDate]);
  return <div className="min-h-screen bg-base-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            Browse Our Expert Tutors
          </h1>
          <p className="text-base-content/70 max-w-2xl mx-auto">
            Find the right match for your learning journey. Use the search and
            filters to narrow down your options.
          </p>
        </div>

        {}
        <div className="bg-base-200 p-6 rounded-2xl shadow-sm mb-12 flex flex-col md:flex-row gap-4 items-center justify-between border border-base-300">
          <div className="w-full md:w-1/3 relative">
            <FaSearch className="absolute left-4 top-3.5 text-base-content/50" />
            <input type="text" placeholder="Search by tutor name..." className="input input-bordered w-full pl-11 rounded-full" value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          <div className="flex flex-col sm:flex-row w-full md:w-2/3 gap-4 items-center justify-end">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <FaFilter className="text-base-content/50" />
              <span className="text-sm font-medium whitespace-nowrap">
                Session Date:
              </span>
            </div>
            <input type="date" className="input input-bordered w-full sm:w-auto rounded-full text-sm" value={startDate} onChange={e => setStartDate(e.target.value)} />
            <span className="text-base-content/50">to</span>
            <input type="date" className="input input-bordered w-full sm:w-auto rounded-full text-sm" value={endDate} onChange={e => setEndDate(e.target.value)} />
            <button className="btn btn-ghost rounded-full text-error" onClick={() => {
            setSearch("");
            setStartDate("");
            setEndDate("");
          }}>
              Clear
            </button>
          </div>
        </div>

        {}
        {loading ? <div className="flex justify-center my-20">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div> : tutors.length === 0 ? <div className="text-center my-20 py-16 bg-base-200 rounded-3xl border border-base-300 border-dashed">
            <h3 className="text-2xl font-bold mb-2">No tutors found!</h3>
            <p className="text-base-content/60">
              Try adjusting your search or filters.
            </p>
          </div> : <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        duration: 0.5
      }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tutors.map(tutor => <TutorCard key={tutor._id} tutor={tutor} />)}
          </motion.div>}
      </div>
    </div>
}