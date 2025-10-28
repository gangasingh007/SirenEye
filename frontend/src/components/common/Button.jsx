const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  disabled = false,
  className = '',
  fullWidth = false,
  ...props 
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary-600 hover:bg-primary-700 text-white'
      case 'secondary':
        return 'bg-gray-200 hover:bg-gray-300 text-gray-800'
      case 'danger':
        return 'bg-red-500 hover:bg-red-600 text-white'
      case 'outline':
        return 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50'
      default:
        return 'bg-primary-600 hover:bg-primary-700 text-white'
    }
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        font-medium py-2 px-4 rounded-lg transition-colors duration-200 
        disabled:opacity-50 disabled:cursor-not-allowed
        ${getVariantClasses()}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
