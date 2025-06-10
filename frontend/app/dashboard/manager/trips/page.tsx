// 'use client';

// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Card, CardContent } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';

// interface Trip {
//   _id: string;
//   tripId: string;
//   status: string;
//   driverId: {
//     name: string;
//     _id: string;
//   };
//   orderIds: any[];
//   startTime?: string;
//   endTime?: string;
// }

// export default function TripsPage() {
//   const [trips, setTrips] = useState<Trip[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const storedToken = localStorage.getItem('token');
//     if (!storedToken) {
//       setError('You must be logged in as manager to view trips.');
//       setLoading(false);
//       return;
//     }

//     const fetchTrips = async () => {
//       try {
//         const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/trips`, {
//           headers: {
//             Authorization: `Bearer ${storedToken}`
//           }
//         });
//         setTrips(res.data);
//       } catch (err: any) {
//         console.error(err);
//         if (err.response?.status === 403) {
//           setError('Access denied. You are not authorized to view trips.');
//         } else if (err.response?.status === 401) {
//           setError('Unauthorized. Please log in again.');
//         } else {
//           setError('Failed to fetch trips');
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTrips();
//   }, []);

//   const startTrip = async (id: string) => {
//     const storedToken = localStorage.getItem('token');
//     if (!storedToken) return alert('Missing token');

//     try {
//       await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/trips/${id}/start`, {}, {
//         headers: {
//           Authorization: `Bearer ${storedToken}`
//         }
//       });
//       fetchTripsAgain(storedToken);
//     } catch {
//       alert('Error starting trip');
//     }
//   };

//   const endTrip = async (id: string) => {
//     const storedToken = localStorage.getItem('token');
//     if (!storedToken) return alert('Missing token');

//     try {
//       await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/trips/${id}/end`, {}, {
//         headers: {
//           Authorization: `Bearer ${storedToken}`
//         }
//       });
//       fetchTripsAgain(storedToken);
//     } catch {
//       alert('Error ending trip');
//     }
//   };

//   const fetchTripsAgain = async (token: string) => {
//     try {
//       const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/trips`, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });
//       setTrips(res.data);
//     } catch (err) {
//       setError('Failed to refresh trips');
//     }
//   };

//   const getBadgeVariant = (status: string) => {
//     if (status === 'completed') return 'default';
//     if (status === 'in-progress') return 'secondary';
//     return 'outline';
//   };

//   return (
//     <div className="p-6 space-y-6">
//       <h1 className="text-2xl font-bold">Trips Management</h1>

//       {loading ? (
//         <p>Loading trips...</p>
//       ) : error ? (
//         <p className="text-red-500">{error}</p>
//       ) : trips.length === 0 ? (
//         <p>No trips found</p>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {trips.map((trip) => (
//             <Card key={trip._id} className="border shadow">
//               <CardContent className="p-4 space-y-3">
//                 <div className="flex justify-between items-center">
//                   <div className="text-lg font-semibold">{trip.tripId}</div>
//                   <Badge variant={getBadgeVariant(trip.status)}>
//                     {trip.status}
//                   </Badge>
//                 </div>

//                 <div>
//                   <span className="font-medium">Driver:</span> {trip.driverId?.name || 'N/A'}
//                 </div>
//                 <div>
//                   <span className="font-medium">Orders:</span> {trip.orderIds?.length || 0}
//                 </div>

//                 <div className="flex gap-2 mt-2">
//                   {trip.status === 'pending' && (
//                     <Button onClick={() => startTrip(trip._id)} size="sm">
//                       Start Trip
//                     </Button>
//                   )}
//                   {trip.status === 'in-progress' && (
//                     <Button onClick={() => endTrip(trip._id)} size="sm" variant="outline">
//                       End Trip
//                     </Button>
//                   )}
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }



// Just the frontend now
'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'

interface Trip {
  _id: string
  pickupAddress: string
  destinationAddress: string
  status: string
  assignedAgent?: string
}

interface Agent {
  _id: string
  name: string
}

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [agents, setAgents] = useState<Agent[]>([])

  const fetchTrips = async () => {
    const res = await axios.get('https://delivery-tracking-backend-3mxb.onrender.com/api/trips')
    setTrips(res.data)
  }

  const fetchAgents = async () => {
    const res = await axios.get('https://delivery-tracking-backend-3mxb.onrender.com/api/delivery-agents')
    setAgents(res.data)
  }

  const assignTrip = async (tripId: string, agentId: string) => {
    await axios.put(`https://delivery-tracking-backend-3mxb.onrender.com/api/trips/${tripId}/assign`, { agentId })
    fetchTrips()
  }

  const cancelTrip = async (tripId: string) => {
    await axios.put(`https://delivery-tracking-backend-3mxb.onrender.com/api/trips/${tripId}/cancel`)
    fetchTrips()
  }

  useEffect(() => {
    fetchTrips()
    fetchAgents()
  }, [])

  return (
    <div className="pt-24 px-6 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Manage Trips</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trips.map((trip) => (
          <div key={trip._id} className="bg-white p-5 rounded-xl shadow">
            <p className="text-gray-600 text-sm">Trip ID: {trip._id}</p>
            <p className="mt-2 text-gray-800 font-medium">Pickup: {trip.pickupAddress}</p>
            <p className="text-gray-800">Destination: {trip.destinationAddress}</p>
            <p className={`mt-1 font-semibold ${trip.status === 'Pending' ? 'text-yellow-600' : trip.status === 'Cancelled' ? 'text-red-600' : 'text-green-600'}`}>
              Status: {trip.status}
            </p>
            <p className="mt-1 text-gray-600 text-sm">Assigned Agent: {trip.assignedAgent || 'Unassigned'}</p>

            {/* Assign dropdown */}
            <div className="mt-4 flex flex-col gap-2">
              <select
                className="border border-gray-300 rounded px-3 py-2 text-sm"
                onChange={(e) => assignTrip(trip._id, e.target.value)}
                defaultValue=""
              >
                <option value="" disabled>Assign to agent</option>
                {agents.map((agent) => (
                  <option key={agent._id} value={agent._id}>
                    {agent.name}
                  </option>
                ))}
              </select>

              {/* Cancel button */}
              <button
                onClick={() => cancelTrip(trip._id)}
                className="bg-red-500 text-white text-sm font-medium px-3 py-2 rounded hover:bg-red-600 transition"
              >
                Cancel Trip
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
