import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Loader2, MoreVertical } from 'lucide-react';
import { toast } from '../ui/sonner';
import { api } from '../../utils/api';
import { MobileDemoUsers } from './MobileDemoUsers';

interface MobileLoginScreenProps {
  onLogin: (name: string, email: string, accessToken: string) => void;
}

export function MobileLoginScreen({ onLogin }: MobileLoginScreenProps) {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleDemoUserSelect = async (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setIsSignup(false);
    
    // Auto-login for demo users
    setIsLoading(true);
    try {
      const data = await api.signin(demoEmail, demoPassword);
      toast.success('Welcome to MoodSync! 🎉');
      onLogin(data.user.name, data.user.email, data.access_token);
    } catch (error) {
      console.error('Demo login error:', error);
      toast.error('Demo account not ready yet. Please try again in a moment.', {
        description: 'The server is initializing demo accounts...',
      });
    } finally {
      setIsLoading(false);
    }
  };

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
        try {
          await api.signup(email, password, name);
          // If signup succeeds, sign in
          const data = await api.signin(email, password);
          toast.success('Welcome to MoodSync! 🎉');
          onLogin(data.user.name, data.user.email, data.access_token);
        } catch (signupError) {
          // Check if user already exists
          const errorMessage = signupError instanceof Error ? signupError.message : '';
          
          if (errorMessage === 'USER_EXISTS' || errorMessage.includes('already exists')) {
            // User exists, switch to login mode
            toast.error('This email is already registered', {
              description: 'Please sign in with your existing password',
            });
            setIsSignup(false);
            setPassword(''); // Clear password field
          } else {
            throw signupError;
          }
        }
      } else {
        const data = await api.signin(email, password);
        toast.success('Welcome back! 🎉');
        onLogin(data.user.name, data.user.email, data.access_token);
      }
    } catch (error) {
      console.error('Auth error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
      
      if (errorMessage.includes('Invalid email or password') || errorMessage.includes('401')) {
        if (isSignup) {
          toast.error('Failed to sign up', {
            description: 'Please try again or contact support',
          });
        } else {
          toast.error('Incorrect email or password', {
            description: 'New user? Switch to Sign Up to create an account',
          });
        }
      } else if (errorMessage.includes('USER_EXISTS') || errorMessage.includes('already')) {
        toast.error('Email already registered', {
          description: 'Please sign in instead',
        });
        setIsSignup(false);
        setPassword('');
      } else if (errorMessage.includes('400') || errorMessage.includes('Missing')) {
        toast.error('Please fill in all required fields');
      } else {
        toast.error(errorMessage || 'Authentication failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top Section - White Background */}
      <div className="relative bg-white pt-8 pb-12 px-6">
        {/* Menu Icon */}
        <button className="absolute top-6 right-6 p-2">
          <MoreVertical className="w-6 h-6" style={{ color: '#4A7B78' }} />
        </button>

        {/* Meditation Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-32 h-32 mb-6 relative">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              {/* Outer Circle */}
              <circle cx="100" cy="100" r="95" fill="none" stroke="#4A7B78" strokeWidth="2"/>
              
              {/* Meditation figure */}
              <g transform="translate(100, 100)">
                {/* Head */}
                <circle cx="0" cy="-25" r="22" fill="none" stroke="#4A7B78" strokeWidth="2"/>
                
                {/* Closed eyes */}
                <path d="M -10,-25 Q -7,-22 -4,-25" fill="none" stroke="#4A7B78" strokeWidth="2" strokeLinecap="round"/>
                <path d="M 4,-25 Q 7,-22 10,-25" fill="none" stroke="#4A7B78" strokeWidth="2" strokeLinecap="round"/>
                
                {/* Serene smile */}
                <path d="M -8,-15 Q 0,-12 8,-15" fill="none" stroke="#4A7B78" strokeWidth="1.5" strokeLinecap="round"/>
                
                {/* Hair/Head decoration - circular arcs */}
                <path d="M -22,-30 Q -15,-48 0,-50 Q 15,-48 22,-30" fill="none" stroke="#4A7B78" strokeWidth="2"/>
                <path d="M -18,-32 A 20 20 0 0 1 -8,-40" fill="none" stroke="#4A7B78" strokeWidth="2"/>
                <path d="M 18,-32 A 20 20 0 0 0 8,-40" fill="none" stroke="#4A7B78" strokeWidth="2"/>
                
                {/* Neck */}
                <line x1="0" y1="-3" x2="0" y2="8" stroke="#4A7B78" strokeWidth="2"/>
                
                {/* Body - meditation posture */}
                <ellipse cx="0" cy="25" rx="32" ry="30" fill="none" stroke="#4A7B78" strokeWidth="2"/>
                
                {/* Arms in meditation pose - curved to sides */}
                <path d="M -28,15 Q -38,20 -38,28 Q -38,36 -25,38" fill="none" stroke="#4A7B78" strokeWidth="2" strokeLinecap="round"/>
                <path d="M 28,15 Q 38,20 38,28 Q 38,36 25,38" fill="none" stroke="#4A7B78" strokeWidth="2" strokeLinecap="round"/>
                
                {/* Legs crossed */}
                <path d="M -20,45 Q -10,55 0,52" fill="none" stroke="#4A7B78" strokeWidth="2"/>
                <path d="M 20,45 Q 10,55 0,52" fill="none" stroke="#4A7B78" strokeWidth="2"/>
              </g>
            </svg>
          </div>
          
          {/* App Name */}
          <h1 className="text-2xl mb-3" style={{ color: '#4A7B78' }}>
            A&R Mood Sync
          </h1>
          
          {/* Slogan */}
          <p className="text-sm tracking-wider" style={{ color: '#4A7B78' }}>
            TRACK ENERGY.CONNECT.RECHARGE
          </p>
        </div>
      </div>

      {/* Wavy Divider */}
      <div className="relative h-12 overflow-hidden">
        <svg className="absolute w-full h-24 -top-8" preserveAspectRatio="none" viewBox="0 0 1440 120">
          {/* Main wave - torn paper effect */}
          <path 
            d="M0,50 C40,45 80,55 120,52 C160,49 200,58 240,55 C280,52 320,48 360,51 C400,54 440,50 480,53 C520,56 560,51 600,54 C640,57 680,52 720,55 C760,58 800,53 840,56 C880,59 920,54 960,57 C1000,60 1040,55 1080,58 C1120,61 1160,56 1200,59 C1240,62 1280,57 1320,60 C1360,63 1400,58 1440,61 L1440,120 L0,120 Z" 
            fill="#A8C9C7"
          />
          {/* White overlay for torn effect */}
          <path 
            d="M0,55 C40,52 80,58 120,55 C160,52 200,60 240,57 C280,54 320,52 360,55 C400,58 440,54 480,57 C520,60 560,55 600,58 C640,61 680,56 720,59 C760,62 800,57 840,60 C880,63 920,58 960,61 C1000,64 1040,59 1080,62 C1120,65 1160,60 1200,63 C1240,66 1280,61 1320,64 C1360,67 1400,62 1440,65 L1440,0 L0,0 Z" 
            fill="white"
            opacity="0.6"
          />
        </svg>
      </div>

      {/* Bottom Section - Login Form */}
      <div className="flex-1 px-6 pt-6 pb-12" style={{ backgroundColor: '#A8C9C7' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-md mx-auto"
        >
          {/* Login Heading */}
          <div className="text-center mb-6">
            <h2 className="text-4xl mb-2" style={{ color: '#2F5956' }}>
              {isSignup ? 'Sign Up' : 'Login'}
            </h2>
            <p className="text-base" style={{ color: '#4A7B78' }}>
              {isSignup ? 'Create your account' : 'Sign in to continue'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <Input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                className="h-14 rounded-full px-6 border-none text-center placeholder:text-gray-600"
                style={{ backgroundColor: '#D0E5E3' }}
              />
            )}
            
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="h-14 rounded-full px-6 border-none text-center placeholder:text-gray-600"
              style={{ backgroundColor: '#D0E5E3' }}
            />

            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="h-14 rounded-full px-6 border-none text-center placeholder:text-gray-600"
              style={{ backgroundColor: '#D0E5E3' }}
            />

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 rounded-full text-white text-lg hover:opacity-90"
              style={{ backgroundColor: '#2F5956' }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  {isSignup ? 'Creating Account...' : 'Signing In...'}
                </>
              ) : (
                isSignup ? 'Sign Up' : 'Log In'
              )}
            </Button>
          </form>

          {/* Demo Users - Only show on login */}
          {!isSignup && (
            <MobileDemoUsers onSelectUser={handleDemoUserSelect} />
          )}

          {/* Footer Links */}
          <div className="mt-6 text-center space-y-3">
            <button
              onClick={() => {
                setIsSignup(!isSignup);
                setPassword('');
              }}
              className="text-sm underline block w-full"
              style={{ color: '#2F5956' }}
            >
              {isSignup ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
            </button>
            
            {!isSignup && (
              <div>
                <p className="text-sm" style={{ color: '#2F5956' }}>
                  Forgot Password?
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
