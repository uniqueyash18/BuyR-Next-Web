"use client";

import usePostData from '@/hooks/usePostData';
import { showError, showSuccess } from '@/utils/helperFunctions';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import GradientButton from '../GradientButton';
import PhoneNumberInput from '../PhoneNumberInput';
import TextContainer from '../TextContainer';
import { styles } from './styles';
import { useAuth } from '@/hooks/useAuth';
import requestNotificationPermission from '@/utils/firebase';

const Signup = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [referenceId, setReferenceId] = useState('');
  const [errors, setErrors] = useState({
    phoneNumber: '',
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
    referenceId: ''
  });

  const { mutate: signup, isLoading } = usePostData<{ user: any; token: string }>('/auth/signUp', {
    onSuccess: (data) => {
      login({ ...data.user, token: data.token });
      showSuccess('Signup successful');
      router.push('/home');
    },
    onError: (error: any) => {
      showError(error?.response?.data?.message || error.message || 'Signup failed');
    },
  });

  const validateForm = () => {
    const newErrors = {
      phoneNumber: '',
      email: '',
      name: '',
      password: '',
      confirmPassword: '',
      referenceId: ''
    };
    let isValid = true;

    if (!name) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
      isValid = false;
    } else if (phoneNumber.length < 10) {
      newErrors.phoneNumber = 'Phone number must be at least 10 digits';
      isValid = false;
    }

    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
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
    if (!referenceId) {
      newErrors.referenceId = 'Reference ID is required';
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleSignup = () => {
    if (!validateForm()) {
      return;
    }
    requestNotificationPermission().then((token) => {
      signup({
        name,
        phoneNumber,
        email,
        password,
        currentAdminReference: referenceId,
        fcmToken: token,
      });
    }).catch((error) => {
      signup({
        name,
        phoneNumber,
        email,
        password,
        currentAdminReference: referenceId,
      });
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white py-12 px-2 sm:px-2 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white/90 p-8 rounded-2xl shadow-2xl border border-orange-100">
        <div className="flex flex-col items-center mb-4">
          <Image src="/images/logo.png" alt="BuyR Logo" width={90} height={90} className="mb-2 rounded-lg" priority />
          <TextContainer text="Create Account" style={styles.logintxt} />
          <TextContainer text="Sign up to get started" style={styles.welcomeBack} />
        </div>

        <div className="space-y-4">
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 text-black placeholder:text-gray-500"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <PhoneNumberInput
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              maxLength={10}
              placeholder="Enter phone number"
            />
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
            )}
          </div>

          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 text-black placeholder:text-gray-500"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-3 py-2 border pr-18 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 text-black placeholder:text-gray-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2 text-gray-500"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              className="w-full px-3 py-2 border pr-18 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 text-black placeholder:text-gray-500"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-2 text-gray-500"
            >
              {showConfirmPassword ? 'Hide' : 'Show'}
            </button>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
            )}
          </div>

          <div>
            <input
              type="text"
              value={referenceId}
              onChange={(e) => setReferenceId(e.target.value)}
              placeholder="Reference ID *"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 text-black placeholder:text-gray-500"
            />
            {errors.referenceId && (
              <p className="mt-1 text-sm text-red-600">{errors.referenceId}</p>
            )}
          </div>
        </div>

        <GradientButton
          onPress={handleSignup}
          btnText="Sign Up"
          indicator={isLoading}
        />

        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gray-200" />
          <span className="mx-4 text-gray-400">OR</span>
          <div className="flex-grow h-px bg-gray-200" />
        </div>

        <div className="text-center">
          <span className="text-gray-600">Already have an account? </span>
          <button
            onClick={() => router.push('/auth/login')}
            className="text-orange-600 font-semibold hover:underline"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup; 