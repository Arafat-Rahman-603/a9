import Link from "next/link";
import { FaStar, FaMapMarkerAlt, FaChalkboardTeacher } from "react-icons/fa";


export default function TutorCard({
  tutor
}) {
  return <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 border border-base-200 group h-full flex flex-col">
      <figure className="px-4 pt-4 relative overflow-hidden rounded-t-2xl">
        <img src={tutor.photo || "https://i.ibb.co/placeholder.jpg"} alt={tutor.name} className="rounded-xl h-48 w-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-6 right-6 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
          {tutor.subject}
        </div>
      </figure>
      <div className="card-body flex-grow p-5 md:p-6">
        <h2 className="card-title text-xl font-bold mb-1">{tutor.name}</h2>

        <div className="flex items-center gap-2 text-sm text-base-content/70 mb-3">
          <FaMapMarkerAlt className="text-secondary" />
          <span>{tutor.location}</span>
          <span className="mx-1">•</span>
          <FaChalkboardTeacher className="text-secondary" />
          <span>{tutor.experience} Exp.</span>
        </div>

        <div className="space-y-2 mb-4 text-sm flex-grow">
          <div className="flex justify-between border-b border-base-200 pb-2">
            <span className="font-semibold opacity-80">Hourly Fee:</span>
            <span className="font-bold text-primary">Tk {tutor.hourlyFee}</span>
          </div>
          <div className="flex justify-between border-b border-base-200 pb-2">
            <span className="font-semibold opacity-80">Slots Available:</span>
            <span className={`font-bold ${tutor.totalSlot > 0 ? "text-success" : "text-error"}`}>
              {tutor.totalSlot > 0 ? tutor.totalSlot : "Full"}
            </span>
          </div>
          <div className="flex justify-between pt-1 text-xs opacity-70">
            <span>Next session: {tutor.sessionDate || "TBA"}</span>
          </div>
        </div>

        <div className="card-actions justify-end mt-auto pt-2">
          <Link href={`/tutors/${tutor._id}`} className="btn btn-primary w-full bg-gradient-to-r from-primary to-secondary text-white border-0 hover:opacity-90">
            View Details
          </Link>
        </div>
      </div>
    </div>
}