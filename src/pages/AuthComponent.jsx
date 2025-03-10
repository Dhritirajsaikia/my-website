import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider 
} from 'firebase/auth';
import { auth, db } from '../../firebaseConfig'; 
import { doc, setDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { Palette, Eye, EyeOff } from 'lucide-react';
import { FaGoogle } from "react-icons/fa";
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const AuthComponent = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const googleProvider = new GoogleAuthProvider();

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    setError('');

    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      let userCredential;
      if (isLogin) {
        // Login
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } else {
        // Sign Up
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      }
      const user = userCredential.user;
      // Generate a unique session token
      const sessionToken = uuidv4();
      // Save the session token in Firestore under the user's document
      await setDoc(doc(db, "users", user.uid), { activeSessionToken: sessionToken }, { merge: true });
      // Save the token locally
      localStorage.setItem("sessionToken", sessionToken);
      navigate('/');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;
      // Generate a unique session token
      const sessionToken = uuidv4();
      // Save the session token in Firestore under the user's document
      await setDoc(doc(db, "users", user.uid), { activeSessionToken: sessionToken }, { merge: true });
      // Save the token locally
      localStorage.setItem("sessionToken", sessionToken);
      navigate('/');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setError('Password reset email sent!');
      setIsForgotPassword(false);
    } catch (error) {
      setError(error.message);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <>
      <Navbar/>
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden my-30"
        >
          <div className="p-8">
            <div className="flex items-center justify-center mb-6">
              <Palette className="w-12 h-12 text-amber-600 mr-3" />
              <h1 className="text-3xl font-bold text-orange-800">
                {isForgotPassword 
                  ? 'Reset Password' 
                  : (isLogin ? 'Welcome Back' : 'Create Account')
                }
              </h1>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={isForgotPassword ? handleForgotPassword : handleEmailSignUp}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {!isForgotPassword && (
                <>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                      <button 
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {!isLogin && (
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          id="confirmPassword"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                        <button 
                          type="button"
                          onClick={toggleConfirmPasswordVisibility}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

              <div className="flex items-center justify-between mt-6">
                <button
                  type="submit"
                  className="w-full bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-500 transition duration-300 cursor-pointer"
                >
                  {isForgotPassword 
                    ? 'Reset Password' 
                    : (isLogin ? 'Log In' : 'Sign Up')
                  }
                </button>
              </div>
            </form>

            {!isForgotPassword && (
              <div className="mt-4 text-center">
                <button
                  onClick={handleGoogleSignIn}
                  className="w-full flex items-center justify-center bg-white border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition duration-300"
                >
                  <FaGoogle className="w-5 h-5 mr-2 text-orange-600" />
                  Continue with Google
                </button>
              </div>
            )}

            <div className="mt-6 text-center">
              {!isForgotPassword ? (
                <>
                  {isLogin ? (
                    <p>
                      Don't have an account?{' '}
                      <button 
                        onClick={() => setIsLogin(false)}
                        className="text-blue-600 hover:underline"
                      >
                        Sign Up
                      </button>
                    </p>
                  ) : (
                    <p>
                      Already have an account?{' '}
                      <button 
                        onClick={() => setIsLogin(true)}
                        className="text-blue-600 hover:underline cursor-pointer"
                      >
                        Log In
                      </button>
                    </p>
                  )}
                  <button 
                    onClick={() => setIsForgotPassword(true)}
                    className="text-sm text-gray-600 hover:underline mt-2 cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => {
                    setIsForgotPassword(false);
                    setError('');
                  }}
                  className="text-blue-600 hover:underline"
                >
                  Back to Login
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
      <Footer/>
    </>
  );
};

export default AuthComponent; 