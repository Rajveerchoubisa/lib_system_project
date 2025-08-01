import { motion } from "framer-motion";
import { BookOpen, Sparkles, CalendarCheck, Smile } from "lucide-react";
import LoginNavbar from "../components/LoginNavbar"

const features = [
  {
    title: "Online Seat Reservation",
    description:
      "Reserve your seat instantly with our intuitive booking interface, accessible from anywhere.",
    icon: <CalendarCheck className="w-8 h-8 text-indigo-500" />,
  },
  {
    title: "Clean & Calm Library",
    description:
      "Experience a peaceful study environment with regularly maintained and sanitized spaces.",
    icon: <Sparkles className="w-8 h-8 text-green-400" />,
  },
  {
    title: "Wide Range of Books",
    description:
      "Explore a curated collection of books across various genres and fields, both academic and beyond.",
    icon: <BookOpen className="w-8 h-8 text-yellow-400" />,
  },
  {
    title: "Hustle-Free Booking",
    description:
      "Say goodbye to long queues. Book your seat and upload required documents with ease.",
    icon: <Smile className="w-8 h-8 text-pink-400" />,
  },
];

export default function FeaturesPage() {
  return (
    <>

    <LoginNavbar />
      <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] px-6 py-16 text-white">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-center mb-16 mt-10"
        >
          Why Choose Our Library System?
        </motion.h1>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-2 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-white/10 border border-white/20 rounded-xl p-6 shadow-lg hover:shadow-2xl hover:scale-[1.02] transition duration-300 backdrop-blur-sm"
            >
              <div className="flex items-center gap-4 mb-4">
                {feature.icon}
                <h3 className="text-2xl font-semibold text-white">
                  {feature.title}
                </h3>
              </div>
              <p className="text-white/80 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}
