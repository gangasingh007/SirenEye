import { Link } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'
import RegisterForm from '../components/auth/RegisterForm'
import Card from '../components/common/Card'

const Register = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-4">
            <AlertTriangle className="h-10 w-10 text-primary-600" />
            <span className="text-3xl font-bold text-gray-900">SirenEye</span>
          </Link>
          <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
          <p className="text-gray-600 mt-2">Join us in making emergency response faster</p>
        </div>

        <Card>
          <RegisterForm />
        </Card>

        <p className="text-center mt-6 text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register
