import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NewDonation from './pages/NewDonation';
import BrowseDonations from './pages/BrowseDonations';
import DonationDetail from './pages/DonationDetail';
import MyClaims from './pages/MyClaims';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/donations/new" element={<ProtectedRoute role="donor"><NewDonation /></ProtectedRoute>} />
            <Route path="/donations/:id" element={<ProtectedRoute><DonationDetail /></ProtectedRoute>} />
            <Route path="/browse" element={<ProtectedRoute role="charity"><BrowseDonations /></ProtectedRoute>} />
            <Route path="/my-claims" element={<ProtectedRoute role="charity"><MyClaims /></ProtectedRoute>} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
