import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { MapPin, Calendar, Clock, User, Phone, Building, Trash2, CheckCircle, XCircle } from 'lucide-react';

const STATUS_COLORS = {
  available: 'bg-green-100 text-green-700', claimed: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-purple-100 text-purple-700', expired: 'bg-red-100 text-red-700',
  pending: 'bg-yellow-100 text-yellow-700', approved: 'bg-blue-100 text-blue-700',
  picked_up: 'bg-indigo-100 text-indigo-700', cancelled: 'bg-gray-100 text-gray-700',
};

const TYPE_LABELS = {
  prepared: 'Prepared Meals', packaged: 'Packaged Food', produce: 'Fresh Produce',
  bakery: 'Bakery Items', dairy: 'Dairy Products', other: 'Other'
};

export default function DonationDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [donation, setDonation] = useState(null);
  const [claims, setClaims] = useState([]);
  const [claimNotes, setClaimNotes] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    api.get(`/donations/${id}`).then(res => {
      setDonation(res.data.donation);
      setClaims(res.data.claims);
      setLoading(false);
    }).catch(() => {
      toast.error('Donation not found');
      navigate('/dashboard');
    });
  };

  useEffect(fetchData, [id, navigate]);

  const handleClaim = async () => {
    try {
      await api.post('/claims', { donation_id: parseInt(id), notes: claimNotes });
      toast.success('Donation claimed!');
      fetchData();
      setClaimNotes('');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to claim');
    }
  };

  const handleClaimStatus = async (claimId, status) => {
    try {
      await api.patch(`/claims/${claimId}/status`, { status });
      toast.success(`Claim ${status}`);
      fetchData();
    } catch (err) {
      toast.error('Failed to update claim');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this donation?')) return;
    try {
      await api.delete(`/donations/${id}`);
      toast.success('Donation deleted');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div></div>;
  }

  const isDonor = user.role === 'donor' && donation.donor_id === user.id;
  const isCharity = user.role === 'charity';
  const alreadyClaimed = claims.some(c => c.charity_id === user.id && c.status !== 'cancelled');

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[donation.status]}`}>
                  {donation.status.replace('_', ' ')}
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                  {TYPE_LABELS[donation.food_type]}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{donation.title}</h1>
            </div>
            {isDonor && (
              <button onClick={handleDelete} className="flex items-center gap-1.5 text-red-500 hover:text-red-700 bg-transparent border border-red-200 px-3 py-2 rounded-lg text-sm cursor-pointer hover:bg-red-50">
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            )}
          </div>

          {donation.description && (
            <p className="text-gray-600 mb-6">{donation.description}</p>
          )}

          <div className="grid sm:grid-cols-2 gap-6 mb-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">Pickup Details</h3>
              <div className="flex items-start gap-2 text-gray-600">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <span>{donation.pickup_address}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span>{donation.pickup_date}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-5 h-5 text-gray-400" />
                <span>{donation.pickup_time_start} - {donation.pickup_time_end}</span>
              </div>
              <div className="mt-2 px-4 py-3 bg-green-50 rounded-lg">
                <span className="text-sm text-gray-500">Quantity:</span>
                <span className="text-lg font-bold text-green-700 ml-2">{donation.quantity}</span>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">Donor Info</h3>
              <div className="flex items-center gap-2 text-gray-600">
                <Building className="w-5 h-5 text-gray-400" />
                <span>{donation.donor_organization}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <User className="w-5 h-5 text-gray-400" />
                <span>{donation.donor_name}</span>
              </div>
              {donation.donor_phone && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span>{donation.donor_phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Charity: Claim section */}
          {isCharity && donation.status === 'available' && !alreadyClaimed && (
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h3 className="font-semibold text-gray-900 mb-3">Claim this Donation</h3>
              <textarea value={claimNotes} onChange={e => setClaimNotes(e.target.value)}
                placeholder="Add a note for the donor (optional)..." rows={2}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none resize-none mb-3" />
              <button onClick={handleClaim}
                className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-green-700 cursor-pointer">
                Claim Donation
              </button>
            </div>
          )}

          {isCharity && alreadyClaimed && (
            <div className="border-t border-gray-200 pt-6 mt-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 font-medium">
                You have already claimed this donation.
              </div>
            </div>
          )}

          {/* Claims list (visible to donor) */}
          {isDonor && claims.length > 0 && (
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Claims ({claims.length})</h3>
              <div className="space-y-3">
                {claims.map(claim => (
                  <div key={claim.id} className="border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <p className="font-medium text-gray-900">{claim.charity_organization}</p>
                      <p className="text-sm text-gray-500">{claim.charity_name} {claim.charity_phone && `| ${claim.charity_phone}`}</p>
                      {claim.notes && <p className="text-sm text-gray-600 mt-1 italic">"{claim.notes}"</p>}
                      <span className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[claim.status]}`}>
                        {claim.status.replace('_', ' ')}
                      </span>
                    </div>
                    {claim.status === 'pending' && (
                      <div className="flex gap-2">
                        <button onClick={() => handleClaimStatus(claim.id, 'approved')}
                          className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm cursor-pointer hover:bg-green-700">
                          <CheckCircle className="w-4 h-4" /> Approve
                        </button>
                        <button onClick={() => handleClaimStatus(claim.id, 'cancelled')}
                          className="flex items-center gap-1 bg-white border border-red-200 text-red-600 px-3 py-1.5 rounded-lg text-sm cursor-pointer hover:bg-red-50">
                          <XCircle className="w-4 h-4" /> Reject
                        </button>
                      </div>
                    )}
                    {claim.status === 'approved' && (
                      <button onClick={() => handleClaimStatus(claim.id, 'completed')}
                        className="flex items-center gap-1 bg-purple-600 text-white px-3 py-1.5 rounded-lg text-sm cursor-pointer hover:bg-purple-700">
                        <CheckCircle className="w-4 h-4" /> Mark Completed
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
