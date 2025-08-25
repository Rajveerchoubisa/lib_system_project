import React from "react";
import Navbar from "../components/Navbar";
import PageWrapper from "./PageWrapper";

const PrivacyPolicy = () => {
  return (
    <>
    <PageWrapper>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b mt-10 from-gray-100 to-gray-200 py-8 px-3 sm:px-4">
        <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-6 sm:p-8 md:p-12">
          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center text-gray-800 mb-4 sm:mb-6">
            🔒 Privacy Policy
          </h1>

          {/* Effective Date */}
          <p className="text-xs sm:text-sm text-gray-500 text-center mb-6 sm:mb-8">
            Effective Date: <strong>January 1, 2025</strong> | Last Updated:{" "}
            <strong>January 1, 2025</strong>
          </p>

          {/* Intro */}
          <p className="text-gray-700 mb-6 leading-relaxed text-sm sm:text-base">
            We value your privacy. This Privacy Policy explains how we collect,
            use, and protect your information.
          </p>

          {/* Sections */}
          <div className="space-y-4 sm:space-y-6">
            {[
              {
                title: "1. Information We Collect",
                desc: "Name, ID, contact details, booking history, and device information.",
              },
              {
                title: "2. How We Use It",
                desc: "To manage bookings, send updates, and improve the Service.",
              },
              {
                title: "3. Sharing",
                desc: "Only with library staff or if required by law.",
              },
              {
                title: "4. Data Retention",
                desc: "Stored for 1 year, then deleted.",
              },
              {
                title: "5. Your Rights",
                desc: "Access, correct, or delete your data (per library rules).",
              },
              {
                title: "6. Security",
                desc: "We use safeguards but cannot guarantee 100% security.",
              },
              {
                title: "7. Changes",
                desc: "Policy updates will be posted here.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-5 hover:shadow-md transition"
              >
                <h3 className="font-semibold text-base sm:text-lg text-gray-800 mb-1 sm:mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Contact */}
          <p className="mt-6 sm:mt-8 text-gray-700 text-sm sm:text-base">
            <strong>Contact:</strong> support@librarysystem.com
          </p>
        </div>
      </div>
      </PageWrapper>
    </>
  );
};

export default PrivacyPolicy;
