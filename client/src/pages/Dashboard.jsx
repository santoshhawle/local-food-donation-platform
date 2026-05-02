import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Package, TrendingUp, CheckCircle, Clock, Plus, ArrowRight } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentItems, setRecentItems] = useState([]);

  useEffect(() => {
    api.get('/stats').then(res => setStats(res.data));
    if (user.role === 'donor') {
      api.get('/donations').then(res => setRecentItems(res.data.donations.slice(0, 5)));
    } else {
      api.get('/claims/my').then(res => setRecentItems(res.data.claims.slice(0, 5)));
    }
  }, [user.role]);

  const donorCards = stats ? [
    { label: 'Total Donations', value: stats.totalDonations, icon: Package, color: 'bg-blue-50 text-blue-700' },
    { label: 'Active', value: stats.activeDonations, icon: TrendingUp, color: 'bg-green-50 text-green-700' },
    { label: 'Claimed', value: stats.claimedDonations, icon: Clock, color: 'bg-yellow-50 text-yellow-700' },
    { label: 'Completed', value: stats.completedDonations, icon: CheckCircle, color: 'bg-purple-50 text-purple-700' },
  ] : [];

  const charityCards = stats ? [
    { label: 'Available Donations', value: stats.availableDonations, icon: Package, color: 'bg-blue-50 text-blue-700' },
    { label: 'My Claims', value: stats.totalClaims, icon: TrendingUp, color: 'bg-green-50 text-green-700' },
    { label: 'Pending', value: stats.pendingClaims, icon: Clock, color: 'bg-yellow-50 text-yellow-700' },
    { label: 'Completed', value: stats.completedClaims, icon: CheckCircle, color: 'bg-purple-50 text-purple-700' },
  ] : [];

  const cards = user.role === 'donor' ? donorCards : charityCards;

  const statusColor = {
    available: 'bg-green-100 text-green-700',
    claimed: 'bg-yellow-100 text-yellow-700',
    completed: 'bg-purple-100 text-purple-700',
    pending: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-blue-100 text-blue-700',
    picked_up: 'bg-indigo-100 text-indigo-700',
    expired: 'bg-red-100 text-red-700',
    cancelled: 'bg-gray-100 text-gray-700',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {user.name}</h1>
          <p className="text-gray-500 mt-1">{user.organization} &mdash; {user.role === 'donor' ? 'Food Donor' : 'Charity Organization'}</p>
        </div>
        {user.role === 'donor' ? (
          <Link to="/donations/new" className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-green-700 no-underline text-sm">
            <Plus className="w-4 h-4" /> New Donation
          </Link>
        ) : (
          <Link to="/browse" className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-green-700 no-underline text-sm">
            <Package className="w-4 h-4" /> Browse Donations
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className={`inline-flex p-2 rounded-lg ${card.color} mb-3`}>
              <card.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            <p className="text-sm text-gray-500">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
          <h2 className="font-semibold text-gray-900">
            {user.role === 'donor' ? 'Recent Donations' : 'Recent Claims'}
          </h2>
          <Link to={user.role === 'donor' ? '/dashboard' : '/my-claims'} className="text-green-600 hover:underline text-sm flex items-center gap-1 no-underline">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {recentItems.length === 0 ? (
          <div className="p-10 text-center text-gray-400">
            {user.role === 'donor' ? 'No donations yet. Create your first donation!' : 'No claims yet. Browse available donations!'}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {recentItems.map((item) => (
              <Link key={item.id}
                to={user.role === 'donor' ? `/donations/${item.id}` : `/donations/${item.donation_id}`}
                className="flex items-center justify-between p-4 hover:bg-gray-50 no-underline">
                <div>
                  <p className="font-medium text-gray-900">{item.title}</p>
                  <p className="text-sm text-gray-500">{item.food_type} &middot; {item.quantity}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor[item.status] || statusColor[item.donation_status] || 'bg-gray-100 text-gray-600'}`}>
                  {(item.status || item.donation_status || '').replace('_', ' ')}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
