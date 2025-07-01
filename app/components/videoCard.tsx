import React, { useState } from 'react';
import { 
    Play, 
    Heart,
    Bookmark,
    Eye,
    User,
    ThumbsUp
} from 'lucide-react';
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
        quality:number;
    }
} 

interface VideoCardProps {
    video: VideoData;
    isHovered: boolean;
    onHover: (_id: string | null | undefined) => void;
    className?: string;
    onClick: (video: VideoData) => void;
}


const VideoCard: React.FC<VideoCardProps> = ({ video, isHovered, onHover, className = "", onClick }) => {
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
    // const handleShare = (e: React.MouseEvent): void => {
    //     e.stopPropagation();
    //     console.log('Sharing video:', video._id);
    // };

    // const handleMoreOptions = (e: React.MouseEvent): void => {
    //     e.stopPropagation();
    //     console.log('More options for video:', video._id);
    // };

    return (
        <div 
            className={`group relative bg-white/95 backdrop-blur-xl rounded-lg sm:rounded-2xl shadow-lg sm:shadow-xl border border-gray-200/60 hover:border-blue-200/80 transition-all duration-300 cursor-pointer transform hover:scale-98 hover:shadow-2xl overflow-hidden ${className}`}
            onMouseEnter={() => onHover(video._id)}
            onMouseLeave={() => onHover(null)}
            onClick={() => onClick(video)}
        >
            {/* Thumbnail Section - Portrait for Shorts */}
            <div className="relative overflow-hidden rounded-t-lg sm:rounded-t-2xl aspect-[9/16] bg-gradient-to-br from-gray-100 to-gray-200">
                <img 
                    src={video.thumbnailUrl} 
                    alt={video.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        // Fallback to gradient background if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLDivElement;
                        if (fallback) {
                            fallback.style.display = 'flex';
                        }
                    }}
                />
                
                {/* Fallback gradient background */}
                <div 
                    className="absolute inset-0 w-full h-full hidden items-center justify-center text-white font-bold text-lg sm:text-2xl md:text-3xl"
                    style={{
                        // Use a fallback string if video._id is undefined
                        background: `linear-gradient(135deg, 
                            hsl(${(video._id ?? 'X').charCodeAt(0) * 50 % 360}, 70%, 60%), 
                            hsl(${((video._id ?? 'X').charCodeAt(0) * 50 + 80) % 360}, 70%, 70%))`
                    }}
                >
                    {video.title.charAt(0).toUpperCase()}
                </div>
                
                {/* Duration Badge */}
                <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 md:bottom-3 md:right-3 bg-black/90 backdrop-blur-md text-white text-[10px] sm:text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 md:px-2.5 md:py-1.5 rounded sm:rounded-md md:rounded-lg font-medium shadow-xl border border-white/20">
                    1:00
                </div>

                {/* Play Button Overlay */}
                <div className={`absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center transition-all duration-300 ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                }`}>
                    <button
                        type="button"
                        className="group/play w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-white/95 backdrop-blur-xl rounded-full flex items-center justify-center shadow-2xl hover:shadow-3xl border border-white/50 transition-all duration-300 hover:scale-110 hover:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/30"
                        onClick={() => onClick(video)}
                        aria-label="Play video"
                    >
                        <Play className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-700 ml-0.5 group-hover/play:text-blue-600 transition-colors duration-200" />
                    </button>
                </div>

                {/* Category Badge */}
                <div className="absolute top-1 left-1 sm:top-2 sm:left-2 md:top-3 md:left-3 bg-gradient-to-r from-blue-500/90 to-indigo-600/90 backdrop-blur-md text-white text-[10px] sm:text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 md:px-3 md:py-1.5 rounded-full font-semibold shadow-lg border border-white/20">
                    Shorts
                </div>
            </div>

            {/* Content - Reduced padding on small screens */}
            <div className="p-1 sm:p-2 md:p-3 lg:p-4">
                {/* Title */}
                <h3 className="font-bold text-gray-900 text-[10px] sm:text-xs md:text-sm lg:text-base mb-0.5 sm:mb-1 md:mb-2 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                    {video.title}
                </h3>

                {/* Creator */}
                <div className="flex items-center space-x-0.5 sm:space-x-1 md:space-x-2 mb-1 sm:mb-1.5 md:mb-3 min-w-0">
                    <div className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 md:w-5 md:h-5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2.5 md:h-2.5 text-white" />
                    </div>
                    <div className="flex items-center space-x-0.5 sm:space-x-1 min-w-0 flex-1">
                        <span className="text-[10px] sm:text-xs text-gray-600 font-medium truncate">{video.owner.email}</span>
                        {/* {video.creator.verified && (
                            <Verified className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3 text-blue-500 flex-shrink-0" />
                        )} */}
                    </div>
                </div>

                {/* Stats Row - Increased size for small screens */}
                <div className="inline-flex items-center space-x-1.5 sm:space-x-1.5 md:space-x-2 text-[10px] sm:text-xs text-gray-500 mb-1 sm:mb-1.5 md:mb-2">
                    <div className="flex items-center space-x-1 sm:space-x-1">
                        <Eye className="w-3.5 h-3.5 sm:w-5 sm:h-5 md:w-4 md:h-4 flex-shrink-0" />
                        <span className="truncate">111K</span>
                    </div>
                    <div className="flex items-center space-x-1 sm:space-x-1">
                        <ThumbsUp className="w-3.5 h-3.5 sm:w-5 sm:h-5 md:w-4 md:h-4 flex-shrink-0" />
                        <span className="truncate">11.1K</span>
                    </div>
                </div>
                
                {/* Action Buttons Row - Increased size for small screens */}
                <div className="inline-flex items-center px-3 justify-center space-x-1 sm:space-x-1">
                    {/* Like Button */}
                    <button
                        type="button"
                        onClick={toggleLike}
                        className={`flex-1 max-w-[40px] sm:max-w-[45px] md:max-w-[60px] p-1 sm:p-1 md:p-1.5 rounded sm:rounded-md md:rounded-lg transition-all duration-200 flex items-center justify-center ${
                            isLiked 
                                ? 'bg-red-50 text-red-600' 
                                : 'text-gray-500 hover:bg-gray-100 hover:text-red-500'
                        }`}
                        aria-label={isLiked ? "Unlike video" : "Like video"}
                    >
                        <Heart className={`w-3.5 h-3.5 sm:w-5 sm:h-5 md:w-4 md:h-4 ${isLiked ? 'fill-current' : ''}`} />
                    </button>

                    {/* Save Button */}
                    <button
                        type="button"
                        onClick={toggleSave}
                        className={`flex-1 max-w-[40px] sm:max-w-[45px] md:max-w-[60px] p-1 sm:p-1 md:p-1.5 rounded sm:rounded-md md:rounded-lg transition-all duration-200 flex items-center justify-center ${
                            isSaved 
                                ? 'bg-blue-50 text-blue-600' 
                                : 'text-gray-500 hover:bg-gray-100 hover:text-blue-500'
                        }`}
                        aria-label={isSaved ? "Remove from saved" : "Save video"}
                    >
                        <Bookmark className={`w-3.5 h-3.5 sm:w-5 sm:h-5 md:w-4 md:h-4 ${isSaved ? 'fill-current' : ''}`} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VideoCard;