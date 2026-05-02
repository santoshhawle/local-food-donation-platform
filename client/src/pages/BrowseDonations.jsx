import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { MapPin, Calendar, Clock, UtensilsCrossed } from 'lucide-react';

const TYPE_LABELS = {
  prepared: 'Prepared Meals', packaged: 'Packaged Food', produce: 'Fresh Produce',
  bakery: 'Bakery Items', dairy: 'Dairy Products', other: 'Other'
};

const TYPE_COLORS = {
  prepared: 'bg-orange-100 text-orange-700', packaged: 'bg-blue-100 text-blue-700',
  produce: 'bg-green-100 text-green-700', bakery: 'bg-amber-100 text-amber-700',
  dairy: 'bg-cyan-100 text-cyan-700', other: 'bg-gray-100 text-gray-700'
};

export default function BrowseDonations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.get('/donations').then(res => {
      setDonations(res.data.donations);
      setLoading(false);
    });
  }, []);

  const filtered = filter === 'all' ? donations : donations.filter(d => d.food_type === filter);

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div></div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Available Donations</h1>
          <p className="text-gray-500 mt-1">{filtered.length} donation{filtered.length !== 1 ? 's' : ''} available near you</p>
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-green-500 outline-none">
          <option value="all">All Types</option>
          <option value="prepared">Prepared Meals</option>
          <option value="packaged">Packaged Food</option>
          <option value="produce">Fresh Produce</option>
          <option value="bakery">Bakery Items</option>
          <option value="dairy">Dairy Products</option>
          <option value="other">Other</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <UtensilsCrossed className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg">No donations available right now</p>
          <p className="text-sm mt-1">Check back later for new listings</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(donation => (
            <Link key={donation.id} to={`/donations/${donation.id}`}
              className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow p-5 no-underline block">
              <div className="flex items-start justify-between mb-3">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${TYPE_COLORS[donation.food_type]}`}>
                  {TYPE_LABELS[donation.food_type]}
                </span>
                <span className="text-sm font-semibold text-green-700">{donation.quantity}</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{donation.title}</h3>
              <p className="text-sm text-gray-500 mb-3 line-clamp-2">{donation.description || 'No description provided'}</p>
              <p className="text-sm font-medium text-gray-700 mb-3">{donation.donor_organization}</p>
              <div className="space-y-1.5 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="truncate">{donation.pickup_address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>{donation.pickup_date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>{donation.pickup_time_start} - {donation.pickup_time_end}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
