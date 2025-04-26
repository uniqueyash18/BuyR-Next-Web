"use client";

import { styles } from '@/components/auth/styles';
import GradientButton from '@/components/GradientButton';
import TextContainer from '@/components/TextContainer';
import usePostData from '@/hooks/usePostData';
import { showError, showSuccess } from '@/utils/helperFunctions';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isEmailAdded, setIsEmailAdded] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    otp: '',
    password: '',
    confirmPassword: ''
  });

  const { mutate: sendOtp } = usePostData<{ message?: string }>('/auth/send-otp', {
    onSuccess: (data) => {
      setIsLoading(false);
      setIsEmailAdded(true);
      showSuccess(data?.message || 'OTP sent successfully');
    },
    onError: (error) => {
      setIsLoading(false);
      showError(error.message || 'Failed to send OTP');
    },
  });

  const { mutate: verifyOtp } = usePostData('/auth/verify-otp', {
    onSuccess: () => {
      setIsLoading(false);
      showSuccess('Password reset successful');
      router.push('/login');
    },
    onError: (error) => {
      setIsLoading(false);
      showError(error.message || 'Failed to verify OTP');
    },
  });

  const validateEmail = () => {
    const newErrors = { ...errors, email: '' };
    let isValid = true;

    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const validateOtpAndPassword = () => {
    const newErrors = { ...errors, otp: '', password: '', confirmPassword: '' };
    let isValid = true;

    if (!otpInput) {
      newErrors.otp = 'OTP is required';
      isValid = false;
    } else if (otpInput.length !== 4) {
      newErrors.otp = 'OTP must be 4 digits';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSendOtp = () => {
    if (!validateEmail()) {
      return;
    }

    setIsLoading(true);
    sendOtp({ email });
  };

  const handleVerifyOtp = () => {
    if (!validateOtpAndPassword()) {
      return;
    }

    setIsLoading(true);
    verifyOtp({ 
      otp: otpInput, 
      email, 
      password 
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <div>
          <TextContainer text="Forgot Password" style={styles.logintxt} />
          <TextContainer text="Enter your email to reset password" style={styles.welcomeBack} />
        </div>

        {!isEmailAdded ? (
          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1 relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="pl-10 mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
            
            <GradientButton
              onPress={handleSendOtp}
              btnText="Next"
              indicator={isLoading}
            />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-gray-600">
                A code has been sent to <span className="font-medium">{email}</span>
              </p>
              <div className="mt-2">
                <span className="text-gray-600">Didn't receive the code? </span>
                <button
                  onClick={handleSendOtp}
                  className="text-indigo-600 font-medium"
                >
                  Resend Code
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                Verification Code
              </label>
              <input
                id="otp"
                type="text"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                placeholder="Enter 4-digit code"
                maxLength={4}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.otp && (
                <p className="mt-1 text-sm text-red-600">{errors.otp}</p>
              )}
            </div>

            {otpInput.length === 4 && (
              <>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Image 
                        src="/images/lock-icon.png" 
                        alt="Lock icon" 
                        width={20} 
                        height={20} 
                        className="text-gray-400"
                      />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2 text-gray-500"
                    >
                      <Image 
                        src={showPassword ? "/images/see-eye.png" : "/images/hide-eye.png"} 
                        alt={showPassword ? "Hide password" : "Show password"} 
                        width={20} 
                        height={20} 
                      />
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Image 
                        src="/images/lock-icon.png" 
                        alt="Lock icon" 
                        width={20} 
                        height={20} 
                        className="text-gray-400"
                      />
                    </div>
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-2 text-gray-500"
                    >
                      <Image 
                        src={showConfirmPassword ? "/images/see-eye.png" : "/images/hide-eye.png"} 
                        alt={showConfirmPassword ? "Hide password" : "Show password"} 
                        width={20} 
                        height={20} 
                      />
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>
              </>
            )}

            <GradientButton
              onPress={handleVerifyOtp}
              btnText="Verify"
              indicator={isLoading}
            />
          </div>
        )}

        <div className="text-center">
          <span className="text-gray-600">Remember your password? </span>
          <button
            onClick={() => router.push('/login')}
            className="text-indigo-600 font-medium"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
} 