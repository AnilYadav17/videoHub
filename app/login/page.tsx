"use client"
import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle, CheckCircle, ArrowRight, Shield } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        try {
            // Simulate authentication
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });
            if(res?.error){
                setError(res.error);
                return;
            }
            setSuccess('Login successful! Redirecting...');
            setTimeout(() => {
                router.push("/");
            }, 1000);
        } catch (error) {
            console.error("Login failed:", error);
            setError('Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-2 sm:py-4">
            <div className="max-w-md mx-auto px-2 sm:px-4">
                {/* Compact Header */}
                <div className="text-center mb-3 sm:mb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl mb-2 shadow-lg">
                        <Shield className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-1">
                        Welcome Back
                    </h1>
                    <p className="text-sm text-gray-600">Sign in to your account to continue</p>
                </div>

                {/* Main Form Card */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 sm:p-4 shadow-lg border border-gray-200/50">
                    <div className="space-y-3">
                        {/* Email field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
                                />
                            </div>
                        </div>

                        {/* Password field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full pl-10 pr-10 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Forgot password link */}
                        <div className="flex justify-end">
                            <a 
                                href="/forgot-password" 
                                className="text-xs text-blue-600 hover:text-blue-500 transition-colors font-medium"
                            >
                                Forgot your password?
                            </a>
                        </div>

                        {/* Submit button */}
                        <button
                            onClick={handleSubmit}
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2.5 px-4 rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Signing In...</span>
                                </>
                            ) : (
                                <>
                                    <LogIn className="w-4 h-4" />
                                    <span>Sign In</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Error/Success messages */}
                    {error && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <p className="text-green-700 text-sm">{success}</p>
                        </div>
                    )}

                    {/* Divider */}
                    <div className="mt-4 flex items-center">
                        <div className="flex-1 border-t border-gray-200"></div>
                        <div className="px-3 text-xs text-gray-500 bg-white rounded-full">Or</div>
                        <div className="flex-1 border-t border-gray-200"></div>
                    </div>

                    {/* Register link */}
                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-600">
                            Don&apos;t have an account?{' '}
                            <a 
                                href="/register" 
                                className="font-medium text-blue-600 hover:text-blue-500 transition-colors inline-flex items-center space-x-1 group"
                            >
                                <span>Create Account</span>
                                <ArrowRight className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" />
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;