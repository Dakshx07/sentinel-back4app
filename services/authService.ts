// src/services/authService.ts
import Parse from '../lib/parse';
import { User } from '../types';

// Export the localStorage key used across the app
export const CURRENT_USER_KEY = 'sentinelUser';

// Convert Parse.User → Your App's User type
const parseToAppUser = (parseUser: Parse.User): User => ({
  username: parseUser.get('username') || '',
  email: parseUser.get('email') || '',
  avatarUrl: parseUser.get('avatarUrl') || `https://ui-avatars.com/api/?name=${encodeURIComponent(parseUser.get('username') || 'User')}&background=random`,
});

// SIGNUP
export const signup = async (email: string, username: string, password: string): Promise<User> => {
  try {
    // Check if Parse is initialized
    if (typeof Parse === 'undefined' || !Parse.User) {
      throw new Error('Authentication service is not available. Please check your configuration.');
    }

    const user = new Parse.User();
    user.set('username', username);
    user.set('email', email);
    user.set('password', password);

    const newUser = await user.signUp();
    const appUser = parseToAppUser(newUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(appUser));
    return appUser;
  } catch (error: any) {
    // Provide more specific error messages
    if (error.code === 202) {
      throw new Error('Username already taken. Please choose another.');
    } else if (error.code === 203) {
      throw new Error('Email already registered. Please sign in instead.');
    } else if (error.code === 125) {
      throw new Error('Invalid email address format.');
    } else if (error.message) {
      throw new Error(error.message);
    } else {
      throw new Error('Signup failed. Please try again.');
    }
  }
};

// LOGIN
export const login = async (email: string, password: string): Promise<User> => {
  try {
    // Check if Parse is initialized
    if (typeof Parse === 'undefined' || !Parse.User) {
      throw new Error('Authentication service is not available. Please check your configuration.');
    }

    const user = await Parse.User.logIn(email, password);
    const appUser = parseToAppUser(user);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(appUser));
    return appUser;
  } catch (error: any) {
    // Provide more specific error messages
    if (error.code === 101) {
      throw new Error('Invalid email or password. Please try again.');
    } else if (error.message) {
      throw new Error(error.message);
    } else {
      throw new Error('Login failed. Please check your credentials and try again.');
    }
  }
};

// LOGOUT
export const logout = async (): Promise<void> => {
  try {
    await Parse.User.logOut();
  } finally {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};

// GET CURRENT USER (on app load)
export const getCurrentUser = (): User | null => {
  const saved = localStorage.getItem(CURRENT_USER_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved user:', e);
      return null;
    }
  }

  try {
    const parseUser = Parse.User.current();
    if (parseUser) {
      const appUser = parseToAppUser(parseUser);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(appUser));
      return appUser;
    }
  } catch (e) {
    console.warn('Parse SDK not initialized or error getting current user:', e);
  }
  return null;
};

// UPDATE USER (sync to localStorage)
export const updateUser = (user: User): void => {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
};