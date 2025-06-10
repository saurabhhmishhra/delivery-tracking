'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'

export default function DeliveryDashboard() {
  const [trip, setTrip] = useState<any>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchCurrentTrip = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) throw new Error('No token found in localStorage')

        const res = await axios.get('https://delivery-tracking-backend-3mxb.onrender.com/api/delivery/current-trip', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        setTrip(res.data)
        setError('')
      } catch (err: any) {
        console.error(err)
        setError('Could not load current trip.')
      }
    }

    fetchCurrentTrip()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Delivery Dashboard</h1>

      {error && <p className="text-red-600">{error}</p>}

      {trip ? (
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold">Current Trip</h2>
          <p><strong>Trip ID:</strong> {trip._id}</p>
          <p><strong>Order ID:</strong> {trip.orderId}</p>
          <p><strong>Status:</strong> {trip.status}</p>
        </div>
      ) : (
        !error && <p>Loading trip...</p>
      )}
    </div>
  )
}
