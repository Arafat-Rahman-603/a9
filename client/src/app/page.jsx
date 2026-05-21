"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { motion } from "framer-motion";
import TutorCard from "@/components/TutorCard";
import { FaUserGraduate, FaChalkboardTeacher, FaGlobe, FaCertificate } from "react-icons/fa";
export default function Home() {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const res = await api.get("/tutors?limit=6");
        setTutors(res.data);
      } catch (error) {
        console.error("Failed to fetch tutors:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTutors();
    document.title = "MediQueue | Home";
  }, []);
  return <div className="min-h-screen">
      {}
      <section className="relative">
        <Swiper spaceBetween={0} centeredSlides={true} autoplay={{
        delay: 5000,
        disableOnInteraction: false
      }} pagination={{
        clickable: true
      }} navigation={true} modules={[Autoplay, Pagination, Navigation]} className="h-[600px] md:h-[700px] w-full">
          {}
          <SwiperSlide>
            <div className="relative w-full h-full">
              <img src="https://i.ibb.co.com/Rkw2jvMD/tutoring-tutor-his-online-education-teaching-tutoring-learning-teacher-coach-management-82168018.webp" className="w-full h-full object-cover" alt="Student learning" />
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <div className="text-center px-4 max-w-4xl">
                  <motion.h1 initial={{
                  y: -50,
                  opacity: 0
                }} animate={{
                  y: 0,
                  opacity: 1
                }} transition={{
                  duration: 0.8
                }} className="text-4xl md:text-6xl font-bold text-white mb-6">
                    Unlock Your Potential with Expert Tutors
                  </motion.h1>
                  <motion.p initial={{
                  y: 50,
                  opacity: 0
                }} animate={{
                  y: 0,
                  opacity: 1
                }} transition={{
                  duration: 0.8,
                  delay: 0.2
                }} className="text-lg md:text-xl text-gray-200 mb-8">
                    Find the perfect tutor for any subject and start learning
                    today.
                  </motion.p>
                  <motion.div initial={{
                  scale: 0
                }} animate={{
                  scale: 1
                }} transition={{
                  duration: 0.5,
                  delay: 0.4
                }}>
                    <Link href="/tutors" className="btn btn-primary btn-lg rounded-full text-white border-0 bg-gradient-to-r from-primary to-secondary">
                      Browse Tutors Now
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>
          </SwiperSlide>

          {}
          <SwiperSlide>
            <div className="relative w-full h-full">
              <img src="https://i.ibb.co.com/xqKYmCq5/successful-teacher-2021-09-24-03-01-11-utc.jpg   " className="w-full h-full object-cover" alt="Online Tutoring" />
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <div className="text-center px-4 max-w-4xl">
                  <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                    Learn Anywhere, Anytime
                  </h1>
                  <p className="text-lg md:text-xl text-gray-200 mb-8">
                    Flexible online and offline tutoring tailored to your
                    schedule.
                  </p>
                  <Link href="/register" className="btn btn-primary btn-lg rounded-full text-white border-0 bg-gradient-to-r from-primary to-secondary">
                    Join as a Student
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>

          {}
          <SwiperSlide>
            <div className="relative w-full h-full">
              <img src="https://i.ibb.co.com/RG7D9YBr/images.jpg" className="w-full h-full object-cover" alt="Teach with us" />
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <div className="text-center px-4 max-w-4xl">
                  <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                    Share Your Knowledge
                  </h1>
                  <p className="text-lg md:text-xl text-gray-200 mb-8">
                    Become a tutor on MediQueue and inspire the next generation.
                  </p>
                  <Link href="/add-tutor" className="btn btn-primary btn-lg rounded-full text-white border-0 bg-gradient-to-r from-primary to-secondary">
                    Become a Tutor
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </section>

      {}
      <section className="py-20 bg-base-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Available Tutors
            </h2>
            <p className="text-base-content/70 max-w-2xl mx-auto">
              Discover top-rated educators ready to help you master new skills
              and subjects.
            </p>
          </div>

          {loading ? <div className="flex justify-center my-20">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tutors.map(tutor => <motion.div key={tutor._id} initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }}>
                  <TutorCard tutor={tutor} />
                </motion.div>)}
            </div>}

          <div className="text-center mt-12">
            <Link href="/tutors" className="btn btn-outline btn-primary rounded-full px-8">
              View All Tutors
            </Link>
          </div>
        </div>
      </section>

      {}
      <section className="py-20 bg-base-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose MediQueue?
            </h2>
            <p className="text-base-content/70 max-w-2xl mx-auto">
              We provide a seamless experience connecting dedicated learners
              with expert educators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[{
            icon: <FaChalkboardTeacher />,
            title: "Expert Tutors",
            desc: "Verified professionals in their fields."
          }, {
            icon: <FaGlobe />,
            title: "Flexible Learning",
            desc: "Online or offline, at your convenience."
          }, {
            icon: <FaUserGraduate />,
            title: "Student Success",
            desc: "Personalized approach to guarantee results."
          }, {
            icon: <FaCertificate />,
            title: "Secure Booking",
            desc: "Hassle-free token based scheduling."
          }].map((feature, idx) => <motion.div key={idx} initial={{
            opacity: 0,
            scale: 0.9
          }} whileInView={{
            opacity: 1,
            scale: 1
          }} viewport={{
            once: true
          }} transition={{
            delay: idx * 0.1
          }} className="bg-base-100 p-8 rounded-2xl shadow-lg text-center hover:-translate-y-2 transition-transform duration-300">
                <div className="text-4xl text-primary flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-base-content/70 text-sm">{feature.desc}</p>
              </motion.div>)}
          </div>
        </div>
      </section>

      {}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 z-0"></div>
        <div className="max-w-5xl mx-auto px-4 relative z-10 text-center">
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }}>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to Accelerate Your Learning?
            </h2>
            <p className="text-lg md:text-xl text-base-content/80 mb-10 max-w-3xl mx-auto">
              Join thousands of students who have transformed their academic
              journey with MediQueue. Sign up today and book your first session
              in minutes!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="btn btn-primary btn-lg rounded-full text-white px-10">
                Get Started
              </Link>
              <Link href="/tutors" className="btn btn-outline btn-lg rounded-full px-10">
                Browse Subjects
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
}