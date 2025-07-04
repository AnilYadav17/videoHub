// VideoSkeleton.tsx - Individual video card skeleton
import React from 'react';

interface VideoSkeletonProps {
    className?: string;
}

const VideoSkeleton: React.FC<VideoSkeletonProps> = ({ className = "" }) => {
    return (
        <div className={`group relative bg-white/95 backdrop-blur-xl rounded-lg sm:rounded-2xl shadow-lg sm:shadow-xl border border-gray-200/60 overflow-hidden animate-pulse ${className}`}>
            {/* Thumbnail Skeleton - Portrait for Shorts */}
            <div className="relative overflow-hidden rounded-t-lg sm:rounded-t-2xl aspect-[9/16] bg-gradient-to-br from-gray-200 to-gray-300">
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                
                {/* Duration Badge Skeleton */}
                <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 md:bottom-3 md:right-3 bg-gray-300 text-transparent text-[10px] sm:text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 md:px-2.5 md:py-1.5 rounded sm:rounded-md md:rounded-lg">
                    1:00
                </div>

                {/* Category Badge Skeleton */}
                <div className="absolute top-1 left-1 sm:top-2 sm:left-2 md:top-3 md:left-3 bg-gray-300 text-transparent text-[10px] sm:text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 md:px-3 md:py-1.5 rounded-full">
                    Shorts
                </div>
            </div>

            {/* Content Skeleton */}
            <div className="p-1 sm:p-2 md:p-3 lg:p-4">
                {/* Title Skeleton */}
                <div className="mb-0.5 sm:mb-1 md:mb-2">
                    <div className="h-3 sm:h-4 md:h-5 bg-gray-300 rounded mb-1"></div>
                    <div className="h-3 sm:h-4 md:h-5 bg-gray-300 rounded w-3/4"></div>
                </div>

                {/* Creator Skeleton */}
                <div className="flex items-center space-x-0.5 sm:space-x-1 md:space-x-2 mb-1 sm:mb-1.5 md:mb-3">
                    <div className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 md:w-5 md:h-5 bg-gray-300 rounded-full flex-shrink-0"></div>
                    <div className="h-2 sm:h-3 md:h-4 bg-gray-300 rounded w-20 sm:w-24 md:w-28"></div>
                </div>

                {/* Stats Row Skeleton */}
                <div className="inline-flex items-center space-x-1.5 sm:space-x-1.5 md:space-x-2 mb-1 sm:mb-1.5 md:mb-2">
                    <div className="flex items-center space-x-1">
                        <div className="w-3.5 h-3.5 sm:w-5 sm:h-5 md:w-4 md:h-4 bg-gray-300 rounded"></div>
                        <div className="h-2 sm:h-3 bg-gray-300 rounded w-8 sm:w-10"></div>
                    </div>
                    <div className="flex items-center space-x-1">
                        <div className="w-3.5 h-3.5 sm:w-5 sm:h-5 md:w-4 md:h-4 bg-gray-300 rounded"></div>
                        <div className="h-2 sm:h-3 bg-gray-300 rounded w-8 sm:w-10"></div>
                    </div>
                </div>
                
                {/* Action Buttons Row Skeleton */}
                <div className="inline-flex items-center px-3 justify-center space-x-1 sm:space-x-1">
                    <div className="flex-1 max-w-[40px] sm:max-w-[45px] md:max-w-[60px] p-1 sm:p-1 md:p-1.5 rounded sm:rounded-md md:rounded-lg bg-gray-200 flex items-center justify-center">
                        <div className="w-3.5 h-3.5 sm:w-5 sm:h-5 md:w-4 md:h-4 bg-gray-300 rounded"></div>
                    </div>
                    <div className="flex-1 max-w-[40px] sm:max-w-[45px] md:max-w-[60px] p-1 sm:p-1 md:p-1.5 rounded sm:rounded-md md:rounded-lg bg-gray-200 flex items-center justify-center">
                        <div className="w-3.5 h-3.5 sm:w-5 sm:h-5 md:w-4 md:h-4 bg-gray-300 rounded"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// VideoGridSkeleton.tsx - Grid of skeleton cards
interface VideoGridSkeletonProps {
    className?: string;
}

export const VideoGridSkeleton: React.FC<VideoGridSkeletonProps> = ({ className = "" }) => {
    // Create 8 skeleton cards for better visual effect
    const skeletonCount = 8;
    
    return (
        <div className={`grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1 sm:gap-2 md:gap-3 lg:gap-4 mb-4 sm:mb-6 md:mb-8 ${className}`}>
            {Array.from({ length: skeletonCount }, (_, index: number) => (
                <VideoSkeleton key={index} />
            ))}
        </div>
    );
};


export default VideoSkeleton;