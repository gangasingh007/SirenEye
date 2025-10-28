export const URGENCY_LEVELS = {
  CRITICAL: {
    label: 'Critical',
    color: 'bg-red-500',
    textColor: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
  },
  HIGH: {
    label: 'High',
    color: 'bg-orange-500',
    textColor: 'text-orange-700',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
  },
  MEDIUM: {
    label: 'Medium',
    color: 'bg-yellow-500',
    textColor: 'text-yellow-700',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
  },
  LOW: {
    label: 'Low',
    color: 'bg-green-500',
    textColor: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
  IGNORE: {
    label: 'Ignore',
    color: 'bg-gray-500',
    textColor: 'text-gray-700',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
  },
}

export const INCIDENT_CATEGORIES = [
  'Fire',
  'Flood',
  'Medical',
  'Trapped',
  'Infrastructure',
  'Other',
]
