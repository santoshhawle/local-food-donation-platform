import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { MapPin, Calendar, Clock, Building, XCircle, CheckCircle } from 'lucide-react';

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700', approved: 'bg-blue-100 text-blue-700',
  picked_up: 'bg-indigo-100 text-indigo-700', completed: 'bg-purple-100 text-purple-700',
  cancelled: 'bg-gray-100 text-gray-700',
};

export default function MyClaims() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchClaims = () => {
    api.get('/claims/my').then(res => {
      setClaims(res.data.claims);
      setLoading(false);
    });
  };

  useEffect(fetchClaims, []);

  const handleStatus = async (claimId, status) => {
    try {
      await api.patch(`/claims/${claimId}/status`, { status });
      toast.success(`Claim ${status}`);
      fetchClaims();
    } catch (err) {
      toast.error('Failed to update');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div></div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Claims</h1>

      {claims.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg">No claims yet</p>
          <Link to="/browse" className="text-green-600 hover:underline mt-2 inline-block">Browse available donations</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {claims.map(claim => (
            <div key={claim.id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-3">
                <div>
                  <Link to={`/donations/${claim.donation_id}`} className="text-lg font-semibold text-gray-900 hover:text-green-700 no-underline">
                    {claim.title}
                  </Link>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[claim.status]}`}>
                      {claim.status.replace('_', ' ')}
                    </span>
                    <span className="text-sm text-gray-500">{claim.food_type} &middot; {claim.quantity}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {claim.status === 'approved' && (
                    <button onClick={() => handleStatus(claim.id, 'completed')}
                      className="flex items-center gap-1 bg-purple-600 text-white px-3 py-1.5 rounded-lg text-sm cursor-pointer hover:bg-purple-700">
                      <CheckCircle className="w-4 h-4" /> Mark Picked Up
                    </button>
                  )}
                  {['pending', 'approved'].includes(claim.status) && (
                    <button onClick={() => handleStatus(claim.id, 'cancelled')}
                      className="flex items-center gap-1 border border-red-200 text-red-600 px-3 py-1.5 rounded-lg text-sm cursor-pointer hover:bg-red-50 bg-white">
                      <XCircle className="w-4 h-4" /> Cancel
                    </button>
                  )}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-2 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-gray-400" />
                  <span>{claim.donor_organization}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="truncate">{claim.pickup_address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>{claim.pickup_date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>{claim.pickup_time_start} - {claim.pickup_time_end}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
