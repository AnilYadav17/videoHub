"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import VideoCard from './videoCard';


// Type definitions
interface VideoData {
    id: string;
    title: string;
    description: string;
    duration: string;
    views: string;
    uploadDate: string;
    creator: {
        name: string;
        verified: boolean;
        subscribers: string;
    };
    category: string;
    likes: string;
    thumbnail: string;
}

interface HeroSectionProps {
    className?: string;
}


const HeroSection: React.FC<HeroSectionProps> = ({ className = "" }) => {
    const [hoveredVideo, setHoveredVideo] = useState<string | null>(null);
    const router = useRouter();
    

    // Sample video data with thumbnail URLs
    const videoData: VideoData[] = [
        {
            id: 'v1',
            title: 'Quick React Tips',
            description: 'Learn React in 60 seconds with these essential tips.',
            duration: '0:58',
            views: '125K',
            uploadDate: '2 days ago',
            creator: {
                name: 'CodeAcademy',
                verified: true,
                subscribers: '1.2M'
            },
            category: 'Shorts',
            likes: '2.1K',
            thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=450&h=800&fit=crop&crop=entropy&auto=format&q=80'
        },
        {
            id: 'v2',
            title: 'JS Trick in 30s',
            description: 'Mind-blowing JavaScript trick that will save you time.',
            duration: '0:32',
            views: '89K',
            uploadDate: '1 day ago',
            creator: {
                name: 'JS Master',
                verified: false,
                subscribers: '456K'
            },
            category: 'Shorts',
            likes: '1.8K',
            thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=450&h=800&fit=crop&crop=entropy&auto=format&q=80'
        },
        {
            id: 'v3',
            title: 'CSS Magic ✨',
            description: 'Amazing CSS animation in under a minute.',
            duration: '0:45',
            views: '203K',
            uploadDate: '3 hours ago',
            creator: {
                name: 'DesignPro',
                verified: true,
                subscribers: '789K'
            },
            category: 'Shorts',
            likes: '3.2K',
            thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=450&h=800&fit=crop&crop=entropy&auto=format&q=80'
        },
        {
            id: 'v4',
            title: 'API Call Pro Tip',
            description: 'The fastest way to make API calls in Node.js.',
            duration: '0:52',
            views: '156K',
            uploadDate: '12 hours ago',
            creator: {
                name: 'Backend Dev',
                verified: true,
                subscribers: '623K'
            },
            category: 'Shorts',
            likes: '2.7K',
            thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=450&h=800&fit=crop&crop=entropy&auto=format&q=80'
        },
        {
            id: 'v5',
            title: 'UI Design Hack',
            description: 'Design better mobile UIs with this simple trick.',
            duration: '0:38',
            views: '98K',
            uploadDate: '6 hours ago',
            creator: {
                name: 'UX Designer',
                verified: false,
                subscribers: '345K'
            },
            category: 'Shorts',
            likes: '1.9K',
            thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=450&h=800&fit=crop&crop=entropy&auto=format&q=80'
        },
        {
            id: 'v6',
            title: 'TypeScript Tip 🔥',
            description: 'This TypeScript feature will blow your mind!',
            duration: '0:41',
            views: '187K',
            uploadDate: '8 hours ago',
            creator: {
                name: 'TypeScript Pro',
                verified: true,
                subscribers: '567K'
            },
            category: 'Shorts',
            likes: '2.5K',
            thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=450&h=800&fit=crop&crop=entropy&auto=format&q=80'
        },
        {
            id: 'v7',
            title: 'Speed Up Your Site',
            description: 'One line of code that makes your site 10x faster.',
            duration: '0:29',
            views: '134K',
            uploadDate: '4 hours ago',
            creator: {
                name: 'Web Optimizer',
                verified: true,
                subscribers: '432K'
            },
            category: 'Shorts',
            likes: '2.3K',
            thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=450&h=800&fit=crop&crop=entropy&auto=format&q=80'
        },
        {
            id: 'v8',
            title: 'Database Secret',
            description: 'The database optimization trick nobody talks about.',
            duration: '0:55',
            views: '76K',
            uploadDate: '2 hours ago',
            creator: {
                name: 'DB Expert',
                verified: false,
                subscribers: '298K'
            },
            category: 'Shorts',
            likes: '1.4K',
            thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=450&h=800&fit=crop&crop=entropy&auto=format&q=80'
        }
    ];

    const handleViewAll = (): void => {
        router.push('/videos');
    };

    return (
        <section className={`bg-gradient-to-br from-gray-50 to-blue-50/30 py-4 sm:py-6 md:py-8 ${className}`}>
            <div className="max-w-7xl mx-auto px-1 !sm:px-2 md:px-4 lg:px-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-4 sm:mb-6 md:mb-8 px-2 sm:px-0">
                    <div>
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent mb-1 sm:mb-2">
                            Trending Shorts
                        </h2>
                        <p className="text-sm sm:text-base text-gray-600">
                            Quick, engaging videos under 60 seconds
                        </p>
                    </div>
                </div>

                {/* Resuable Video Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1 sm:gap-2 md:gap-3 lg:gap-4 mb-4 sm:mb-6 md:mb-8">
                    {videoData.map((video) => (
                        <VideoCard
                            key={video.id}
                            video={video}
                            isHovered={hoveredVideo === video.id}
                            onHover={setHoveredVideo}
                        />
                    ))}
                </div>

                {/* View All Button */}
                <div className="text-center px-4 sm:px-2">
                    <button
                        type="button"
                        onClick={handleViewAll}
                        className="inline-flex items-center justify-center !px-5 !sm:px-3 !py-3  bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-base sm:text-sm font-bold rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:ring-offset-2 border border-blue-500/20"
                        aria-label="View all shorts"
                    >
                        <span>View All Shorts</span>
                    </button>
                </div>
            </div>

            <style jsx>{`
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </section>
    );
};

export default HeroSection;