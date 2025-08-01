// RenewForm.jsx
import { useState } from 'react'
import axios from 'axios'

export default function RenewForm({ bookingId }) {
  const [months, setMonths] = useState(1)

  const handleRenew = async () => {
    const { data } = await axios.post(`/api/bookings/renew/${bookingId}`, { months })
    alert(`Booking Renewed! New Expiry: ${new Date(data.booking.expiryDate).toLocaleDateString()}`)

    await axios.post(`/api/bookings/payment-success/${bookingId}`)
    alert("Renewal Payment Successful!")
  }

  return (
    <div className="p-4 bg-yellow-100 rounded-lg">
      <h3 className="font-semibold">Renew Booking</h3>
      <input type="number" min={1} value={months} onChange={e => setMonths(e.target.value)} className="border p-2" />
      <button onClick={handleRenew} className="ml-2 bg-blue-500 text-white px-4 py-1 rounded">Renew</button>
    </div>
  )
}
