import { Link } from 'react-router-dom'
import { FileText, Activity, TrendingUp } from 'lucide-react'
import Navbar from '../components/common/Navbar'
import Card from '../components/common/Card'
import { useAuth } from '../hooks/useAuth'
import DonationModal from '../components/donation/DonationModal'

const Dashboard = () => {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-gray-600 mt-2">Here's your emergency response dashboard</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-l-4 border-primary-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Reports</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <FileText className="h-12 w-12 text-primary-600" />
            </div>
          </Card>

          <Card className="border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Incidents</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <Activity className="h-12 w-12 text-orange-500" />
            </div>
          </Card>

          <Card className="border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Response Rate</p>
                <p className="text-3xl font-bold text-gray-900">100%</p>
              </div>
              <TrendingUp className="h-12 w-12 text-green-500" />
            </div>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link 
                to="/triage"
                className="block p-4 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors"
              >
                <h4 className="font-medium text-gray-900">Submit New Report</h4>
                <p className="text-sm text-gray-600">Analyze an emergency situation</p>
              </Link>
              <Link 
                to="/feed"
                className="block p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <h4 className="font-medium text-gray-900">View Live Feed</h4>
                <p className="text-sm text-gray-600">Monitor real-time incidents</p>
              </Link>
            </div>
          </Card>

          <Card>
            <h3 className="text-xl font-semibold mb-4">System Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Triage System</span>
                <span className="flex items-center text-green-600">
                  <span className="h-2 w-2 bg-green-600 rounded-full mr-2"></span>
                  Operational
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Feed Service</span>
                <span className="flex items-center text-green-600">
                  <span className="h-2 w-2 bg-green-600 rounded-full mr-2"></span>
                  Operational
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">API Status</span>
                <span className="flex items-center text-green-600">
                  <span className="h-2 w-2 bg-green-600 rounded-full mr-2"></span>
                  Operational
                </span>
              </div>
            </div>
          </Card>
          <DonationModal />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
