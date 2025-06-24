"use client";
import React, { useState, useEffect } from 'react';
import { 
    Play, 
    Pause,
    Heart,
    Share2,
    Bookmark,
    Eye,
    Clock,
    User,
    ChevronLeft,
    ChevronRight,
    Verified,
    ThumbsUp,
    MoreHorizontal
} from 'lucide-react';

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
}

interface VideoCardProps {
    video: VideoData;
    isHovered: boolean;
    onHover: (id: string | null) => void;
    className?: string;
}

interface HeroSectionProps {
    className?: string;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, isHovered, onHover, className = "" }) => {
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [isSaved, setIsSaved] = useState<boolean>(false);

    const toggleLike = (e: React.MouseEvent): void => {
        e.stopPropagation();
        setIsLiked(!isLiked);
    };

    const toggleSave = (e: React.MouseEvent): void => {
        e.stopPropagation();
        setIsSaved(!isSaved);
    };

    return (
        <div 
            className={`group relative bg-white/90 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-lg border border-gray-100 hover:border-gray-200 transition-all duration-300 cursor-pointer ${className}`}
            onMouseEnter={() => onHover(video.id)}
            onMouseLeave={() => onHover(null)}
        >
            {/* Thumbnail Section */}
            <div className="relative overflow-hidden rounded-t-xl aspect-video bg-gray-100">
                <div 
                    className="w-full h-full flex items-center justify-center text-white font-semibold text-2xl"
                    style={{
                        background: `linear-gradient(135deg, 
                            hsl(${video.id.charCodeAt(0) * 50 % 360}, 65%, 55%), 
                            hsl(${(video.id.charCodeAt(0) * 50 + 60) % 360}, 65%, 65%))`
                    }}
                >
                    {video.title.charAt(0).toUpperCase()}
                </div>
                
                {/* Duration */}
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded-md font-medium">
                    {video.duration}
                </div>

                {/* Play Button */}
                <div className={`absolute inset-0 bg-black/20 flex items-center justify-center transition-opacity duration-200 ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                }`}>
                    <button
                        type="button"
                        className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-105 transition-transform"
                    >
                        <Play className="w-5 h-5 text-gray-700 ml-0.5" />
                    </button>
                </div>

                {/* Category */}
                <div className="absolute top-2 left-2 bg-white/90 text-gray-700 text-xs px-2 py-1 rounded-md font-medium">
                    {video.category}
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Title */}
                <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 leading-tight">
                    {video.title}
                </h3>

                {/* Creator */}
                <div className="flex items-center space-x-2 mb-3">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                        <User className="w-3 h-3 text-white" />
                    </div>
                    <div className="flex items-center space-x-1">
                        <span className="text-xs text-gray-600 font-medium">{video.creator.name}</span>
                        {video.creator.verified && (
                            <Verified className="w-3 h-3 text-blue-500" />
                        )}
                    </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                            <Eye className="w-3 h-3" />
                            <span>{video.views}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <ThumbsUp className="w-3 h-3" />
                            <span>{video.likes}</span>
                        </div>
                    </div>
                    <span>{video.uploadDate}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                        <button
                            type="button"
                            onClick={toggleLike}
                            className={`p-1.5 rounded-lg transition-colors ${
                                isLiked ? 'bg-red-50 text-red-500' : 'hover:bg-gray-100 text-gray-400'
                            }`}
                        >
                            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                        </button>
                        <button
                            type="button"
                            onClick={toggleSave}
                            className={`p-1.5 rounded-lg transition-colors ${
                                isSaved ? 'bg-blue-50 text-blue-500' : 'hover:bg-gray-100 text-gray-400'
                            }`}
                        >
                            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                        </button>
                        <button
                            type="button"
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400"
                        >
                            <Share2 className="w-4 h-4" />
                        </button>
                        <button
                            type="button"
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400"
                        >
                            <MoreHorizontal className="w-4 h-4" />
                        </button>
                    </div>
                    <button
                        type="button"
                        className="text-blue-600 hover:text-blue-700 text-xs font-medium transition-colors"
                    >
                        Watch
                    </button>
                </div>
            </div>
        </div>
    );
};

const HeroSection: React.FC<HeroSectionProps> = ({ className = "" }) => {
    const [hoveredVideo, setHoveredVideo] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(0);

    // Sample video data
    const videoData: VideoData[] = [
        {
            id: 'v1',
            title: 'Getting Started with React Components',
            description: 'Learn the basics of React components and how to build your first app.',
            duration: '12:34',
            views: '125K',
            uploadDate: '2 days ago',
            creator: {
                name: 'CodeAcademy',
                verified: true,
                subscribers: '1.2M'
            },
            category: 'Tutorial',
            likes: '2.1K'
        },
        {
            id: 'v2',
            title: 'Advanced JavaScript Patterns',
            description: 'Deep dive into advanced JavaScript concepts and design patterns.',
            duration: '18:45',
            views: '89K',
            uploadDate: '1 week ago',
            creator: {
                name: 'JS Master',
                verified: false,
                subscribers: '456K'
            },
            category: 'Education',
            likes: '1.8K'
        },
        {
            id: 'v3',
            title: 'CSS Grid Layout Masterclass',
            description: 'Master CSS Grid with practical examples and real-world projects.',
            duration: '25:12',
            views: '203K',
            uploadDate: '3 days ago',
            creator: {
                name: 'DesignPro',
                verified: true,
                subscribers: '789K'
            },
            category: 'Design',
            likes: '3.2K'
        },
        {
            id: 'v4',
            title: 'Node.js Backend Development',
            description: 'Build scalable backend APIs with Node.js and Express.',
            duration: '32:18',
            views: '156K',
            uploadDate: '5 days ago',
            creator: {
                name: 'Backend Dev',
                verified: true,
                subscribers: '623K'
            },
            category: 'Backend',
            likes: '2.7K'
        },
        {
            id: 'v5',
            title: 'Mobile App UI/UX Design',
            description: 'Design beautiful and functional mobile app interfaces.',
            duration: '21:56',
            views: '98K',
            uploadDate: '1 week ago',
            creator: {
                name: 'UX Designer',
                verified: false,
                subscribers: '345K'
            },
            category: 'Design',
            likes: '1.9K'
        },
        {
            id: 'v6',
            title: 'TypeScript for Beginners',
            description: 'Learn TypeScript from scratch with hands-on examples.',
            duration: '16:43',
            views: '187K',
            uploadDate: '4 days ago',
            creator: {
                name: 'TypeScript Pro',
                verified: true,
                subscribers: '567K'
            },
            category: 'Programming',
            likes: '2.5K'
        },
        {
            id: 'v7',
            title: 'Web Performance Optimization',
            description: 'Optimize your web applications for better performance.',
            duration: '28:29',
            views: '134K',
            uploadDate: '6 days ago',
            creator: {
                name: 'Web Optimizer',
                verified: true,
                subscribers: '432K'
            },
            category: 'Performance',
            likes: '2.3K'
        },
        {
            id: 'v8',
            title: 'Database Design Fundamentals',
            description: 'Learn database design principles and best practices.',
            duration: '35:17',
            views: '76K',
            uploadDate: '1 week ago',
            creator: {
                name: 'DB Expert',
                verified: false,
                subscribers: '298K'
            },
            category: 'Database',
            likes: '1.4K'
        }
    ];

    const videosPerPage = 6;
    const totalPages = Math.ceil(videoData.length / videosPerPage);

    const getCurrentVideos = (): VideoData[] => {
        const start = currentPage * videosPerPage;
        return videoData.slice(start, start + videosPerPage);
    };

    const nextPage = (): void => {
        setCurrentPage((prev) => (prev + 1) % totalPages);
    };

    const prevPage = (): void => {
        setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
    };

    return (
        <section className={`bg-gray-50/50 py-12 ${className}`}>
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Featured Videos
                        </h2>
                        <p className="text-gray-600">
                            Discover the latest and most popular content from our creators
                        </p>
                    </div>
                    
                    {/* Navigation */}
                    <div className="hidden md:flex items-center space-x-2">
                        <button
                            type="button"
                            onClick={prevPage}
                            disabled={totalPages <= 1}
                            className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <span className="text-sm text-gray-500 px-3">
                            {currentPage + 1} of {totalPages}
                        </span>
                        <button
                            type="button"
                            onClick={nextPage}
                            disabled={totalPages <= 1}
                            className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronRight className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </div>

                {/* Video Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {getCurrentVideos().map((video) => (
                        <VideoCard
                            key={video.id}
                            video={video}
                            isHovered={hoveredVideo === video.id}
                            onHover={setHoveredVideo}
                        />
                    ))}
                </div>

                {/* Mobile Navigation */}
                <div className="md:hidden flex items-center justify-center space-x-4">
                    <button
                        type="button"
                        onClick={prevPage}
                        disabled={totalPages <= 1}
                        className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        <span className="text-sm font-medium">Previous</span>
                    </button>
                    <span className="text-sm text-gray-500">
                        {currentPage + 1} of {totalPages}
                    </span>
                    <button
                        type="button"
                        onClick={nextPage}
                        disabled={totalPages <= 1}
                        className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span className="text-sm font-medium">Next</span>
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>

                {/* View All Button */}
                <div className="text-center mt-8">
                    <button
                        type="button"
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 hover:scale-105"
                    >
                        Show more
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