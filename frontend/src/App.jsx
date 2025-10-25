import React, { useState, useEffect, createContext, useContext } from 'react';
import { 
  Sun, Moon, LogIn, LogOut, UserPlus, Send, RefreshCw, 
  Loader2, AlertTriangle, Info, CheckCircle, X, Siren, Skull, Building,
  Activity, Shield, Radio, MapPin, Users, Package, BarChart3, 
  FileText, Settings, Bell, Database
} from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';


// --- Configuration ---
const API_BASE_URL = 'http://localhost:5000';


// --- Contexts ---
const AuthContext = createContext(null);
const ThemeContext = createContext(null);


// --- Helper Functions & Constants ---
const UrgencyColors = {
  CRITICAL: {
    border: 'border-red-500/50',
    bg: 'bg-gradient-to-br from-red-500/20 via-red-500/10 to-transparent',
    text: 'text-red-300',
    glow: 'shadow-red-500/20',
    badge: 'bg-red-500/20 border-red-500/50 text-red-300',
  },
  HIGH: {
    border: 'border-orange-500/50',
    bg: 'bg-gradient-to-br from-orange-500/20 via-orange-500/10 to-transparent',
    text: 'text-orange-300',
    glow: 'shadow-orange-500/20',
    badge: 'bg-orange-500/20 border-orange-500/50 text-orange-300',
  },
  MEDIUM: {
    border: 'border-yellow-500/50',
    bg: 'bg-gradient-to-br from-yellow-500/20 via-yellow-500/10 to-transparent',
    text: 'text-yellow-300',
    glow: 'shadow-yellow-500/20',
    badge: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300',
  },
  LOW: {
    border: 'border-blue-500/50',
    bg: 'bg-gradient-to-br from-blue-500/20 via-blue-500/10 to-transparent',
    text: 'text-blue-300',
    glow: 'shadow-blue-500/20',
    badge: 'bg-blue-500/20 border-blue-500/50 text-blue-300',
  },
  IGNORE: {
    border: 'border-gray-600/50',
    bg: 'bg-gradient-to-br from-gray-600/10 via-gray-600/5 to-transparent',
    text: 'text-gray-500',
    glow: 'shadow-gray-500/10',
    badge: 'bg-gray-600/20 border-gray-600/50 text-gray-400',
  },
};


const getUrgencyIcon = (urgency) => {
  switch (urgency) {
    case 'CRITICAL':
      return <Skull className="w-5 h-5 text-red-400 animate-pulse" />;
    case 'HIGH':
      return <Siren className="w-5 h-5 text-orange-400" />;
    case 'MEDIUM':
      return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
    case 'LOW':
      return <Info className="w-5 h-5 text-blue-400" />;
    default:
      return <CheckCircle className="w-5 h-5 text-gray-500" />;
  }
};


// --- API Service ---
const api = {
  login: async (email, password) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error(await res.json().then(d => d.message));
    return res.json();
  },

  register: async (firstname, lastname, email, password) => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstname, lastname, email, password }),
    });
    if (!res.ok) throw new Error(await res.json().then(d => d.message));
    return res.json();
  },

  postTriage: async (text, token) => {
    const res = await fetch(`${API_BASE_URL}/triage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) throw new Error(await res.json().then(d => d.message));
    return res.json();
  },

  getAutoFeed: async (token) => {
    const res = await fetch(`${API_BASE_URL}/auto-triage`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(await res.json().then(d => d.message));
    return res.json();
  },
};


// --- Main App Component ---
export default function App() {
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [auth, setAuth] = useState({ token: null, user: null });
  const [page, setPage] = useState('login');
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    try {
      const token = localStorage.getItem('aidr_token');
      const userItem = localStorage.getItem('aidr_user');
      
      let user = null;
      if (userItem && userItem !== "undefined") { 
        user = JSON.parse(userItem);
      }

      if (token && user) {
        setAuth({ token, user });
        setPage('dashboard');
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('aidr_token');
      localStorage.removeItem('aidr_user');
    }
    
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(localStorage.getItem('theme') === 'dark' || (localStorage.getItem('theme') === null && prefersDark));
    setIsAuthReady(true);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleLogin = async (email, password) => {
    await toast.promise(
      api.login(email, password),
      {
        loading: 'Logging in...',
        success: (data) => {
          setAuth({ token: data.token, user: data.user });
          localStorage.setItem('aidr_token', data.token);
          localStorage.setItem('aidr_user', JSON.stringify(data.user));
          setPage('dashboard');
          return 'Logged in successfully!';
        },
        error: (err) => err.toString(),
      }
    );
  };

  const handleRegister = async (firstname, lastname, email, password) => {
    await toast.promise(
      api.register(firstname, lastname, email, password),
      {
        loading: 'Registering account...',
        success: (data) => {
          setPage('login');
          return data.message;
        },
        error: (err) => err.toString(),
      }
    );
  };

  const handleLogout = () => {
    setAuth({ token: null, user: null });
    localStorage.removeItem('aidr_token');
    localStorage.removeItem('aidr_user');
    setPage('login');
    toast.success('Logged out');
  };

  const toggleTheme = () => setDarkMode(!darkMode);

  if (!isAuthReady) {
    return <FullScreenLoader />;
  }

  return (
    <AuthContext.Provider value={{ ...auth, logout: handleLogout }}>
      <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
        <div className="min-h-screen text-gray-900 dark:text-gray-100 transition-all duration-500">
          
          {/* Animated Background */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 dark:opacity-10 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 dark:opacity-10 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 dark:bg-pink-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 dark:opacity-10 animate-blob animation-delay-4000"></div>
          </div>

          {!auth.token ? (
            page === 'login' ? (
              <LoginPage onLogin={handleLogin} setPage={setPage} />
            ) : (
              <RegisterPage onRegister={handleRegister} setPage={setPage} />
            )
          ) : (
            <DashboardPage />
          )}

          <Toaster
            position="bottom-right"
            toastOptions={{
              className: 'dark:bg-gray-800/90 dark:text-white backdrop-blur-lg',
              style: {
                border: '1px solid rgba(59, 130, 246, 0.3)',
                background: 'rgba(17, 24, 39, 0.8)',
                backdropFilter: 'blur(12px)',
              },
            }}
          />

          <style>{`
            @keyframes blob {
              0% { transform: translate(0px, 0px) scale(1); }
              33% { transform: translate(30px, -50px) scale(1.1); }
              66% { transform: translate(-20px, 20px) scale(0.9); }
              100% { transform: translate(0px, 0px) scale(1); }
            }
            .animate-blob {
              animation: blob 7s infinite;
            }
            .animation-delay-2000 {
              animation-delay: 2s;
            }
            .animation-delay-4000 {
              animation-delay: 4s;
            }
            .scrollbar-thin::-webkit-scrollbar {
              width: 6px;
              height: 6px;
            }
            .scrollbar-thin::-webkit-scrollbar-track {
              background: transparent;
            }
            .scrollbar-thin::-webkit-scrollbar-thumb {
              background: rgba(156, 163, 175, 0.3);
              border-radius: 3px;
            }
            .scrollbar-thin::-webkit-scrollbar-thumb:hover {
              background: rgba(156, 163, 175, 0.5);
            }
            .dark .scrollbar-thin::-webkit-scrollbar-thumb {
              background: rgba(75, 85, 99, 0.5);
            }
            .dark .scrollbar-thin::-webkit-scrollbar-thumb:hover {
              background: rgba(75, 85, 99, 0.7);
            }
          `}</style>
        </div>
      </ThemeContext.Provider>
    </AuthContext.Provider>
  );
}


// --- Loading Component ---
function FullScreenLoader() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-purple-950">
      <div className="flex items-center space-x-3 mb-8">
        <div className="relative">
          <Siren className="w-16 h-16 text-blue-500 animate-pulse" />
          <div className="absolute inset-0 w-16 h-16 bg-blue-500 rounded-full blur-2xl opacity-50 animate-ping"></div>
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          A.I.D.R.
        </h1>
      </div>
      <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
      <p className="mt-4 text-gray-400 text-sm">Initializing Emergency Response System...</p>
    </div>
  );
}


// --- Auth Page Components ---
function LoginPage({ onLogin, setPage }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onLogin(email, password);
    } catch (e) {}
    setIsLoading(false);
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md">
        <div className="relative backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8 space-y-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 pointer-events-none"></div>
          
          <div className="relative flex flex-col items-center">
            <div className="relative mb-4">
              <Siren className="w-14 h-14 text-blue-500" />
              <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-2">
              A.I.D.R.
            </h1>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Welcome Back</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Emergency Response Dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="relative space-y-5">
            <Input 
              id="email" 
              type="email" 
              label="Email" 
              value={email} 
              onChange={setEmail} 
              disabled={isLoading}
            />
            <Input 
              id="password" 
              type="password" 
              label="Password" 
              value={password} 
              onChange={setPassword} 
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading} fullWidth>
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Log In'}
              <LogIn className="w-5 h-5 ml-2" />
            </Button>
          </form>

          <div className="relative text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <button
                onClick={() => setPage('register')}
                className="font-semibold text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


function RegisterPage({ onRegister, setPage }) {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onRegister(firstname, lastname, email, password);
    } catch (e) {}
    setIsLoading(false);
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md">
        <div className="relative backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8 space-y-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 pointer-events-none"></div>
          
          <div className="relative flex flex-col items-center">
            <div className="relative mb-4">
              <Siren className="w-14 h-14 text-blue-500" />
              <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-2">
              A.I.D.R.
            </h1>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Create Account</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Join the Response Team</p>
          </div>
          
          <form onSubmit={handleSubmit} className="relative space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <Input id="firstname" type="text" label="First Name" value={firstname} onChange={setFirstname} disabled={isLoading} />
              <Input id="lastname" type="text" label="Last Name" value={lastname} onChange={setLastname} disabled={isLoading} />
            </div>
            <Input id="email" type="email" label="Email" value={email} onChange={setEmail} disabled={isLoading} />
            <Input id="password" type="password" label="Password" value={password} onChange={setPassword} disabled={isLoading} />
            <Button type="submit" disabled={isLoading} fullWidth>
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
              <UserPlus className="w-5 h-5 ml-2" />
            </Button>
          </form>

          <div className="relative text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <button
                onClick={() => setPage('login')}
                className="font-semibold text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Log in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


// --- Reusable Form Components ---
function Input({ id, label, type, value, onChange, disabled }) {
  return (
    <div className="w-full">
      <label htmlFor={id} className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 placeholder:text-gray-400"
      />
    </div>
  );
}


function Button({ children, type = 'button', onClick, disabled, fullWidth, variant = 'primary' }) {
  const baseStyle = "flex items-center justify-center px-6 py-3 font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95";
  
  const variants = {
    primary: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/30 focus:ring-blue-500',
    secondary: 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-800 dark:text-gray-100 hover:bg-white dark:hover:bg-gray-700 border-2 border-gray-200 dark:border-gray-700 focus:ring-gray-400',
    ghost: 'bg-transparent hover:bg-gray-100/50 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-300 border border-gray-300/50 dark:border-gray-600/50',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${fullWidth ? 'w-full' : ''}`}
    >
      {children}
    </button>
  );
}


// --- Main Dashboard Page with Tabs ---
function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'manual', label: 'Manual Triage', icon: <FileText className="w-4 h-4" /> },
    { id: 'live-feed', label: 'Live Feed', icon: <Radio className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <Activity className="w-4 h-4" /> },
  ];

  return (
    <MainLayout>
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        
        {/* Tab Navigation */}
        <div className="relative backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 p-2 mb-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none"></div>
          
          <div className="relative flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 transform scale-105'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-800/50 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="relative">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'manual' && <ManualTriageTab />}
          {activeTab === 'live-feed' && <LiveFeedTab />}
          {activeTab === 'analytics' && <AnalyticsTab />}
        </div>
      </div>
    </MainLayout>
  );
}


// --- Tab Components ---
function OverviewTab() {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Activity />} label="Active Incidents" value="23" color="blue" />
        <StatCard icon={<Shield />} label="Response Teams" value="12" color="green" />
        <StatCard icon={<Radio />} label="Live Feeds" value="8" color="purple" />
        <StatCard icon={<AlertTriangle />} label="Critical Alerts" value="3" color="red" />
      </div>

      {/* Recent Activity */}
      <div className="relative backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 p-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none"></div>
        
        <div className="relative">
          <div className="flex items-center space-x-2 mb-4">
            <Bell className="w-5 h-5 text-blue-500" />
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Recent Activity</h2>
          </div>
          
          <div className="space-y-3">
            <ActivityItem 
              time="2 min ago" 
              message="Critical incident reported in Downtown Area" 
              urgency="CRITICAL"
            />
            <ActivityItem 
              time="15 min ago" 
              message="Response team dispatched to Sector 7" 
              urgency="HIGH"
            />
            <ActivityItem 
              time="1 hour ago" 
              message="Medical supplies delivered to Zone B" 
              urgency="MEDIUM"
            />
            <ActivityItem 
              time="2 hours ago" 
              message="Routine check completed in all sectors" 
              urgency="LOW"
            />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <QuickActionCard 
          icon={<Send />} 
          title="Submit Report" 
          description="Manually triage a new incident"
        />
        <QuickActionCard 
          icon={<Database />} 
          title="View Database" 
          description="Access historical incident data"
        />
        <QuickActionCard 
          icon={<Settings />} 
          title="System Settings" 
          description="Configure alert thresholds"
        />
      </div>
    </div>
  );
}


function ManualTriageTab() {
  const [manualResult, setManualResult] = useState(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fadeIn">
      <ManualTriage onResult={setManualResult} />
      <ManualResult result={manualResult} />
    </div>
  );
}


function LiveFeedTab() {
  return (
    <div className="animate-fadeIn">
      <AutoTriageFeed />
    </div>
  );
}


function AnalyticsTab() {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AnalyticsCard 
          title="Response Time" 
          value="4.2 min" 
          change="-12%" 
          trend="down"
          color="green"
        />
        <AnalyticsCard 
          title="Incidents Today" 
          value="47" 
          change="+8%" 
          trend="up"
          color="blue"
        />
        <AnalyticsCard 
          title="Resolution Rate" 
          value="94%" 
          change="+3%" 
          trend="up"
          color="purple"
        />
      </div>

      {/* Placeholder for Charts */}
      <div className="relative backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 p-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none"></div>
        
        <div className="relative">
          <div className="flex items-center space-x-2 mb-4">
            <BarChart3 className="w-5 h-5 text-blue-500" />
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Incident Trends</h2>
          </div>
          
          <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <p>Analytics charts will be displayed here</p>
              <p className="text-sm mt-2">Connect to data source to view trends</p>
            </div>
          </div>
        </div>
      </div>

      {/* Incident Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 p-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none"></div>
          
          <div className="relative">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Incidents by Category</h3>
            <div className="space-y-3">
              <CategoryBar label="Medical" value={35} color="red" />
              <CategoryBar label="Fire" value={28} color="orange" />
              <CategoryBar label="Traffic" value={20} color="yellow" />
              <CategoryBar label="Security" value={17} color="blue" />
            </div>
          </div>
        </div>

        <div className="relative backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 p-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none"></div>
          
          <div className="relative">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Response Efficiency</h3>
            <div className="space-y-3">
              <CategoryBar label="Critical" value={98} color="red" />
              <CategoryBar label="High" value={92} color="orange" />
              <CategoryBar label="Medium" value={87} color="yellow" />
              <CategoryBar label="Low" value={94} color="blue" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


// --- Supporting Components ---
function StatCard({ icon, label, value, color }) {
  const colors = {
    blue: 'from-blue-500/20 to-blue-600/20 border-blue-500/30 text-blue-400',
    green: 'from-green-500/20 to-green-600/20 border-green-500/30 text-green-400',
    purple: 'from-purple-500/20 to-purple-600/20 border-purple-500/30 text-purple-400',
    red: 'from-red-500/20 to-red-600/20 border-red-500/30 text-red-400',
  };

  return (
    <div className={`relative backdrop-blur-xl bg-gradient-to-br ${colors[color]} border rounded-2xl p-6 overflow-hidden group hover:scale-105 transition-transform duration-200`}>
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-300 mb-1">{label}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
        </div>
        <div className="text-white/80 group-hover:scale-110 transition-transform">
          {React.cloneElement(icon, { className: 'w-8 h-8' })}
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </div>
  );
}


function ActivityItem({ time, message, urgency }) {
  const urgencyStyle = UrgencyColors[urgency] || UrgencyColors.IGNORE;
  
  return (
    <div className="flex items-start space-x-3 p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-l-4 border-gray-200 dark:border-gray-700 hover:border-blue-500 transition-all duration-200">
      <div className="mt-1">{getUrgencyIcon(urgency)}</div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{message}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{time}</p>
      </div>
    </div>
  );
}


function QuickActionCard({ icon, title, description }) {
  return (
    <div className="relative backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 p-6 overflow-hidden group hover:scale-105 transition-all duration-200 cursor-pointer">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
      
      <div className="relative">
        <div className="text-blue-500 mb-3 group-hover:scale-110 transition-transform">
          {React.cloneElement(icon, { className: 'w-8 h-8' })}
        </div>
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
      </div>
    </div>
  );
}


function AnalyticsCard({ title, value, change, trend, color }) {
  const colors = {
    blue: 'text-blue-500',
    green: 'text-green-500',
    purple: 'text-purple-500',
    red: 'text-red-500',
  };

  const trendColor = trend === 'up' ? 'text-green-500' : 'text-red-500';

  return (
    <div className="relative backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 p-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none"></div>
      
      <div className="relative">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{title}</p>
        <p className={`text-3xl font-bold ${colors[color]} mb-2`}>{value}</p>
        <p className={`text-sm font-semibold ${trendColor}`}>{change} from last week</p>
      </div>
    </div>
  );
}


function CategoryBar({ label, value, color }) {
  const colors = {
    red: 'bg-red-500',
    orange: 'bg-orange-500',
    yellow: 'bg-yellow-500',
    blue: 'bg-blue-500',
  };

  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
        <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{value}%</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
        <div 
          className={`${colors[color]} h-2.5 rounded-full transition-all duration-500`}
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );
}


// --- Dashboard Layout ---
function MainLayout({ children }) {
  return (
    <div className="min-h-screen relative">
      <Header />
      <main className="relative z-10">{children}</main>
    </div>
  );
}


function Header() {
  const { user } = useContext(AuthContext);
  
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/60 dark:bg-gray-900/60 border-b border-gray-200/50 dark:border-gray-700/50 shadow-lg">
      <nav className="container mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Siren className="w-9 h-9 text-blue-500" />
            <div className="absolute inset-0 bg-blue-500 blur-lg opacity-50 animate-pulse"></div>
          </div>
          <div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              A.I.D.R.
            </span>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Emergency Response</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="hidden md:flex items-center space-x-2 px-4 py-2 rounded-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">
              {user?.firstname || 'Operator'}
            </span>
          </div>
          <ThemeToggle />
          <LogoutButton />
        </div>
      </nav>
    </header>
  );
}


function ThemeToggle() {
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  return (
    <button
      onClick={toggleTheme}
      className="p-3 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105"
      aria-label="Toggle theme"
    >
      {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}


function LogoutButton() {
  const { logout } = useContext(AuthContext);
  return (
    <Button onClick={logout} variant="secondary">
      <LogOut className="w-5 h-5 md:mr-2" />
      <span className="hidden md:block">Logout</span>
    </Button>
  );
}


// --- Dashboard Component: Manual Triage ---
function ManualTriage({ onResult }) {
  const { token } = useContext(AuthContext);
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      toast.error('Please enter a report to analyze.');
      return;
    }
    setIsLoading(true);
    onResult(null);
    
    await toast.promise(
      api.postTriage(text, token),
      {
        loading: 'Analyzing report...',
        success: (data) => {
          onResult(data);
          setText('');
          return 'Analysis complete!';
        },
        error: (err) => err.toString(),
      }
    );
    setIsLoading(false);
  };

  return (
    <div className="relative backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 p-6 overflow-hidden group h-full">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none"></div>
      
      <div className="relative h-full flex flex-col">
        <div className="flex items-center space-x-2 mb-4">
          <Send className="w-5 h-5 text-blue-500" />
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Manual Triage</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isLoading}
            rows="10"
            className="flex-1 w-full p-4 border-2 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 placeholder:text-gray-400 resize-none"
            placeholder="Paste unstructured incident report here...

Examples:
• Emergency call transcripts
• Social media reports
• News updates
• Citizen alerts"
          ></textarea>
          <Button type="submit" disabled={isLoading} fullWidth>
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Analyzing...
              </>
            ) : (
              <>
                Analyze Report
                <Send className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}


// --- Dashboard Component: Manual Result ---
function ManualResult({ result }) {
  if (!result) {
    return (
      <div className="relative backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 p-6 flex items-center justify-center h-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none"></div>
        <div className="relative text-center">
          <div className="relative inline-block mb-4">
            <Building className="w-20 h-20 text-gray-300 dark:text-gray-600" />
            <div className="absolute inset-0 bg-gray-400 dark:bg-gray-600 blur-2xl opacity-20"></div>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Awaiting Analysis</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Submit a report to view triage results</p>
        </div>
      </div>
    );
  }

  const { urgency_level, incident_category, location_extracted, people_affected, resources_needed, summary } = result;
  const urgencyStyle = UrgencyColors[urgency_level] || UrgencyColors.IGNORE;

  return (
    <div className={`relative backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 rounded-2xl shadow-2xl border-l-4 overflow-hidden transform hover:scale-[1.02] transition-all duration-300 h-full ${urgencyStyle.border} ${urgencyStyle.glow} shadow-xl`}>
      <div className={`absolute inset-0 ${urgencyStyle.bg} pointer-events-none`}></div>
      
      <div className="relative p-6">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center space-x-2">
            {getUrgencyIcon(urgency_level)}
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Triage Result</h2>
          </div>
          <span className={`px-4 py-2 text-sm font-bold rounded-full border-2 ${urgencyStyle.badge} backdrop-blur-sm shadow-lg`}>
            {urgency_level}
          </span>
        </div>

        <div className="space-y-4">
          <DetailRow icon={<AlertTriangle className="w-5 h-5" />} label="Incident Type" value={incident_category} />
          <DetailRow icon={<MapPin className="w-5 h-5" />} label="Location" value={location_extracted} />
          <DetailRow icon={<Users className="w-5 h-5" />} label="People Affected" value={people_affected} />
          <DetailRow icon={<Package className="w-5 h-5" />} label="Resources Needed" value={resources_needed} />
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Summary</p>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{summary || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}


function DetailRow({ icon, label, value }) {
  return (
    <div className="flex items-start space-x-3 p-3 rounded-lg bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm">
      <div className="text-gray-500 dark:text-gray-400 mt-0.5">{icon}</div>
      <div className="flex-1">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">{label}</p>
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{value || 'N/A'}</p>
      </div>
    </div>
  );
}


// --- Dashboard Component: Auto-Triage Feed ---
function AutoTriageFeed() {
  const { token } = useContext(AuthContext);
  const [feed, setFeed] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFeed = async () => {
    setIsLoading(true);
    await toast.promise(
      api.getAutoFeed(token),
      {
        loading: 'Refreshing live feed...',
        success: (data) => {
          setFeed(data);
          return 'Feed updated!';
        },
        error: (err) => err.toString(),
      }
    );
    setIsLoading(false);
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  return (
    <div className="relative backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 p-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none"></div>
      
      <div className="relative">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <Radio className="w-5 h-5 text-blue-500" />
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Live Triage Feed</h2>
            {!isLoading && (
              <span className="px-3 py-1 text-xs font-semibold bg-green-500/20 text-green-600 dark:text-green-400 rounded-full border border-green-500/30">
                {feed.length} Active
              </span>
            )}
          </div>
          <Button onClick={fetchFeed} disabled={isLoading} variant="ghost">
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <RefreshCw className="w-5 h-5" />
            )}
            <span className="ml-2 hidden sm:inline">Refresh</span>
          </Button>
        </div>

        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin">
          {isLoading && feed.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-64 space-y-4">
              <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
              <p className="text-sm text-gray-500">Loading incident feed...</p>
            </div>
          ) : feed.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-64 text-gray-500">
              <Radio className="w-16 h-16 mb-4 text-gray-300 dark:text-gray-600" />
              <p className="text-sm">No incidents in feed</p>
            </div>
          ) : (
            feed.map((item, index) => <IncidentCard key={index} item={item} index={index} />)
          )}
        </div>
      </div>
    </div>
  );
}


function IncidentCard({ item, index }) {
  const { text, urgency_level, summary } = item;
  const urgencyStyle = UrgencyColors[urgency_level] || UrgencyColors.IGNORE;
  const source = text.startsWith('News:') ? 'NEWS' : 'SOCIAL';
  
  return (
    <div 
      className={`relative backdrop-blur-sm bg-white/60 dark:bg-gray-800/60 rounded-xl border-l-4 p-4 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${urgencyStyle.border} ${urgencyStyle.glow}`}
      style={{ 
        animation: 'fadeIn 0.5s ease-in',
        animationDelay: `${index * 50}ms`,
        animationFillMode: 'backwards'
      }}
    >
      <div className={`absolute inset-0 ${urgencyStyle.bg} rounded-xl pointer-events-none`}></div>
      
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {getUrgencyIcon(urgency_level)}
            <span className={`text-xs font-bold uppercase tracking-wide ${urgencyStyle.text}`}>
              {urgency_level}
            </span>
          </div>
          <span className="px-2 py-1 text-xs font-semibold bg-gray-500/20 text-gray-600 dark:text-gray-400 rounded-md border border-gray-500/30">
            {source}
          </span>
        </div>
        
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 line-clamp-2" title={text}>
          {text}
        </p>
        
        <p className="text-sm text-gray-700 dark:text-gray-200 font-medium">
          {summary}
        </p>
      </div>
    </div>
  );
}
