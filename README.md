# SirenEye — Emergency Response Triage System

SirenEye is a modern web application designed to streamline emergency response coordination by automatically triaging and prioritizing incoming reports from various sources. The system uses AI to analyze text reports, assigns urgency levels, and helps emergency response teams focus on the most critical situations first.

## 🌟 Features

### Core functionality
- **Text Analysis & Triage**
  - Analyze urgency levels of text reports using LLM
  - Automatic triage categorization
  - Priority-based sorting of emergency reports

- **Auto-Triage Feed**
  - Real-time aggregation of news articles and social media posts
  - AI-powered ranking of emergency reports
  - Unified feed combining multiple data sources

- **Secure Authentication**
  - Email/password registration
  - JWT-based authentication
  - Protected API routes

- **Donation System**
  - Multiple relief fund options
  - Secure payment processing interface
  - Donation receipt generation
  - Fund-specific allocation

### User Interface
- **Dashboard**
  - Overview of urgent reports
  - Quick triage actions
  - Activity monitoring

- **Interactive Feed**
  - Real-time updates
  - Filtered views
  - Priority indicators

- **Triage Interface**
  - Manual report submission
  - Urgency assessment
  - Response tracking

## 🔧 Tech Stack

### Frontend (`/frontend`)
- **Framework**: React.js
- **UI Components**: Custom components with Tailwind CSS
- **State Management**: React hooks and context
- **Features**:
  - Responsive design
  - Real-time updates
  - Form validation
  - Toast notifications
  - Loading states
  - Protected routes

### Backend (`/backend`)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + bcrypt
- **API Integration**: 
  - GNews for news articles
  - Google's Generative AI for text analysis

## 🚀 Getting Started

### Prerequisites
- Node.js v16+
- MongoDB v6+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/gangasingh007/SirenEye.git
cd SirenEye
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Set up environment variables:
   - Backend (`.env`):
     ```
     PORT=8080
     MONGO_URI=mongodb://localhost:27017/SirenEye
     JWT_SECRET=your_jwt_secret
     NEWS_API_KEY=your_gnews_api_key
     GEMINI_API_KEY=your_gemini_api_key
     ```
   - Frontend (`.env`):
     ```
     REACT_APP_API_URL=http://localhost:8080
     ```

5. Start the services:
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm start
```

The app should now be running at:
- Frontend: http://localhost:3000
- Backend: http://localhost:8080

## 📍 Main Pages

### Home (`/`)
- Landing page with service overview
- Quick access to registration/login

### Register (`/register`)
- User registration form
- Email/password validation
- Account creation flow

### Login (`/login`)
- User authentication
- Secure token generation
- Redirect to dashboard

### Dashboard (`/dashboard`)
- Overview of urgent reports
- Quick actions
- System status

### Feed (`/feed`)
- Real-time emergency reports
- Priority-sorted view
- Filter controls

### Triage (`/triage`)
- Manual report submission
- Urgency assessment form
- Response tracking

## 🔌 API Endpoints

### Authentication
- POST `/auth/register`
  - Register new user
  - Body: `{ firstName, lastName, email, password }`
  - Returns: `{ token, fullName, email }`

- POST `/auth/login`
  - Authenticate user
  - Body: `{ email, password }`
  - Returns: `{ token, fullName, email }`

### Triage
- POST `/triage`
  - Analyze text urgency
  - Auth: Required
  - Body: `{ text }`
  - Returns: Analysis with urgency level

- GET `/auto-triage`
  - Get ranked emergency feed
  - Auth: Required
  - Returns: Sorted array of reports

## 🏗 Project Structure

```
SirenEye/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── donation/
│   │   │   └── ...
│   │   ├── pages/
│   │   └── ...
│   └── package.json
│
└── backend/
    ├── config/
    ├── middleware/
    ├── models/
    ├── routes/
    ├── services/
    └── index.js
```

## 🛡 Security

- Password hashing with bcrypt
- JWT for session management
- Protected API routes
- Input validation
- Secure headers
- Rate limiting
- CORS configuration

## 🔄 Workflow

1. User registration/login
2. Access dashboard
3. View auto-triage feed
4. Submit manual reports
5. Monitor responses
6. Make donations (optional)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Made with ❤️ by the SirenEye team