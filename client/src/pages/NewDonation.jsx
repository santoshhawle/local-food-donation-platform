import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Package } from 'lucide-react';

const FOOD_TYPES = [
  { value: 'prepared', label: 'Prepared Meals' },
  { value: 'packaged', label: 'Packaged Food' },
  { value: 'produce', label: 'Fresh Produce' },
  { value: 'bakery', label: 'Bakery Items' },
  { value: 'dairy', label: 'Dairy Products' },
  { value: 'other', label: 'Other' },
];

export default function NewDonation() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', food_type: 'prepared', quantity: '',
    pickup_address: '', pickup_date: '', pickup_time_start: '', pickup_time_end: ''
  });

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/donations', form);
      toast.success('Donation created successfully!');
      navigate(`/donations/${res.data.donation.id}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create donation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <Package className="w-12 h-12 text-green-600 mx-auto mb-3" />
        <h1 className="text-2xl font-bold text-gray-900">Create New Donation</h1>
        <p className="text-gray-500 mt-1">Share your surplus food with local charities</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-2xl p-8 border border-gray-100 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input type="text" required value={form.title} onChange={update('title')}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
            placeholder="e.g., Fresh Sandwiches and Salads" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea rows={3} value={form.description} onChange={update('description')}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none resize-none"
            placeholder="Describe the food items, dietary info, allergens, etc." />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Food Type</label>
            <select value={form.food_type} onChange={update('food_type')}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-white">
              {FOOD_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
            <input type="text" required value={form.quantity} onChange={update('quantity')}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              placeholder="e.g., 50 meals, 20 kg" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Address</label>
          <input type="text" required value={form.pickup_address} onChange={update('pickup_address')}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
            placeholder="Full address for pickup" />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Date</label>
            <input type="date" required value={form.pickup_date} onChange={update('pickup_date')}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
            <input type="time" required value={form.pickup_time_start} onChange={update('pickup_time_start')}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
            <input type="time" required value={form.pickup_time_end} onChange={update('pickup_time_end')}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 cursor-pointer text-base">
          {loading ? 'Creating...' : 'Create Donation'}
        </button>
      </form>
    </div>
  );
}
