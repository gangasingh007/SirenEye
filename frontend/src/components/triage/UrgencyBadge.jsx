import { URGENCY_LEVELS } from '../../utils/constants'

const UrgencyBadge = ({ level }) => {
  const urgency = URGENCY_LEVELS[level] || URGENCY_LEVELS.LOW

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${urgency.color} text-white`}>
      {urgency.label}
    </span>
  )
}

export default UrgencyBadge
