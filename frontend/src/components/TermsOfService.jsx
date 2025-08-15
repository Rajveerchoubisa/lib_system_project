import React from "react";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 py-12 px-4">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-8 md:p-12">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-6">
          📜 Terms of Service
        </h1>
        <p className="text-sm text-gray-500 text-center mb-8">
          Effective Date: <strong>January 1, 2025</strong> | Last Updated:{" "}
          <strong>January 1, 2025</strong>
        </p>

        <p className="text-gray-700 mb-6 leading-relaxed">
          Welcome to <strong>Library System</strong>. By
          using our library seat booking platform (“Service”), you agree to
          follow these Terms of Service.
        </p>

        <div className="space-y-6">
          {[
            {
              title: "1. Eligibility",
              desc: "You must be a registered student/member to use the Service.",
            },
            {
              title: "2. Use of Service",
              desc: "Book seats honestly, do not transfer bookings, and check in on time.",
            },
            {
              title: "3. Prohibited Conduct",
              desc: "No bypassing booking limits, unlawful activity, or account misuse.",
            },
            {
              title: "4. Cancellations & No-Shows",
              desc: "Cancel if not attending; repeated no-shows may result in suspension.",
            },
            {
              title: "5. System Availability",
              desc: "We do not guarantee uninterrupted operation.",
            },
            {
              title: "6. Limitation of Liability",
              desc: "We are not responsible for loss of belongings or indirect damages.",
            },
            {
              title: "7. Changes",
              desc: "Updates may occur; continued use means acceptance.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-gray-50 border border-gray-200 rounded-lg p-5 hover:shadow-md transition"
            >
              <h3 className="font-semibold text-lg text-gray-800 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-gray-700">
          <strong>Contact:</strong> support@librarysystem.com
        </p>
      </div>
    </div>
  );
};

export default TermsOfService;
