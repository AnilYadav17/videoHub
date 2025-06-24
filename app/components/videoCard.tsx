"use client";
import React, { useState } from 'react';
import { 
    Play, 
    Clock, 
    Eye, 
    Heart, 
    Share2, 
    Bookmark,
    MoreVertical,
    Star
} from 'lucide-react';

// Type definitions
interface VideoCardProps {
    video: {
        id: number;
        title: string;
        description: string;
        thumbnail: string;
        duration: string;
        views: string;
        uploadDate: string;
        creator: {
            name: string;
            avatar: string;
            subscribers: string;
            verified: boolean;
        };
        rating?: number;
        category?: string;
    };
    variant?: 'default' | 'featured' | 'compact';
    className?: string;
    onVideoClick?: (videoId: number) => void;
    onCreatorClick?: (creatorName: string) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ 
    video, 
    variant = 'default',
    className = "",
    onVideoClick,
    onCreatorClick
}) => {
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [isSaved, setIsSaved] = useState<boolean>(false);
    const [showOptions, setShowOptions] = useState<boolean>(false);

    const handleVideoClick = (): void => {
        if (onVideoClick) {
            onVideoClick(video.id);
        }
        console.log('Playing video:', video.title);
    };

    const handleCreatorClick = (e: React.MouseEvent): void => {
        e.stopPropagation();
        if (onCreatorClick) {
            onCreatorClick(video.creator.name);
        }
        console.log('Visit creator:', video.creator.name);
    };

    const handleLike = (e: React.MouseEvent): void => {
        e.stopPropagation();
        setIsLiked(!isLiked);
    };

    const handleSave = (e: React.MouseEvent): void => {
        e.stopPropagation();
        setIsSaved(!isSaved);
    };

    const handleShare = (e: React.MouseEvent): void => {
        e.stopPropagation();
        console.log('Share video:', video.title);
    };

    const handleOptions = (e: React.MouseEvent): void => {
        e.stopPropagation();
        setShowOptions(!showOptions);
    };

    const getCardClasses = () => {
        const baseClasses = "bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/60 transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer overflow-hidden";
        
        switch (variant) {
            case 'featured':
                return `${baseClasses} col-span-2 row-span-2`;
            case 'compact':
                return `${baseClasses} h-64`;
            default:
                return baseClasses;
        }
    };

    return (
        <div 
            className={`${getCardClasses()} ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleVideoClick}
        >
            {/* Thumbnail Section */}
            <div className="relative overflow-hidden">
                <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className={`w-full transition-transform duration-500 ${
                        variant === 'featured' ? 'h-64 lg:h-80' : 
                        variant === 'compact' ? 'h-32' : 'h-48'
                    } object-cover ${isHovered ? 'scale-110' : 'scale-100'}`}
                />
                
                {/* Overlay on Hover */}
                <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                }`}>
                    <button className="p-4 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 hover:bg-white/30 transition-all duration-200 hover:scale-110">
                        <Play className="w-8 h-8 text-white fill-current" />
                    </button>
                </div>

                {/* Duration Badge */}
                <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm rounded-lg px-2 py-1">
                    <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-white" />
                        <span className="text-white text-sm font-medium">{video.duration}</span>
                    </div>
                </div>

                {/* Category Badge */}
                {video.category && (
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg px-3 py-1">
                        <span className="text-white text-sm font-semibold">{video.category}</span>
                    </div>
                )}

                {/* Featured Badge */}
                {variant === 'featured' && (
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg px-3 py-1">
                        <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-white fill-current" />
                            <span className="text-white text-sm font-semibold">Featured</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="p-6">
                {/* Creator Info */}
                <div className="flex items-center space-x-3 mb-4">
                    <button 
                        onClick={handleCreatorClick}
                        className="flex items-center space-x-3 hover:bg-gray-50 rounded-lg p-1 -m-1 transition-colors"
                    >
                        <img 
                            src={video.creator.avatar} 
                            alt={video.creator.name}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-100"
                        />
                        <div className="flex-1 text-left">
                            <div className="flex items-center space-x-1">
                                <h4 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                                    {video.creator.name}
                                </h4>
                                {video.creator.verified && (
                                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-xs">✓</span>
                                    </div>
                                )}
                            </div>
                            <p className="text-sm text-gray-600">{video.creator.subscribers} subscribers</p>
                        </div>
                    </button>

                    {/* Options Menu */}
                    <div className="relative">
                        <button 
                            onClick={handleOptions}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <MoreVertical className="w-5 h-5 text-gray-600" />
                        </button>
                        
                        {showOptions && (
                            <div className="absolute right-0 top-10 w-48 bg-white/95 backdrop-blur-xl rounded-xl shadow-xl border border-gray-200/60 py-2 z-20">
                                <button className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors">
                                    <Bookmark className="w-4 h-4 text-gray-600" />
                                    <span className="text-gray-700">Add to Playlist</span>
                                </button>
                                <button className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors">
                                    <Share2 className="w-4 h-4 text-gray-600" />
                                    <span className="text-gray-700">Share</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Video Title */}
                <h3 className={`font-bold text-gray-900 mb-3 line-clamp-2 hover:text-blue-600 transition-colors ${
                    variant === 'featured' ? 'text-xl lg:text-2xl' : 
                    variant === 'compact' ? 'text-sm' : 'text-lg'
                }`}>
                    {video.title}
                </h3>

                {/* Description (only for default and featured variants) */}
                {variant !== 'compact' && (
                    <p className={`text-gray-600 mb-4 line-clamp-2 ${
                        variant === 'featured' ? 'text-base' : 'text-sm'
                    }`}>
                        {video.description}
                    </p>
                )}

                {/* Stats */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{video.views}</span>
                        </div>
                        {video.rating && (
                            <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                <span>{video.rating}</span>
                            </div>
                        )}
                        <span>•</span>
                        <span>{video.uploadDate}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2">
                        <button 
                            onClick={handleLike}
                            className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${
                                isLiked 
                                    ? 'bg-red-100 text-red-600' 
                                    : 'hover:bg-gray-100 text-gray-600'
                            }`}
                        >
                            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                        </button>
                        
                        <button 
                            onClick={handleSave}
                            className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${
                                isSaved 
                                    ? 'bg-blue-100 text-blue-600' 
                                    : 'hover:bg-gray-100 text-gray-600'
                            }`}
                        >
                            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                        </button>
                        
                        <button 
                            onClick={handleShare}
                            className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-all duration-200 hover:scale-110"
                        >
                            <Share2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoCard;