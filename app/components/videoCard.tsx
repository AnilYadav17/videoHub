import React, { useState } from 'react';
import { 
    Play, 
    ChevronDown,
    X,
    User
} from 'lucide-react';
import { IUser } from '@/models/User';



// Type definitions
export  interface VideoData {
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
  onEdit?: (video: VideoData) => void;
  onDelete?: (video: VideoData) => void;
  showProfileActions?: boolean;
  editForm?: {
    title: string;
    description: string;
  };
}

// Description Popup Component
const DescriptionPopup: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description: string;
    owner: IUser;
}> = ({ isOpen, onClose, title, description, owner }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-2xl w-full max-h-[80vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 line-clamp-2 flex-1 mr-4">
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200"
                        aria-label="Close description"
                    >
                        <X className="w-4 h-4 text-gray-600" />
                    </button>
                </div>

                {/* Creator Info */}
                <div className="px-4 sm:px-6 py-3 bg-gray-50 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900">{owner.email}</p>
                            <p className="text-xs text-gray-500">Video Creator</p>
                        </div>
                    </div>
                </div>

                {/* Scrollable Description */}
                <div className="p-4 sm:p-6 max-h-96 overflow-y-auto custom-scrollbar">
                    <div className="prose prose-sm max-w-none">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {description}
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-4 sm:px-6 py-3 bg-gray-50 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

const VideoCard: React.FC<VideoCardProps> = ({ 
    video, 
    isHovered, 
    onHover, 
    className = "", 
    onClick, 
    onEdit, 
    onDelete, 
    showProfileActions, 
}) => {
    const [isDescriptionPopupOpen, setIsDescriptionPopupOpen] = useState<boolean>(false);

    const openDescriptionPopup = (e: React.MouseEvent): void => {
        e.stopPropagation();
        setIsDescriptionPopupOpen(true);
    };

    const closeDescriptionPopup = (): void => {
        setIsDescriptionPopupOpen(false);
    };

    // Helper function to truncate description
    const getTruncatedDescription = (text: string, maxLength: number = 50): string => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength).trim() + '...';
    };

    const handleEditClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onEdit) onEdit(video);
    };


   const handleDeleteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    try {
        const res = await fetch(`/api/video/${video._id}`, {
            method: "DELETE",
        });

        if (!res.ok) {
            throw new Error("Failed to delete video");
        }

        if (onDelete) {
            onDelete(video); // Remove it from UI
        }
    } catch (err) {
        console.error("Delete failed:", err);
        // Optional: Show error to user
    }
   };

    return (
        <>
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
                        </div>
                    </div>

                    {/* Description Section */}
                    <div className="mb-1 sm:mb-1.5 md:mb-3">
                        <div className="text-[10px] sm:text-xs text-gray-600 leading-relaxed">
                            <p>{getTruncatedDescription(video.description)}</p>
                        </div>
                        
                        {/* Show More Button - Opens Popup */}
                        {video.description && video.description.length > 50 && (
                            <button
                                type="button"
                                onClick={openDescriptionPopup}
                                className="flex items-center space-x-0.5 sm:space-x-1 text-[10px] sm:text-xs text-blue-600 hover:text-blue-700 font-medium mt-1 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 rounded px-1"
                                aria-label="Show full description"
                            >
                                <span>Show more</span>
                                <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            </button>
                        )}
                        {showProfileActions && onEdit && onDelete && (
                            <div className="flex justify-between mt-2 space-x-2">
                                <button
                                   onClick={handleEditClick}
                                    className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-white text-xs py-1 px-2 rounded-lg transition"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={handleDeleteClick}
                                    className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs py-1 px-2 rounded-lg transition"
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Description Popup */}
            <DescriptionPopup
                isOpen={isDescriptionPopupOpen}
                onClose={closeDescriptionPopup}
                title={video.title}
                description={video.description}
                owner={video.owner}
            />

            {/* Custom Scrollbar Styles */}
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f5f9;
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }
            `}</style>
        </>
    );
};

export default VideoCard;