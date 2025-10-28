import { useState, useEffect } from 'react'
import { triageAPI } from '../../services/api'
import FeedItem from './FeedItem'
import { RefreshCw } from 'lucide-react'
import Button from '../common/Button'
import toast from 'react-hot-toast'

const AutoTriageFeed = () => {
  const [feed, setFeed] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchFeed = async () => {
    setLoading(true)
    try {
      const data = await triageAPI.getAutoTriageFeed()
      setFeed(Array.isArray(data) ? data : [])
    } catch (error) {
      toast.error('Failed to load feed')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFeed()
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Live Triage Feed</h2>
        <Button 
          onClick={fetchFeed}
          disabled={loading}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </Button>
      </div>

      {loading && feed.length === 0 ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : feed.length > 0 ? (
        <div className="space-y-4">
          {feed.map((item, index) => (
            <FeedItem key={index} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          No reports available at the moment
        </div>
      )}
    </div>
  )
}

export default AutoTriageFeed
