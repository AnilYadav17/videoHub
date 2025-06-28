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
            // // Simulate login logic
            // if (email && password) {
            //     
            // } else {
            //     setError('Please fill in all fields.');
            // }
        } catch (error) {
            console.error("Login failed:", error);
            setError('Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full opacity-10 blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400 to-blue-600 rounded-full opacity-10 blur-3xl"></div>
            </div>

            <div className="relative w-full max-w-md">
                {/* Main card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 transition-all duration-300 hover:shadow-3xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-lg">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                            Welcome Back
                        </h1>
                        <p className="text-gray-600">Sign in to your account to continue</p>
                    </div>

                    <div className="space-y-6">
                        {/* Email field */}
                        <div className="group">
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 z-1 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl  focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                                />
                            </div>
                        </div>

                        {/* Password field */}
                        <div className="group">
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 z-1 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl  focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Forgot password link */}
                        <div className="flex justify-end">
                            <a 
                                href="/forgot-password" 
                                className="text-sm text-blue-600 hover:text-blue-500 transition-colors font-medium"
                            >
                                Forgot your password?
                            </a>
                        </div>

                        {/* Submit button */}
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Signing In...</span>
                                </>
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5" />
                                    <span>Sign In</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Error/Success messages */}
                    {error && (
                        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3 animate-fade-in">
                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center space-x-3 animate-fade-in">
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                            <p className="text-green-700 text-sm">{success}</p>
                        </div>
                    )}

                    {/* Divider */}
                    <div className="mt-8 flex items-center">
                        <div className="flex-1 border-t border-gray-200"></div>
                        <div className="px-4 text-sm text-gray-500 bg-white rounded-full">Or</div>
                        <div className="flex-1 border-t border-gray-200"></div>
                    </div>

                    {/* Register link */}
                    <div className="mt-8 text-center">
                        <p className="text-gray-600">
                            Don't have an account?{' '}
                            <a 
                                href="/register" 
                                className="font-semibold text-blue-600 hover:text-blue-500 transition-colors inline-flex items-center space-x-1 group"
                            >
                                <span>Create Account</span>
                                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                            </a>
                        </p>
                    </div>
                </div>

                {/* Additional decorative elements */}
                <div className="absolute -z-10 top-8 left-8 w-4 h-4 bg-blue-400 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute -z-10 top-20 right-12 w-2 h-2 bg-indigo-400 rounded-full opacity-30 animate-pulse delay-1000"></div>
                <div className="absolute -z-10 bottom-16 left-4 w-3 h-3 bg-blue-300 rounded-full opacity-25 animate-pulse delay-500"></div>
            </div>

            <style jsx>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

export default LoginPage;