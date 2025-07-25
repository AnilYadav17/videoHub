import React from 'react';
import { Video, Mail, Calendar } from 'lucide-react';

const ProfileDashboardSkeleton: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 py-4">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header Skeleton */}
                <div className="text-center mb-6">
                    <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg mx-auto mb-2 w-48 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded mx-auto w-64 animate-pulse"></div>
                </div>

                {/* Profile Header Skeleton */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 mb-6">
                    <div className="flex flex-col lg:flex-row items-center lg:items-start lg:justify-between space-y-4 lg:space-y-0">
                        {/* Profile Info Skeleton */}
                        <div className="text-center lg:text-left flex-1">
                            {/* Name Skeleton */}
                            <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg mb-4 w-64 mx-auto lg:mx-0 animate-pulse"></div>
                            
                            {/* Email Skeleton */}
                            <div className="flex items-center justify-center lg:justify-start text-gray-600 mb-4">
                                <Mail className="w-4 h-4 mr-2 text-gray-300" />
                                <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
                            </div>

                            {/* Join Date Skeleton */}
                            <div className="flex items-center justify-center lg:justify-start text-gray-600 mb-4">
                                <Calendar className="w-4 h-4 mr-1 text-gray-300" />
                                <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                            </div>
                        </div>

                        {/* Stats Skeleton */}
                        <div className="flex space-x-6">
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center border border-blue-200/50">
                                <div className="h-8 bg-blue-200 rounded mb-2 w-8 mx-auto animate-pulse"></div>
                                <div className="flex items-center justify-center">
                                    <Video className="w-4 h-4 mr-1 text-blue-300" />
                                    <div className="h-3 bg-blue-200 rounded w-12 animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Videos Section Skeleton */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
                    {/* Section Header Skeleton */}
                    <div className="flex items-center mb-6">
                        <Video className="w-6 h-6 mr-2 text-gray-300" />
                        <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-40 animate-pulse"></div>
                    </div>

                    {/* Video Grid Skeleton */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <VideoCardSkeleton key={index} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Individual Video Card Skeleton Component
const VideoCardSkeleton: React.FC = () => {
    return (
        <div className="bg-white rounded-xl shadow-md border border-gray-200/50 overflow-hidden group hover:shadow-lg transition-all duration-200">
            {/* Thumbnail Skeleton */}
            <div className="relative aspect-video bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse">
                <div className="absolute inset-0 flex items-center justify-center">
                    <Video className="w-8 h-8 text-gray-400" />
                </div>
                
                {/* Duration Badge Skeleton */}
                <div className="absolute bottom-2 right-2 bg-gray-300 rounded px-1.5 py-0.5">
                    <div className="h-3 bg-gray-400 rounded w-8 animate-pulse"></div>
                </div>
            </div>
            
            {/* Video Info Skeleton */}
            <div className="p-3">
                {/* Title Skeleton */}
                <div className="space-y-2 mb-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                </div>
                
                {/* Views and Date Skeleton */}
                <div className="space-y-1">
                    <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
                </div>
            </div>
        </div>
    );
};

export default ProfileDashboardSkeleton;