import { useState, useEffect } from 'react'
import { X, Heart, Check, CreditCard, DollarSign } from 'lucide-react'
import Button from '../common/Button'
import Input from '../common/Input'
import toast from 'react-hot-toast'

const PRESET_AMOUNTS = [10, 25, 50, 100, 250, 500]

const DonationModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1)
  const [customAmount, setCustomAmount] = useState('')
  const [selectedAmount, setSelectedAmount] = useState(null)
  const [selectedFund, setSelectedFund] = useState(null)
  const [loading, setLoading] = useState(false)

  const [donorInfo, setDonorInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  })

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
  })

  const [errors, setErrors] = useState({})

  const reliefFunds = [
    {
      id: 1,
      name: 'General Disaster Relief Fund',
      description: 'Support immediate disaster response and recovery efforts worldwide',
      icon: '🌍',
    },
    {
      id: 2,
      name: 'Emergency Medical Aid',
      description: 'Provide critical medical supplies and healthcare services',
      icon: '🏥',
    },
    {
      id: 3,
      name: 'Food & Water Relief',
      description: 'Deliver essential food and clean water to affected communities',
      icon: '🍲',
    },
    {
      id: 4,
      name: 'Shelter & Housing',
      description: 'Help rebuild homes and provide temporary shelter',
      icon: '🏠',
    },
  ]

  // Reset all states when modal closes
  const resetModal = () => {
    setStep(1)
    setCustomAmount('')
    setSelectedAmount(null)
    setSelectedFund(null)
    setDonorInfo({ firstName: '', lastName: '', email: '', phone: '' })
    setPaymentInfo({ cardNumber: '', expiryDate: '', cvv: '', cardName: '' })
    setErrors({})
  }

  // Handle body scroll when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleClose = () => {
    resetModal()
    onClose()
  }

  const getFinalAmount = () => selectedAmount || parseFloat(customAmount) || 0

  // Validations
  const validateStep1 = () => {
    const amount = getFinalAmount()
    if (amount < 1) {
      toast.error('Please select or enter a valid amount')
      return false
    }
    if (!selectedFund) {
      toast.error('Please select a relief fund')
      return false
    }
    return true
  }

  const validateStep2 = () => {
    const newErrors = {}
    if (!donorInfo.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!donorInfo.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!donorInfo.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(donorInfo.email)) {
      newErrors.email = 'Email is invalid'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep3 = () => {
    const newErrors = {}
    const cardNum = paymentInfo.cardNumber.replace(/\s/g, '')

    if (!cardNum) newErrors.cardNumber = 'Card number is required'
    else if (cardNum.length < 15 || cardNum.length > 16) newErrors.cardNumber = 'Invalid card number'

    if (!paymentInfo.expiryDate) newErrors.expiryDate = 'Expiry date is required'
    else if (!/^\d{2}\/\d{2}$/.test(paymentInfo.expiryDate)) newErrors.expiryDate = 'Format: MM/YY'

    if (!paymentInfo.cvv) newErrors.cvv = 'CVV is required'
    else if (!/^\d{3,4}$/.test(paymentInfo.cvv)) newErrors.cvv = 'Invalid CVV'

    if (!paymentInfo.cardName.trim()) newErrors.cardName = 'Cardholder name is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Step Handlers
  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2)
    else if (step === 2 && validateStep2()) setStep(3)
  }

  const handleProcessPayment = async () => {
    if (!validateStep3()) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setStep(4)
      toast.success('Donation successful! Thank you for your support.')
    }, 2000)
  }

  // Formatting functions
  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\s/g, '')
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned
    return formatted.substring(0, 19)
  }

  const formatExpiryDate = (value) => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length >= 2) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`
    }
    return cleaned
  }

  // Don't render if not open
  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      {/* Backdrop with blur effect */}
      <div className="absolute inset-0 bg-gray-900 bg-opacity-75 backdrop-blur-sm" />

      {/* Modal Container */}
      <div 
        className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-5 flex justify-between items-center rounded-t-2xl z-10">
          <div className="flex items-center space-x-3">
            <div className="bg-white bg-opacity-20 p-2 rounded-lg">
              <Heart className="h-6 w-6 text-black" />
            </div>
            <h2 className="text-2xl font-bold text-black">
              {step === 4 ? 'Thank You!' : 'Make a Donation'}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-black hover:text-gray-200 transition-colors p-2 hover:bg-white hover:bg-opacity-20 rounded-lg"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Progress Bar */}
        {step < 4 && (
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Step {step} of 3</span>
              <span className="text-sm font-semibold text-primary-600">{Math.round((step / 3) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-gradient-to-r from-primary-500 to-primary-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>
        )}

        <div className="p-6 bg-gray-50">
          {/* === STEP 1: Amount Selection === */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Relief Fund</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {reliefFunds.map((fund) => (
                    <button
                      key={fund.id}
                      onClick={() => setSelectedFund(fund)}
                      className={`p-4 rounded-xl border-2 text-left transition-all transform hover:scale-105 ${
                        selectedFund?.id === fund.id
                          ? 'border-primary-600 bg-primary-50 shadow-md'
                          : 'border-gray-300 bg-white hover:border-primary-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <span className="text-3xl">{fund.icon}</span>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 text-sm mb-1">
                            {fund.name}
                          </h4>
                          <p className="text-xs text-gray-600 leading-relaxed">{fund.description}</p>
                        </div>
                        {selectedFund?.id === fund.id && (
                          <Check className="h-5 w-5 text-primary-600 flex-shrink-0" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Amount</h3>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {PRESET_AMOUNTS.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => {
                        setSelectedAmount(amount)
                        setCustomAmount('')
                      }}
                      className={`py-4 px-4 rounded-xl border-2 font-bold text-lg transition-all transform hover:scale-105 ${
                        selectedAmount === amount
                          ? 'border-primary-600 bg-primary-600 text-white shadow-lg'
                          : 'border-gray-300 bg-white hover:border-primary-400 text-gray-700 hover:shadow-md'
                      }`}
                    >
                      ${amount}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <input
                    type="number"
                    placeholder="Enter custom amount"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value)
                      setSelectedAmount(null)
                    }}
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg font-medium"
                  />
                </div>

                {getFinalAmount() > 0 && (
                  <div className="mt-4 p-5 bg-gradient-to-r from-primary-50 to-green-50 rounded-xl border border-primary-200">
                    <div className="flex items-start space-x-3">
                      <Check className="h-6 w-6 text-primary-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-black leading-relaxed">
                        Your donation of <strong className="text-primary-700 text-lg">${getFinalAmount()}</strong> will
                        help provide critical support to {selectedFund?.name.toLowerCase() || 'disaster relief efforts'}.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <Button onClick={handleNext} fullWidth className="py-4 text-lg font-semibold">
                Continue to Donor Information →
              </Button>
            </div>
          )}

          {/* === STEP 2: Donor Information === */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-5">Your Information</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="First Name"
                      value={donorInfo.firstName}
                      onChange={(e) => {
                        setDonorInfo({ ...donorInfo, firstName: e.target.value })
                        setErrors({ ...errors, firstName: '' })
                      }}
                      error={errors.firstName}
                      placeholder="John"
                    />
                    <Input
                      label="Last Name"
                      value={donorInfo.lastName}
                      onChange={(e) => {
                        setDonorInfo({ ...donorInfo, lastName: e.target.value })
                        setErrors({ ...errors, lastName: '' })
                      }}
                      error={errors.lastName}
                      placeholder="Doe"
                    />
                  </div>

                  <Input
                    label="Email"
                    type="email"
                    value={donorInfo.email}
                    onChange={(e) => {
                      setDonorInfo({ ...donorInfo, email: e.target.value })
                      setErrors({ ...errors, email: '' })
                    }}
                    error={errors.email}
                    placeholder="john@example.com"
                  />

                  <Input
                    label="Phone (Optional)"
                    type="tel"
                    value={donorInfo.phone}
                    onChange={(e) => setDonorInfo({ ...donorInfo, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div className="bg-gradient-to-br from-primary-50 to-green-50 p-6 rounded-xl border border-primary-100 shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Check className="h-5 w-5 text-primary-600 mr-2" />
                  Donation Summary
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center py-2 border-b border-primary-100">
                    <span className="text-gray-700">Amount:</span>
                    <span className="font-bold text-xl text-primary-600">${getFinalAmount()}</span>
                  </div>
                  <div className="flex justify-between items-start py-2">
                    <span className="text-gray-700">Fund:</span>
                    <span className="font-semibold text-right flex-1 ml-4 text-gray-900">
                      {selectedFund?.name}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button onClick={() => setStep(1)} variant="secondary" fullWidth className="py-3">
                  ← Back
                </Button>
                <Button onClick={handleNext} fullWidth className="py-3 text-lg font-semibold">
                  Continue to Payment →
                </Button>
              </div>
            </div>
          )}

          {/* === STEP 3: Payment === */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-5 flex items-center">
                  <CreditCard className="h-6 w-6 mr-3 text-primary-600" />
                  Payment Details
                </h3>
                <div className="space-y-4">
                  <Input
                    label="Card Number"
                    value={paymentInfo.cardNumber}
                    onChange={(e) => {
                      setPaymentInfo({
                        ...paymentInfo,
                        cardNumber: formatCardNumber(e.target.value),
                      })
                      setErrors({ ...errors, cardNumber: '' })
                    }}
                    error={errors.cardNumber}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Expiry Date"
                      value={paymentInfo.expiryDate}
                      onChange={(e) => {
                        setPaymentInfo({
                          ...paymentInfo,
                          expiryDate: formatExpiryDate(e.target.value),
                        })
                        setErrors({ ...errors, expiryDate: '' })
                      }}
                      error={errors.expiryDate}
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                    <Input
                      label="CVV"
                      type="password"
                      value={paymentInfo.cvv}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '')
                        setPaymentInfo({ ...paymentInfo, cvv: value })
                        setErrors({ ...errors, cvv: '' })
                      }}
                      error={errors.cvv}
                      placeholder="123"
                      maxLength={4}
                    />
                  </div>

                  <Input
                    label="Cardholder Name"
                    value={paymentInfo.cardName}
                    onChange={(e) => {
                      setPaymentInfo({ ...paymentInfo, cardName: e.target.value })
                      setErrors({ ...errors, cardName: '' })
                    }}
                    error={errors.cardName}
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div className="bg-blue-50 p-5 rounded-xl border-2 border-blue-200">
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                    <Check className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="text-sm text-gray-800">
                    <p className="font-semibold mb-1 text-blue-900">🔒 Secure Payment</p>
                    <p className="leading-relaxed">
                      {/* This is a demonstration form. No actual payment will be processed, and no real card information is stored or transmitted. */}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200 shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-4">Final Summary</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center pb-2">
                    <span className="text-gray-700">Donation Amount:</span>
                    <span className="font-semibold text-lg text-gray-900">${getFinalAmount()}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2">
                    <span className="text-gray-700">Processing Fee:</span>
                    <span className="font-semibold text-gray-900">$0.00</span>
                  </div>
                  <div className="border-t-2 border-gray-300 pt-3 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-900">Total:</span>
                      <span className="font-bold text-2xl text-primary-600">
                        ${getFinalAmount()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button onClick={() => setStep(2)} variant="secondary" fullWidth className="py-3">
                  ← Back
                </Button>
                <Button
                  onClick={handleProcessPayment}
                  disabled={loading}
                  fullWidth
                  className="py-4 text-lg font-bold"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    `💚 Donate $${getFinalAmount()}`
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* === STEP 4: Success === */}
          {step === 4 && (
            <div className="text-center space-y-6 py-8">
              <div className="flex justify-center">
                <div className="bg-gradient-to-br from-green-100 to-primary-100 rounded-full p-8 shadow-lg">
                  <Check className="h-20 w-20 text-green-600" />
                </div>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-3">
                  Thank You for Your Generosity!
                </h3>
                <p className="text-gray-700 text-lg max-w-md mx-auto leading-relaxed">
                  Your donation of <strong className="text-primary-600 text-2xl">${getFinalAmount()}</strong> to{' '}
                  <strong className="text-gray-900">{selectedFund?.name || 'the selected fund'}</strong> will make a real difference.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md text-left max-w-md mx-auto border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4 text-center">📧 Receipt Details</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="font-mono font-semibold text-gray-900">MOCK-{Date.now().toString().slice(-8)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-semibold text-gray-900">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Donor:</span>
                    <span className="font-semibold text-gray-900">{donorInfo.firstName} {donorInfo.lastName}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-semibold text-gray-900 text-xs">{donorInfo.email}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Fund:</span>
                    <span className="font-semibold text-right flex-1 ml-4 text-gray-900 text-xs">{selectedFund?.name}</span>
                  </div>
                  <div className="flex justify-between pt-3">
                    <span className="font-bold text-gray-900">Total Amount:</span>
                    <span className="font-bold text-xl text-primary-600">${getFinalAmount()}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-primary-50 to-green-50 p-5 rounded-xl border border-primary-200 max-w-md mx-auto">
                <p className="text-sm text-gray-800 leading-relaxed">
                  ✅ A confirmation email has been sent to <strong className="text-primary-700">{donorInfo.email}</strong>
                </p>
              </div>

              <Button onClick={handleClose} fullWidth className="py-4 text-lg font-semibold max-w-md mx-auto">
                Close Window
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DonationModal
