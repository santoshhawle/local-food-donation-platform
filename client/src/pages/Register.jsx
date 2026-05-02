import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { UserPlus } from 'lucide-react';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'donor', organization: '', phone: '', address: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created! Welcome to FoodShare.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <UserPlus className="w-12 h-12 text-green-600 mx-auto mb-3" />
          <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-500 mt-2">Join FoodShare and start making a difference</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-2xl p-8 border border-gray-100 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input type="text" required value={form.name} onChange={update('name')}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" required value={form.email} onChange={update('email')}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" required minLength={6} value={form.password} onChange={update('password')}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">I am a...</label>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setForm({ ...form, role: 'donor' })}
                className={`p-3 rounded-lg border-2 text-center cursor-pointer transition-colors ${form.role === 'donor' ? 'border-green-600 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600 bg-white hover:border-gray-300'}`}>
                <span className="font-medium block">Restaurant / Store</span>
                <span className="text-xs opacity-70">I want to donate food</span>
              </button>
              <button type="button" onClick={() => setForm({ ...form, role: 'charity' })}
                className={`p-3 rounded-lg border-2 text-center cursor-pointer transition-colors ${form.role === 'charity' ? 'border-green-600 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600 bg-white hover:border-gray-300'}`}>
                <span className="font-medium block">Charity / NGO</span>
                <span className="text-xs opacity-70">I want to receive food</span>
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
            <input type="text" required value={form.organization} onChange={update('organization')}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              placeholder={form.role === 'donor' ? 'e.g., Fresh Bites Restaurant' : 'e.g., City Food Bank'} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone (optional)</label>
              <input type="tel" value={form.phone} onChange={update('phone')}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address (optional)</label>
              <input type="text" value={form.address} onChange={update('address')}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 cursor-pointer">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
          <p className="text-center text-sm text-gray-500">
            Already have an account? <Link to="/login" className="text-green-600 hover:underline font-medium">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
