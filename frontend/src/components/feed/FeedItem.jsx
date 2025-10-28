import { MapPin, Clock } from 'lucide-react'
import Card from '../common/Card'
import { URGENCY_LEVELS } from '../../utils/constants'
import UrgencyBadge from '../triage/UrgencyBadge'

const FeedItem = ({ item }) => {
  const urgencyConfig = URGENCY_LEVELS[item.urgency_level] || URGENCY_LEVELS.LOW

  return (
    <Card className={`border-l-4 ${urgencyConfig.borderColor} hover:shadow-lg transition-shadow`}>
      <div className="flex justify-between items-start mb-3">
        <UrgencyBadge level={item.urgency_level} />
        <span className="text-xs text-gray-500">Just now</span>
      </div>

      <h3 className="font-semibold text-gray-900 mb-2">{item.summary}</h3>
      <p className="text-gray-600 text-sm mb-3">{item.text}</p>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-1">
          <Clock className="h-3 w-3" />
          <span>Live Feed</span>
        </div>
      </div>
    </Card>
  )
}

export default FeedItem
