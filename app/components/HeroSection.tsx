"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import VideoCard from './videoCard';
import { VideoGridSkeleton } from './VideoGridSkeleton';// Import the skeleton component
import { IUser } from '@/models/User';

// Type definitions
interface VideoData {
    _id?: string;
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl: string;
    controls: boolean;
    owner: IUser;
    transformation: {
        height: number;
        width: number;
        quality: number;
    }
}

interface HeroSectionProps {
    className?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ className = "" }) => {
    const [videos, setVideos] = useState<VideoData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');  
    const [hoveredVideo, setHoveredVideo] = useState<string | null>(null);
    const [activeVideo, setActiveVideo] = useState<VideoData | null>(null);
    const router = useRouter();
    
    useEffect(() => {
        const fetchVideo = async (): Promise<void> => {
            try {
                const res = await fetch("/api/video");
                if (!res.ok) {
                    throw new Error('Failed to fetch video');
                } 
                const data = await res.json();
                setVideos(data);
                console.log(data)
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError("Something went wrong");
                }
            } finally {
                setLoading(false);
            }
        }
        fetchVideo();
        console.log(error)
    }, []);

    const handleViewAll = (): void => {
        router.push('/#');
    };

    return (
        <section className={`bg-gradient-to-br from-gray-50 to-blue-50/30 py-4 sm:py-6 md:py-8 ${className}`}>
            <div className="max-w-7xl mx-auto px-1 !sm:px-2 md:px-4 lg:px-4">
                {/* Header - Made smaller for mobile */}
                <div className="flex items-center justify-between mb-3 sm:mb-4 md:mb-6 lg:mb-8 px-2 sm:px-0">
                    <div>
                        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent mb-1 sm:mb-2">
                            Trending Shorts
                        </h2>
                        <p className="text-xs sm:text-sm md:text-base text-gray-600">
                            Quick, engaging videos under 60 seconds
                        </p>
                    </div>
                </div>

                {/* Reusable Video Grid with Skeleton Loader */}
                {loading ? (
                    <VideoGridSkeleton />
                ) : error ? (
                    <p className="text-center text-red-600 font-semibold">{error}</p>
                ) : videos.length === 0 ? (
                    <p className="text-center text-gray-500">No videos available.</p>
                ) : (      
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1 sm:gap-2 md:gap-3 lg:gap-4 mb-4 sm:mb-6 md:mb-8">
                        {videos.map((video: VideoData) => (
                            <VideoCard
                                key={video._id}
                                video={video}
                                onClick={(video: VideoData) => setActiveVideo(video)}
                                isHovered={hoveredVideo === video._id}
                                onHover={(_id: string | null | undefined) => setHoveredVideo(_id ?? null)}
                            />
                        ))}
                    </div>
                )}

                {/* View All Button - Made smaller for mobile */}
                <div className="text-center px-2 sm:px-4">
                    <button
                        type="button"
                        onClick={handleViewAll}
                        className="inline-flex items-center justify-center px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 md:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs sm:text-sm md:text-base font-bold rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg sm:shadow-xl hover:shadow-xl sm:hover:shadow-2xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-blue-500/30 focus:ring-offset-1 sm:focus:ring-offset-2 border border-blue-500/20"
                        aria-label="View all shorts"
                    >
                        <span>View All Shorts</span>
                    </button>
                </div>
            </div>

            {activeVideo && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
                    <div className="relative max-h-[90%] max-w-[90%] bg-black rounded-xl overflow-hidden flex justify-center items-center">
                        <video
                            src={activeVideo.videoUrl}
                            controls
                            autoPlay
                            className="max-h-[90vh] max-w-[90vw] object-contain rounded-xl"
                        />
                        <button
                            onClick={() => setActiveVideo(null)}
                            className="absolute top-2 right-2 text-white bg-red-500 px-3 py-1 rounded"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

            <style jsx>{`
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                
                @keyframes shimmer {
                    0% {
                        transform: translateX(-100%);
                    }
                    100% {
                        transform: translateX(100%);
                    }
                }
                
                .animate-shimmer {
                    animation: shimmer 2s infinite;
                }
                
                .animate-pulse {
                    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                
                @keyframes pulse {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: .5;
                    }
                }
            `}</style>
        </section>
    );
};

export default HeroSection;