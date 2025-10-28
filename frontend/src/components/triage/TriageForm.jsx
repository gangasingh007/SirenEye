import { useState } from 'react'
import { triageAPI } from '../../services/api'
import Button from '../common/Button'
import toast from 'react-hot-toast'
import { Send } from 'lucide-react'

const TriageForm = ({ onSuccess }) => {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!text.trim()) {
      toast.error('Please enter a report')
      return
    }

    setLoading(true)
    try {
      const result = await triageAPI.analyzeTriage(text)
      toast.success('Report analyzed successfully')
      setText('')
      if (onSuccess) onSuccess(result)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to analyze report')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Report Description
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
          placeholder="Describe the emergency situation in detail..."
          disabled={loading}
        />
      </div>

      <Button 
        type="submit" 
        disabled={loading || !text.trim()}
        className="w-full flex items-center justify-center space-x-2"
      >
        <Send className="h-4 w-4" />
        <span>{loading ? 'Analyzing...' : 'Submit Report'}</span>
      </Button>
    </form>
  )
}

export default TriageForm
