import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { AlertTriangle, LogOut, Heart } from 'lucide-react'
import { useState } from 'react'
import DonationModal from '../donation/DonationModal'

const Navbar = () => {
  const { user, token, logout } = useAuth()
  const navigate = useNavigate()
  const [showDonation, setShowDonation] = useState(false)

  return (
    <>
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <AlertTriangle className="h-8 w-8 text-primary-600" />
                <span className="text-2xl font-bold text-gray-900">SirenEye</span>
              </Link>
              {token && (
                <div className="hidden md:flex ml-10 space-x-4">
                  <Link
                    to="/dashboard"
                    className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/triage"
                    className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Report
                  </Link>
                  <Link
                    to="/feed"
                    className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Feed
                  </Link>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {/* Donate Button - Opens Modal */}
              <button
                onClick={() => setShowDonation(true)}
                className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <Heart className="h-4 w-4 text-black" />
                <span className="hidden sm:inline text-black">Donate</span>
              </button>

              {token ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700">
                    {user?.firstName} {user?.lastName}
                  </span>
                  <button
                    onClick={logout}
                    className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Modal Component - Controlled by showDonation state */}
      {showDonation && (
        <DonationModal 
          isOpen={showDonation} 
          onClose={() => setShowDonation(false)} 
        />
      )}
    </>
  )
}

export default Navbar
