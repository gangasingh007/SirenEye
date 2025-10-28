import Navbar from '../components/common/Navbar'
import AutoTriageFeed from '../components/feed/AutoTriageFeed'

const Feed = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AutoTriageFeed />
      </div>
    </div>
  )
}

export default Feed
