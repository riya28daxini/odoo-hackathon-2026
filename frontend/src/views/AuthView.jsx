import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const AuthView = () => {
  const {
    viewParams,
    login,
    register,
    showToast,
    validateEmail,
    validateIndianPhone,
    validatePassword,
    navigateTo
  } = useApp();

  // Screens: 'login', 'signup', 'forgot', 'otp', 'reset'
  const [authScreen, setAuthScreen] = useState(viewParams.screen || 'login');

  // Login State
  const [loginIdentifier, setLoginIdentifier] = useState('aarav.sharma@globetrotter.in');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginRemember, setLoginRemember] = useState(true);

  // Signup State (Screen 2)
  const [signupForm, setSignupForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    country: 'India',
    password: '',
    confirmPassword: '',
    bio: '',
    agreeTerms: false
  });
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  // Forgot & Reset Password State
  const [forgotInput, setForgotInput] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // OTP Validation State (Module 1 Validation Page)
  const [otpDigits, setOtpDigits] = useState(['5', '8', '2', '9']);
  const [timerSeconds, setTimerSeconds] = useState(45);
  const [otpTargetInfo, setOtpTargetInfo] = useState('aarav.sharma@globetrotter.in');

  // Error States
  const [errors, setErrors] = useState({});

  // Countdown timer for OTP
  React.useEffect(() => {
    if (authScreen === 'otp' && timerSeconds > 0) {
      const interval = setInterval(() => setTimerSeconds((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [authScreen, timerSeconds]);

  // --- LOGIN SUBMISSION WITH STRICT VALIDATION ---
  const handleLogin = (e) => {
    e.preventDefault();
    const newErrors = {};

    const trimmedId = loginIdentifier.trim();
    if (!trimmedId) {
      newErrors.loginIdentifier = 'Please enter your registered email address or 10-digit mobile number.';
    } else {
      const isEmail = validateEmail(trimmedId);
      const isPhone = validateIndianPhone(trimmedId);
      if (!isEmail && !isPhone) {
        newErrors.loginIdentifier = 'Invalid format. Enter a valid email (e.g. aarav@gmail.com) or 10-digit mobile number.';
      }
    }

    if (!loginPassword) {
      newErrors.loginPassword = 'Password is required.';
    } else if (loginPassword.length < 6) {
      newErrors.loginPassword = 'Password must be at least 6 characters long.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('Please fix the errors in the login form.', 'error');
      return;
    }

    setErrors({});
    login(trimmedId, loginPassword);
  };

  // --- SIGNUP SUBMISSION WITH STRICT VALIDATION ---
  const handleSignup = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!signupForm.firstName.trim()) {
      newErrors.firstName = 'First name is required.';
    } else if (signupForm.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must have at least 2 letters.';
    }

    if (!signupForm.lastName.trim()) {
      newErrors.lastName = 'Last name is required.';
    }

    if (!signupForm.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!validateEmail(signupForm.email)) {
      newErrors.email = 'Please provide a valid email format (e.g. user@domain.com).';
    }

    if (!signupForm.phone.trim()) {
      newErrors.phone = 'Mobile number is required.';
    } else if (!validateIndianPhone(signupForm.phone)) {
      newErrors.phone = 'Please provide a valid 10-digit Indian mobile number (e.g. 9876543210).';
    }

    if (!signupForm.city.trim()) {
      newErrors.city = 'Home city in India is required.';
    }

    if (!signupForm.password) {
      newErrors.password = 'Password is required.';
    } else if (signupForm.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long.';
    }

    if (!signupForm.confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required.';
    } else if (signupForm.confirmPassword !== signupForm.password) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!signupForm.agreeTerms) {
      newErrors.agreeTerms = 'You must accept GlobeTrotter Terms & Conditions to register.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('Please complete all mandatory registration fields.', 'error');
      return;
    }

    setErrors({});
    setOtpTargetInfo(signupForm.email);
    setTimerSeconds(45);
    setAuthScreen('otp');
    showToast('Verification OTP sent! (Demo OTP: 5829)');
  };

  // --- FORGOT PASSWORD SUBMISSION ---
  const handleForgot = (e) => {
    e.preventDefault();
    const newErrors = {};

    const trimmed = forgotInput.trim();
    if (!trimmed) {
      newErrors.forgotInput = 'Please enter your registered email or mobile number.';
    } else {
      const isEmail = validateEmail(trimmed);
      const isPhone = validateIndianPhone(trimmed);
      if (!isEmail && !isPhone) {
        newErrors.forgotInput = 'Please provide a valid email address or 10-digit mobile number.';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setOtpTargetInfo(trimmed);
    setTimerSeconds(45);
    setAuthScreen('otp');
    showToast(`Password reset code sent to ${trimmed}! (Code: 5829)`);
  };

  // --- OTP VALIDATION SUBMISSION (VALIDATION PAGE) ---
  const handleOtpVerify = (e) => {
    e.preventDefault();
    const enteredOtp = otpDigits.join('');

    if (enteredOtp.length < 4) {
      setErrors({ otp: 'Please enter all 4 digits of the verification code.' });
      showToast('Please enter the 4-digit OTP.', 'error');
      return;
    }

    // Demo verification code is 5829 or any 4 digits
    setErrors({});
    showToast('OTP verified successfully! Identity confirmed.');

    if (signupForm.email) {
      register(signupForm);
    } else {
      setAuthScreen('reset');
    }
  };

  // --- RESET NEW PASSWORD SUBMISSION ---
  const handleResetPassword = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!newPassword || newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters.';
    }

    if (newPassword !== confirmNewPassword) {
      newErrors.confirmNewPassword = 'Passwords do not match.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    showToast('Password updated successfully! Please sign in with your new password.');
    setAuthScreen('login');
  };

  const handleOtpInput = (index, value) => {
    const nextDigits = [...otpDigits];
    nextDigits[index] = value.slice(-1);
    setOtpDigits(nextDigits);

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  return (
    <div className="min-h-[88vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-100 via-teal-50/50 to-cyan-50/50">
      <div className="max-w-xl w-full">
        {/* Navigation Tabs between Auth Pages */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex bg-white/80 p-1.5 rounded-2xl shadow-sm border border-slate-200 backdrop-blur-md">
            <button
              onClick={() => { setAuthScreen('login'); setErrors({}); }}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition ${
                authScreen === 'login'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🔐 Sign In
            </button>
            <button
              onClick={() => { setAuthScreen('signup'); setErrors({}); }}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition ${
                authScreen === 'signup'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📝 Register
            </button>
            <button
              onClick={() => { setAuthScreen('forgot'); setErrors({}); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                authScreen === 'forgot' || authScreen === 'reset'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🔑 Recovery
            </button>
            <button
              onClick={() => { setAuthScreen('otp'); setErrors({}); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                authScreen === 'otp'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🛡️ OTP Verify
            </button>
          </div>
        </div>

        {/* Card Container */}
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 p-8 sm:p-10 relative overflow-hidden backdrop-blur-md">
          {/* Header Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl"></div>

          {/* Logo & Header */}
          <div className="text-center mb-8 relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-600 to-cyan-500 text-white text-3xl shadow-lg mb-3">
              🇮🇳
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {authScreen === 'login' && 'Sign In to GlobeTrotter'}
              {authScreen === 'signup' && 'Create Explorer Account'}
              {authScreen === 'forgot' && 'Forgot Password Recovery'}
              {authScreen === 'otp' && 'OTP Identity Verification'}
              {authScreen === 'reset' && 'Set New Password'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {authScreen === 'login' && 'Enter your credentials to plan and explore personalized Indian trips'}
              {authScreen === 'signup' && 'Register in 1 minute with Indian phone number & email'}
              {authScreen === 'forgot' && 'Receive a 4-digit reset OTP on your registered contact'}
              {authScreen === 'otp' && `Enter the 4-digit code sent to ${otpTargetInfo}`}
              {authScreen === 'reset' && 'Create a strong new password for your account'}
            </p>
          </div>

          {/* ======================================================== */}
          {/* 1. LOGIN PAGE (SCREEN 1) */}
          {/* ======================================================== */}
          {authScreen === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4 relative z-10" noValidate>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Email Address or Mobile Number *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={loginIdentifier}
                    onChange={(e) => {
                      setLoginIdentifier(e.target.value);
                      if (errors.loginIdentifier) setErrors({ ...errors, loginIdentifier: null });
                    }}
                    placeholder="e.g. aarav.sharma@globetrotter.in or 9876543210"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                      errors.loginIdentifier ? 'border-rose-500 bg-rose-50/30 ring-1 ring-rose-400' : 'border-slate-300'
                    } focus:ring-2 focus:ring-teal-500 text-sm transition outline-none font-medium`}
                  />
                  <span className="absolute left-3.5 top-3.5 text-slate-400">👤</span>
                </div>
                {errors.loginIdentifier && (
                  <p className="text-rose-500 text-[11px] font-semibold mt-1 flex items-center gap-1">
                    <span>⚠️</span> {errors.loginIdentifier}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Password *
                  </label>
                  <button
                    type="button"
                    onClick={() => { setAuthScreen('forgot'); setErrors({}); }}
                    className="text-xs font-semibold text-teal-600 hover:text-teal-700 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => {
                      setLoginPassword(e.target.value);
                      if (errors.loginPassword) setErrors({ ...errors, loginPassword: null });
                    }}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-10 py-3 rounded-xl border ${
                      errors.loginPassword ? 'border-rose-500 bg-rose-50/30 ring-1 ring-rose-400' : 'border-slate-300'
                    } focus:ring-2 focus:ring-teal-500 text-sm transition outline-none font-medium`}
                  />
                  <span className="absolute left-3.5 top-3.5 text-slate-400">🔒</span>
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 text-xs font-bold"
                  >
                    {showLoginPassword ? 'HIDE' : 'SHOW'}
                  </button>
                </div>
                {errors.loginPassword && (
                  <p className="text-rose-500 text-[11px] font-semibold mt-1 flex items-center gap-1">
                    <span>⚠️</span> {errors.loginPassword}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                  <input
                    type="checkbox"
                    checked={loginRemember}
                    onChange={(e) => setLoginRemember(e.target.checked)}
                    className="rounded text-teal-600 focus:ring-teal-500"
                  />
                  Remember me on this browser
                </label>
                <span className="text-slate-400 text-[11px]">🛡️ 256-bit Secure</span>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold rounded-xl shadow-lg shadow-teal-500/25 transition transform active:scale-[0.99] text-sm flex items-center justify-center gap-2"
              >
                <span>🚀</span> Sign In to Account
              </button>

              <div className="relative my-5 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <span className="relative px-3 bg-white text-[11px] text-slate-400 uppercase tracking-wider">
                  Quick Access Options
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => login('aarav.sharma@globetrotter.in', 'password123')}
                  className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
                >
                  <span>⚡</span> Demo Indian Login
                </button>
                <button
                  type="button"
                  onClick={() => {
                    login('aarav.sharma@globetrotter.in', 'password123');
                    showToast('Browsing in guest mode!');
                  }}
                  className="py-2.5 px-3 bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
                >
                  <span>👀</span> Explore as Guest
                </button>
              </div>

              <p className="text-center text-xs text-slate-600 mt-5">
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => { setAuthScreen('signup'); setErrors({}); }}
                  className="font-bold text-teal-600 hover:text-teal-700 hover:underline"
                >
                  Create Account (Sign Up)
                </button>
              </p>
            </form>
          )}

          {/* ======================================================== */}
          {/* 2. SIGN UP / REGISTRATION PAGE (SCREEN 2) */}
          {/* ======================================================== */}
          {authScreen === 'signup' && (
            <form onSubmit={handleSignup} className="space-y-4 relative z-10" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={signupForm.firstName}
                    onChange={(e) => setSignupForm({ ...signupForm, firstName: e.target.value })}
                    placeholder="e.g. Aarav"
                    className={`w-full px-4 py-2.5 rounded-xl border ${
                      errors.firstName ? 'border-rose-500 bg-rose-50/30' : 'border-slate-300'
                    } focus:ring-2 focus:ring-teal-500 text-sm outline-none font-medium`}
                  />
                  {errors.firstName && <p className="text-rose-500 text-[11px] font-semibold mt-0.5">⚠️ {errors.firstName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={signupForm.lastName}
                    onChange={(e) => setSignupForm({ ...signupForm, lastName: e.target.value })}
                    placeholder="e.g. Sharma"
                    className={`w-full px-4 py-2.5 rounded-xl border ${
                      errors.lastName ? 'border-rose-500 bg-rose-50/30' : 'border-slate-300'
                    } focus:ring-2 focus:ring-teal-500 text-sm outline-none font-medium`}
                  />
                  {errors.lastName && <p className="text-rose-500 text-[11px] font-semibold mt-0.5">⚠️ {errors.lastName}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={signupForm.email}
                    onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                    placeholder="aarav@example.com"
                    className={`w-full px-4 py-2.5 rounded-xl border ${
                      errors.email ? 'border-rose-500 bg-rose-50/30' : 'border-slate-300'
                    } focus:ring-2 focus:ring-teal-500 text-sm outline-none font-medium`}
                  />
                  {errors.email && <p className="text-rose-500 text-[11px] font-semibold mt-0.5">⚠️ {errors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Mobile Number (10 Digits) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-500">+91</span>
                    <input
                      type="tel"
                      value={signupForm.phone}
                      onChange={(e) => setSignupForm({ ...signupForm, phone: e.target.value })}
                      placeholder="9876543210"
                      className={`w-full pl-12 pr-4 py-2.5 rounded-xl border ${
                        errors.phone ? 'border-rose-500 bg-rose-50/30' : 'border-slate-300'
                      } focus:ring-2 focus:ring-teal-500 text-sm outline-none font-medium`}
                    />
                  </div>
                  {errors.phone && <p className="text-rose-500 text-[11px] font-semibold mt-0.5">⚠️ {errors.phone}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Home City in India *
                  </label>
                  <input
                    type="text"
                    value={signupForm.city}
                    onChange={(e) => setSignupForm({ ...signupForm, city: e.target.value })}
                    placeholder="e.g. Mumbai, Delhi, Pune, Bengaluru"
                    className={`w-full px-4 py-2.5 rounded-xl border ${
                      errors.city ? 'border-rose-500 bg-rose-50/30' : 'border-slate-300'
                    } focus:ring-2 focus:ring-teal-500 text-sm outline-none font-medium`}
                  />
                  {errors.city && <p className="text-rose-500 text-[11px] font-semibold mt-0.5">⚠️ {errors.city}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    value="India (₹ INR)"
                    disabled
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-700 text-sm outline-none font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Password (Min 6 chars) *
                  </label>
                  <input
                    type={showSignupPassword ? 'text' : 'password'}
                    value={signupForm.password}
                    onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                    placeholder="••••••••"
                    className={`w-full px-4 py-2.5 rounded-xl border ${
                      errors.password ? 'border-rose-500 bg-rose-50/30' : 'border-slate-300'
                    } focus:ring-2 focus:ring-teal-500 text-sm outline-none font-medium`}
                  />
                  {errors.password && <p className="text-rose-500 text-[11px] font-semibold mt-0.5">⚠️ {errors.password}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Confirm Password *
                  </label>
                  <input
                    type={showSignupPassword ? 'text' : 'password'}
                    value={signupForm.confirmPassword}
                    onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    className={`w-full px-4 py-2.5 rounded-xl border ${
                      errors.confirmPassword ? 'border-rose-500 bg-rose-50/30' : 'border-slate-300'
                    } focus:ring-2 focus:ring-teal-500 text-sm outline-none font-medium`}
                  />
                  {errors.confirmPassword && <p className="text-rose-500 text-[11px] font-semibold mt-0.5">⚠️ {errors.confirmPassword}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Additional Information / Travel Style
                </label>
                <textarea
                  rows="2"
                  value={signupForm.bio}
                  onChange={(e) => setSignupForm({ ...signupForm, bio: e.target.value })}
                  placeholder="Tell us what you love (e.g. Solo bike rides in Ladakh, Royal forts in Rajasthan, Goa sunsets)..."
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 text-xs outline-none"
                ></textarea>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <input
                    type="checkbox"
                    checked={signupForm.agreeTerms}
                    onChange={(e) => setSignupForm({ ...signupForm, agreeTerms: e.target.checked })}
                    className="rounded text-teal-600 focus:ring-teal-500"
                  />
                  <span>I agree to GlobeTrotter India Terms of Service & Privacy Policy *</span>
                </div>
                {errors.agreeTerms && (
                  <p className="text-rose-500 text-[11px] font-semibold">⚠️ {errors.agreeTerms}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold rounded-xl shadow-lg shadow-teal-500/25 transition transform active:scale-[0.99] text-sm"
              >
                Register & Verify via OTP
              </button>

              <p className="text-center text-xs text-slate-600 mt-3">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => { setAuthScreen('login'); setErrors({}); }}
                  className="font-bold text-teal-600 hover:text-teal-700 hover:underline"
                >
                  Sign In (Login)
                </button>
              </p>
            </form>
          )}

          {/* ======================================================== */}
          {/* 3. FORGOT PASSWORD PAGE */}
          {/* ======================================================== */}
          {authScreen === 'forgot' && (
            <form onSubmit={handleForgot} className="space-y-4 relative z-10" noValidate>
              <div className="p-4 bg-teal-50 rounded-2xl border border-teal-200 text-xs text-teal-800">
                💡 Enter your registered email or 10-digit mobile number. We will send a secure 4-digit verification code.
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Registered Email or Mobile *
                </label>
                <input
                  type="text"
                  value={forgotInput}
                  onChange={(e) => {
                    setForgotInput(e.target.value);
                    if (errors.forgotInput) setErrors({ ...errors, forgotInput: null });
                  }}
                  placeholder="e.g. aarav.sharma@globetrotter.in"
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.forgotInput ? 'border-rose-500 bg-rose-50/30' : 'border-slate-300'
                  } focus:ring-2 focus:ring-teal-500 text-sm outline-none font-medium`}
                  required
                />
                {errors.forgotInput && (
                  <p className="text-rose-500 text-[11px] font-semibold mt-1">⚠️ {errors.forgotInput}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-lg text-sm"
              >
                Send Password Reset OTP
              </button>

              <button
                type="button"
                onClick={() => { setAuthScreen('login'); setErrors({}); }}
                className="w-full py-2 text-slate-600 hover:text-slate-900 text-xs font-bold transition text-center"
              >
                ← Back to Login
              </button>
            </form>
          )}

          {/* ======================================================== */}
          {/* 4. VALIDATION PAGE (OTP VERIFICATION SCREEN) */}
          {/* ======================================================== */}
          {authScreen === 'otp' && (
            <form onSubmit={handleOtpVerify} className="space-y-6 relative z-10 text-center" noValidate>
              <div className="p-3.5 bg-teal-50 rounded-2xl border border-teal-200 text-xs text-teal-800 font-semibold">
                🔒 Enter the 4-digit verification code sent to <br />
                <span className="font-bold text-teal-900">{otpTargetInfo}</span>
              </div>

              {errors.otp && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                  ⚠️ {errors.otp}
                </div>
              )}

              {/* 4 Digit Boxes with auto advance */}
              <div className="flex justify-center gap-3 my-4">
                {[0, 1, 2, 3].map((idx) => (
                  <input
                    key={idx}
                    id={`otp-input-${idx}`}
                    type="text"
                    maxLength="1"
                    value={otpDigits[idx] || ''}
                    onChange={(e) => handleOtpInput(idx, e.target.value)}
                    className="w-14 h-14 text-center text-2xl font-black rounded-2xl border-2 border-teal-500 focus:border-teal-600 focus:ring-2 focus:ring-teal-300 outline-none shadow-sm bg-slate-50 text-slate-900"
                  />
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 px-4">
                <span>Code expires in: <strong className="text-slate-800">00:{timerSeconds < 10 ? `0${timerSeconds}` : timerSeconds}</strong></span>
                <button
                  type="button"
                  disabled={timerSeconds > 0}
                  onClick={() => {
                    setTimerSeconds(45);
                    showToast('New OTP code sent (Code: 5829)!');
                  }}
                  className={`font-bold ${timerSeconds > 0 ? 'text-slate-400 cursor-not-allowed' : 'text-teal-600 hover:underline'}`}
                >
                  Resend OTP Code
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/25 transition text-sm"
              >
                Validate & Confirm Identity
              </button>

              <button
                type="button"
                onClick={() => { setAuthScreen('login'); setErrors({}); }}
                className="text-xs text-slate-500 hover:underline block mx-auto"
              >
                Cancel and return to Login
              </button>
            </form>
          )}

          {/* ======================================================== */}
          {/* 5. RESET PASSWORD PAGE */}
          {/* ======================================================== */}
          {authScreen === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-4 relative z-10" noValidate>
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-800 font-semibold">
                ✓ Identity verified! Please enter your new password below.
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  New Password (Min 6 chars) *
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.newPassword ? 'border-rose-500 bg-rose-50/30' : 'border-slate-300'
                  } focus:ring-2 focus:ring-teal-500 text-sm outline-none font-medium`}
                  required
                />
                {errors.newPassword && (
                  <p className="text-rose-500 text-[11px] font-semibold mt-1">⚠️ {errors.newPassword}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.confirmNewPassword ? 'border-rose-500 bg-rose-50/30' : 'border-slate-300'
                  } focus:ring-2 focus:ring-teal-500 text-sm outline-none font-medium`}
                  required
                />
                {errors.confirmNewPassword && (
                  <p className="text-rose-500 text-[11px] font-semibold mt-1">⚠️ {errors.confirmNewPassword}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-lg text-sm"
              >
                Save New Password & Sign In
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
