import { MapPin, Users, Package, AlertCircle } from 'lucide-react'
import UrgencyBadge from './UrgencyBadge'
import Card from '../common/Card'
import { URGENCY_LEVELS } from '../../utils/constants'

const TriageCard = ({ data }) => {
  const urgencyConfig = URGENCY_LEVELS[data.urgency_level] || URGENCY_LEVELS.LOW

  return (
    <Card className={`border-l-4 ${urgencyConfig.borderColor} ${urgencyConfig.bgColor}`}>
      <div className="flex justify-between items-start mb-3">
        <UrgencyBadge level={data.urgency_level} />
        <span className={`text-sm font-medium ${urgencyConfig.textColor}`}>
          {data.incident_category}
        </span>
      </div>

      <p className="text-gray-700 mb-4">{data.summary}</p>

      <div className="space-y-2 text-sm text-gray-600">
        {data.location_extracted && data.location_extracted !== 'null' && (
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span>{data.location_extracted}</span>
          </div>
        )}

        {data.people_affected && data.people_affected !== 'null' && (
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-gray-400" />
            <span>People affected: {data.people_affected}</span>
          </div>
        )}

        {data.resources_needed && data.resources_needed !== 'null' && (
          <div className="flex items-center space-x-2">
            <Package className="h-4 w-4 text-gray-400" />
            <span>Resources: {data.resources_needed}</span>
          </div>
        )}
      </div>
    </Card>
  )
}

export default TriageCard
