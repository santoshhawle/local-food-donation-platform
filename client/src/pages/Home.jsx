import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, Utensils, Building2, Recycle, ArrowRight, Users, TrendingUp, ShieldCheck } from 'lucide-react';

export default function Home() {
  const { user } = useAuth();

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-50 via-white to-emerald-50 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Heart className="w-4 h-4 fill-green-600" /> Reducing Food Waste, Feeding Communities
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-6">
            Connect Surplus Food with <span className="text-green-600">Those Who Need It</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            FoodShare bridges local restaurants and grocery stores with charities, making it simple to donate surplus food and reduce waste in your community.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {user ? (
              <Link to="/dashboard" className="flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-green-700 no-underline text-lg">
                Go to Dashboard <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <>
                <Link to="/register" className="flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-green-700 no-underline text-lg">
                  Get Started Free <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/login" className="flex items-center gap-2 bg-white text-gray-700 border border-gray-300 px-8 py-3 rounded-xl font-medium hover:bg-gray-50 no-underline text-lg">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Utensils, title: 'Donors List Food', desc: 'Restaurants and stores list surplus food with pickup details and quantity.' },
              { icon: Building2, title: 'Charities Claim', desc: 'Local charities browse available donations and claim what they need.' },
              { icon: Recycle, title: 'Food Gets Saved', desc: 'Pickup is coordinated and food reaches those who need it most.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center p-6">
                <div className="inline-flex p-4 bg-green-100 rounded-2xl mb-4">
                  <Icon className="w-8 h-8 text-green-700" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 bg-green-600">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          {[
            { icon: Users, value: 'Community', label: 'Connecting local food networks' },
            { icon: TrendingUp, value: 'Impact', label: 'Reducing food waste daily' },
            { icon: ShieldCheck, value: 'Trust', label: 'Safe, verified organizations' },
          ].map(({ icon: Icon, value, label }) => (
            <div key={value}>
              <Icon className="w-10 h-10 text-green-200 mx-auto mb-3" />
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-green-100">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-50 border-t border-gray-200 text-center text-sm text-gray-500">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Heart className="w-4 h-4 fill-green-600 text-green-600" />
          <span className="font-semibold text-gray-700">FoodShare</span>
        </div>
        <p>Reducing food waste, one donation at a time.</p>
      </footer>
    </div>
  );
}
