import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { login, signup } from '../services/authService';
import { User, AppView } from '../types';
import { SentinelLogoIcon } from './icons';
import { useToast } from './ToastContext';

interface AuthPageProps {
  onAuthSuccess: (user: User) => void;
  onNavigate: (view: AppView) => void;
  initialMode?: 'login' | 'signup';
}

const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess, onNavigate, initialMode = 'login' }) => {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let user;
      if (isLogin) {
        if (!email || !password) throw new Error('Please enter your email and password.');
        user = await login(email, password);
        addToast(`Welcome back, ${user.username}!`, 'success');
      } else {
        if (!email || !username || !password) throw new Error('Please fill in all fields.');
        if (password.length < 6) throw new Error('Password must be at least 6 characters long.');
        user = await signup(email, username, password);
        addToast(`Account created! Welcome, ${user.username}.`, 'success');
      }
      onAuthSuccess(user);
    } catch (err: any) {
      console.error('Auth error:', err);
      addToast(err.message || 'An error occurred. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };
  
  const formVariants = {
    hidden: { opacity: 0, y: 20, transition: { duration: 0.2 } },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };
  
  const textVariants = {
    hidden: { opacity: 0, y: 10, transition: { duration: 0.3 } },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.1 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-light-secondary dark:bg-dark-secondary animate-fade-in">
        <div className="relative w-full max-w-5xl h-[600px] flex items-center justify-center m-4">
            {/* Left Panel with Animation */}
            <div className="absolute inset-0 md:relative w-full md:w-1/2 h-full flex flex-col justify-center items-center text-center p-8 rounded-l-lg overflow-hidden bg-gradient-to-br from-brand-purple to-brand-cyan">
                <div 
                    className="absolute inset-0 bg-no-repeat bg-[length:200%_200%] animate-aurora"
                    style={{ backgroundImage: `
                        radial-gradient(at 20% 20%, hsla(283, 76%, 40%, 0.3) 0px, transparent 50%),
                        radial-gradient(at 80% 20%, hsla(190, 100%, 50%, 0.3) 0px, transparent 50%),
                        radial-gradient(at 20% 80%, hsla(190, 100%, 30%, 0.4) 0px, transparent 50%),
                        radial-gradient(at 80% 80%, hsla(283, 76%, 30%, 0.4) 0px, transparent 50%)
                    `}}
                ></div>
                <div className="relative z-10 text-white">
                    <SentinelLogoIcon className="w-16 h-16 mx-auto" />
                    <AnimatePresence mode="wait">
                        <motion.div key={isLogin ? 'login-text' : 'signup-text'}>
                             <motion.h1 variants={textVariants} initial="hidden" animate="visible" exit="exit" className="mt-6 text-4xl font-extrabold font-heading">
                                {isLogin ? 'Welcome Back' : 'Join the Fortress'}
                            </motion.h1>
                            <motion.p variants={textVariants} initial="hidden" animate="visible" exit="exit" className="mt-4 text-white/80 max-w-sm mx-auto">
                                {isLogin 
                                    ? "Your code's guardian awaits. Sign in to continue protecting your software."
                                    : "Create an account to deploy the most advanced AI security agent on your codebase."
                                }
                            </motion.p>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
            {/* Right Panel with Form */}
            <div className="relative z-10 w-full md:w-1/2 h-full bg-light-secondary dark:bg-dark-primary p-8 sm:p-12 flex flex-col justify-center rounded-r-lg shadow-2xl">
                 <AnimatePresence mode="wait">
                    <motion.form
                      key={isLogin ? 'login-form' : 'signup-form'}
                      variants={formVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      onSubmit={handleSubmit}
                      className="space-y-5"
                    >
                      <h2 className="text-2xl font-bold font-heading text-dark-text dark:text-white mb-6">
                        {isLogin ? 'Sign In to Your Account' : 'Create a New Account'}
                      </h2>
                      {!isLogin && (
                        <div>
                          <label className="block text-sm font-medium text-medium-dark-text dark:text-medium-text mb-2">Username</label>
                          <input type="text" value={username} onChange={e => setUsername(e.target.value)}
                            className="w-full bg-light-primary dark:bg-dark-secondary border border-gray-300 dark:border-white/10 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple" required />
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-medium text-medium-dark-text dark:text-medium-text mb-2">Email</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                          className="w-full bg-light-primary dark:bg-dark-secondary border border-gray-300 dark:border-white/10 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-medium-dark-text dark:text-medium-text mb-2">Password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                          className="w-full bg-light-primary dark:bg-dark-secondary border border-gray-300 dark:border-white/10 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple" required />
                      </div>
                      <div>
                        <button type="submit" className="w-full btn-primary py-3 mt-2 disabled:opacity-50" disabled={isLoading}>
                          {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                        </button>
                      </div>
                    </motion.form>
                  </AnimatePresence>

                  <p className="mt-6 text-center text-sm text-medium-dark-text dark:text-medium-text">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button onClick={() => setIsLogin(!isLogin)} className="ml-2 font-semibold text-brand-purple hover:text-brand-cyan transition-colors">
                      {isLogin ? 'Sign Up' : 'Sign In'}
                    </button>
                  </p>
                  <p className="mt-8 text-center text-xs text-medium-dark-text dark:text-medium-text">
                      <button onClick={() => onNavigate('landing')} className="hover:underline">
                          &larr; Back to Home
                      </button>
                  </p>
            </div>
        </div>
    </div>
  );
};

export default AuthPage;