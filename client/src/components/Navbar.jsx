import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, LogOut, LayoutDashboard, Package, ClipboardList } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 text-green-700 font-bold text-xl no-underline">
              <Heart className="w-6 h-6 fill-green-600 text-green-600" />
              FoodShare
            </Link>
            {user && (
              <div className="hidden sm:flex items-center gap-4">
                <Link to="/dashboard" className="flex items-center gap-1.5 text-gray-600 hover:text-green-700 text-sm font-medium no-underline">
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
                {user.role === 'donor' && (
                  <Link to="/donations/new" className="flex items-center gap-1.5 text-gray-600 hover:text-green-700 text-sm font-medium no-underline">
                    <Package className="w-4 h-4" /> New Donation
                  </Link>
                )}
                {user.role === 'charity' && (
                  <>
                    <Link to="/browse" className="flex items-center gap-1.5 text-gray-600 hover:text-green-700 text-sm font-medium no-underline">
                      <Package className="w-4 h-4" /> Browse Donations
                    </Link>
                    <Link to="/my-claims" className="flex items-center gap-1.5 text-gray-600 hover:text-green-700 text-sm font-medium no-underline">
                      <ClipboardList className="w-4 h-4" /> My Claims
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-gray-500 hidden sm:block">
                  <span className="font-medium text-gray-700">{user.organization}</span>
                  <span className="ml-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">{user.role}</span>
                </span>
                <button onClick={handleLogout} className="flex items-center gap-1.5 text-gray-500 hover:text-red-600 text-sm cursor-pointer bg-transparent border-0">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            ) : (
              <div className="flex gap-3">
                <Link to="/login" className="text-gray-600 hover:text-green-700 text-sm font-medium no-underline">Login</Link>
                <Link to="/register" className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 no-underline">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
