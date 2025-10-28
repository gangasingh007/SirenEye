import { Link } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'
import LoginForm from '../components/auth/LoginForm'
import Card from '../components/common/Card'

const Login = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-4">
            <AlertTriangle className="h-10 w-10 text-primary-600" />
            <span className="text-3xl font-bold text-gray-900">SirenEye</span>
          </Link>
          <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-gray-600 mt-2">Sign in to access your dashboard</p>
        </div>

        <Card>
          <LoginForm />
        </Card>

        <p className="text-center mt-6 text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
