import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Loader2, MoreVertical } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { api } from '../utils/api';

interface MobileLoginPageProps {
  onLogin: (name: string, email: string, accessToken: string) => void;
}

export function MobileLoginPage({ onLogin }: MobileLoginPageProps) {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (isSignup && !name) {
      toast.error('Please enter your name');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    
    try {
      if (isSignup) {
        await api.signup(email, password, name);
        const data = await api.signin(email, password);
        toast.success('Welcome to MoodSync! 🎉');
        onLogin(data.user.name, data.user.email, data.access_token);
      } else {
        const data = await api.signin(email, password);
        toast.success('Welcome back! 🎉');
        onLogin(data.user.name, data.user.email, data.access_token);
      }
    } catch (error) {
      console.error('Auth error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
      
      if (errorMessage.includes('Invalid login credentials')) {
        toast.error('Account not found or wrong password', {
          description: 'Please check your credentials or create a new account',
        });
      } else if (errorMessage.includes('already registered')) {
        toast.error('Email already registered', {
          description: 'Please sign in instead',
        });
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="relative bg-white pt-12 pb-8 px-6">
        {/* Menu Icon */}
        <button className="absolute top-6 right-6 p-2">
          <MoreVertical className="w-6 h-6" style={{ color: '#4F6F61' }} />
        </button>

        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-32 h-32 mb-4 relative">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              {/* Circle */}
              <circle cx="100" cy="100" r="95" fill="none" stroke="#4F6F61" strokeWidth="2"/>
              
              {/* Meditation figure */}
              <g transform="translate(100, 100)">
                {/* Head */}
                <circle cx="0" cy="-20" r="25" fill="none" stroke="#4F6F61" strokeWidth="2"/>
                
                {/* Face features */}
                <line x1="-8" y1="-20" x2="-8" y2="-18" stroke="#4F6F61" strokeWidth="1.5"/>
                <line x1="8" y1="-20" x2="8" y2="-18" stroke="#4F6F61" strokeWidth="1.5"/>
                <path d="M -5,-10 Q 0,-8 5,-10" fill="none" stroke="#4F6F61" strokeWidth="1.5"/>
                
                {/* Hair/Crown */}
                <path d="M -25,-20 Q -20,-45 0,-50 Q 20,-45 25,-20" fill="none" stroke="#4F6F61" strokeWidth="2"/>
                <path d="M -20,-25 Q -15,-35 -10,-30" fill="none" stroke="#4F6F61" strokeWidth="2"/>
                <path d="M 20,-25 Q 15,-35 10,-30" fill="none" stroke="#4F6F61" strokeWidth="2"/>
                
                {/* Body */}
                <ellipse cx="0" cy="20" rx="30" ry="35" fill="none" stroke="#4F6F61" strokeWidth="2"/>
                
                {/* Arms in meditation pose */}
                <path d="M -25,10 Q -35,15 -35,25 Q -35,35 -20,35" fill="none" stroke="#4F6F61" strokeWidth="2"/>
                <path d="M 25,10 Q 35,15 35,25 Q 35,35 20,35" fill="none" stroke="#4F6F61" strokeWidth="2"/>
              </g>
            </svg>
          </div>
          
          <h1 className="text-2xl mb-2" style={{ color: '#4F6F61' }}>
            A&R Mood Sync
          </h1>
          <p className="text-sm tracking-wider" style={{ color: '#4F6F61' }}>
            TRACK ENERGY.CONNECT.RECHARGE
          </p>
        </div>
      </div>

      {/* Wavy Divider */}
      <div className="relative h-12 overflow-hidden">
        <svg className="absolute w-full h-24 -top-6" preserveAspectRatio="none" viewBox="0 0 1440 100">
          <path 
            d="M0,40 C120,60 240,20 360,40 C480,60 600,20 720,40 C840,60 960,20 1080,40 C1200,60 1320,20 1440,40 L1440,100 L0,100 Z" 
            fill="#E8F3F1"
          />
          <path 
            d="M0,45 C120,55 240,35 360,45 C480,55 600,35 720,45 C840,55 960,35 1080,45 C1200,55 1320,35 1440,45 L1440,0 L0,0 Z" 
            fill="white"
            opacity="0.8"
          />
        </svg>
      </div>

      {/* Login Form */}
      <div className="flex-1 px-6 pt-4" style={{ backgroundColor: '#A8C5BD' }}>
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-4xl mb-2" style={{ color: '#2F4F43' }}>
              {isSignup ? 'Sign Up' : 'Login'}
            </h2>
            <p className="text-base" style={{ color: '#4F6F61' }}>
              {isSignup ? 'Create your account' : 'Sign in to continue'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <Input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                className="h-14 rounded-full px-6 border-none text-center placeholder:text-gray-600"
                style={{ backgroundColor: '#C5DDD7' }}
              />
            )}
            
            <Input
              type="email"
              placeholder={isSignup ? "Email" : "Name"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="h-14 rounded-full px-6 border-none text-center placeholder:text-gray-600"
              style={{ backgroundColor: '#C5DDD7' }}
            />

            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="h-14 rounded-full px-6 border-none text-center placeholder:text-gray-600"
              style={{ backgroundColor: '#C5DDD7' }}
            />

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 rounded-full text-white text-lg hover:opacity-90"
              style={{ backgroundColor: '#4F6F61' }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  {isSignup ? 'Creating Account...' : 'Signing In...'}
                </>
              ) : (
                isSignup ? 'Create Account' : 'Log In'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <button
              onClick={() => setIsSignup(!isSignup)}
              className="text-sm underline"
              style={{ color: '#2F4F43' }}
            >
              {isSignup ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm mb-1" style={{ color: '#2F4F43' }}>
              Forgot Password
            </p>
            <p className="text-xs" style={{ color: '#4F6F61' }}>
              www.moodsync.app
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
