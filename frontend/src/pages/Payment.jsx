import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';

const Payment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { price, months } = location.state || {};

  const handlePayment = () => {
    // Simulate UPI payment delay
    setTimeout(() => {
      navigate("/success");
    }, 2000);
  };

  if (!price || !months) {
    return <p className="text-red-500 text-center mt-10">Invalid Payment Details</p>;
  }

  return (
    <>
    <PageWrapper>
    <div className="text-center mt-20">
      <h1 className="text-xl font-bold mb-4">Simulated UPI Payment</h1>
      <p className="mb-2">Booking ID: <strong>{id}</strong></p>
      <p className="mb-2">Months: {months}</p>
      <p className="mb-4">Total Amount: ₹{price}</p>
      <button
        className="bg-green-600 text-white px-6 py-2 rounded"
        onClick={handlePayment}
      >
        Pay Now
      </button>
    </div>
    </PageWrapper>
    </>
  );
};

export default Payment;
