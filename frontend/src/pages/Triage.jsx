import { useState } from 'react'
import Navbar from '../components/common/Navbar'
import Card from '../components/common/Card'
import TriageForm from '../components/triage/TriageForm'
import TriageCard from '../components/triage/TriageCard'

const Triage = () => {
  const [result, setResult] = useState(null)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Submit Emergency Report</h1>
          <p className="text-gray-600 mt-2">
            Provide details about the emergency situation for AI-powered analysis
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <h2 className="text-xl font-semibold mb-4">Report Details</h2>
            <TriageForm onSuccess={setResult} />
          </Card>

          <div>
            <h2 className="text-xl font-semibold mb-4">Analysis Result</h2>
            {result ? (
              <TriageCard data={result} />
            ) : (
              <Card className="bg-gray-50">
                <p className="text-center text-gray-500 py-8">
                  Submit a report to see the analysis
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Triage
