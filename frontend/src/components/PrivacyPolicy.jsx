import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 py-12 px-4">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-8 md:p-12">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-6">
          🔒 Privacy Policy
        </h1>
        <p className="text-sm text-gray-500 text-center mb-8">
          Effective Date: <strong>January 1, 2025</strong> | Last Updated:{" "}
          <strong>January 1, 2025</strong>
        </p>

        <p className="text-gray-700 mb-6 leading-relaxed">
          We value your privacy. This Privacy Policy explains how we collect,
          use, and protect your information.
        </p>

        <div className="space-y-6">
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

export default PrivacyPolicy;
