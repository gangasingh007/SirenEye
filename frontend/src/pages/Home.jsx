import { Link } from 'react-router-dom'
import { AlertTriangle, Zap, Shield, Globe } from 'lucide-react'
import Navbar from '../components/common/Navbar'
import Button from '../components/common/Button'

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <AlertTriangle className="h-20 w-20 text-primary-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Emergency Response, <span className="text-primary-600">Simplified</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            SirenEye uses AI to analyze emergency reports, prioritize incidents, and coordinate 
            disaster response efforts in real-time. Help save lives with intelligent triage.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/register">
              <button className="px-8 py-3 border-2 rounded-xl text-black t text-lg">
                Get Started
              </button>
            </Link>
            <Link to="/login">
              <Button variant="outline" className="px-8 py-3 text-lg">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="text-center p-6">
            <div className="flex justify-center mb-4">
              <Zap className="h-12 w-12 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Real-Time Analysis</h3>
            <p className="text-gray-600">
              AI-powered triage instantly categorizes emergency reports by urgency level
            </p>
          </div>

          <div className="text-center p-6">
            <div className="flex justify-center mb-4">
              <Shield className="h-12 w-12 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Priority Management</h3>
            <p className="text-gray-600">
              Automatically sorts critical incidents to ensure fastest response times
            </p>
          </div>

          <div className="text-center p-6">
            <div className="flex justify-center mb-4">
              <Globe className="h-12 w-12 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Live Feed</h3>
            <p className="text-gray-600">
              Aggregates news and social media to build comprehensive disaster awareness
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
