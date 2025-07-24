"use client"
import React, { useState, useEffect } from 'react';
import {
    Video, 
    Upload, 
    Calendar,
    AlertCircle,
    CheckCircle,
    X,
    Mail,
} from 'lucide-react';
import VideoCard from '../components/videoCard';
import { VideoData } from '../components/videoCard';

// Type definitions
interface UserProfile {
    email: string;
    name: string;
    joinDate: string;
    totalVideos: number;
}

interface IUser {
    _id: string;
    name: string;
    email: string;
    createdAt: string;
    video: VideoData[];
}


const ProfileDashboard: React.FC = () => {
    const [userProfile, setUserProfile] = useState<UserProfile>({
        email: 'user@example.com',
        name: 'John Doe',
        joinDate: '2024-01-15',
        totalVideos: 3,
    });

    const [userVideos, setUserVideos] = useState<VideoData[]>([]);

    const [hoveredVideoId, setHoveredVideoId] = useState<string | null>(null);
    const [editingVideo, setEditingVideo] = useState<VideoData | null>(null);
    const [videoEditForm, setVideoEditForm] = useState({ title: '', description: '' });
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const fetchVideo = async (): Promise<void> => {
            try {
                const res = await fetch("/api/currUser");
                if (!res.ok) {
                    setMessage({type: "error", text: "failed to fetch user Information"})
                    throw new Error('Failed to fetch User Information');
                } 
                const data = await res.json();
                const user = Array.isArray(data) ? data[0] : data;

                if (!user || !user.email || !user.video) {
                    throw new Error('Invalid user data received');
                }

                setUserProfile({
                    email: user.email,
                    name: user.name,
                    joinDate: user.createdAt,
                    totalVideos: user.video.length,
                });
                setUserVideos(user.video);                
               
            } catch (error) {
                if (error instanceof Error) {
                    setMessage({type: "error", text: error.message})
                } else {
                    setMessage({type: "error", text: "Something went wrong"})
                }
            }
        }
        fetchVideo();
    }, []);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const showMessage = (type: string, text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    const handleVideoEdit = (video: VideoData) => {
        setEditingVideo(video);
        setVideoEditForm({ title: video.title, description: video.description });
    };

    const handleVideoUpdate = () => {
        if (!editingVideo) return;
        
        setUserVideos(prev => prev.map(video => 
            video._id === editingVideo._id 
                ? { ...video, title: videoEditForm.title, description: videoEditForm.description }
                : video
        ));
        setEditingVideo(null);
        showMessage('success', 'Video updated successfully!');
    };

    const handleVideoDelete = (video: VideoData) => {
        setUserVideos(prev => prev.filter(v => v._id !== video._id));
        setUserProfile(prev => ({ ...prev, totalVideos: prev.totalVideos - 1 }));
        showMessage('success', 'Video deleted successfully!');
    };

    const handleVideoClick = (video: VideoData) => {
        // Handle video play/navigation
        console.log('Playing video:', video.title);
    };

    const handleVideoHover = (videoId: string | null | undefined) => {
        setHoveredVideoId(videoId || null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 py-4">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent mb-2">
                        My Profile
                    </h1>
                    <p className="text-gray-600">Manage your account and content</p>
                </div>

                {/* Profile Header */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 mb-6">
                    <div className="flex flex-col lg:flex-row items-center lg:items-start lg:justify-between space-y-4 lg:space-y-0">
                        {/* Profile Info */}
                        <div className="text-center lg:text-left">
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">
                                {userProfile.name}
                            </h2>
                            
                            <div className="flex items-center justify-center lg:justify-start text-gray-600 mb-4">
                                <Mail className="w-4 h-4 mr-2" />
                                <span>{userProfile.email}</span>
                            </div>

                            <div className="flex items-center justify-center lg:justify-start text-gray-600 mb-4">
                                <Calendar className="w-4 h-4 mr-1" />
                                <span>Joined {formatDate(userProfile.joinDate)}</span>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex space-x-6">
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center border border-blue-200/50">
                                <div className="text-2xl font-bold text-blue-600 mb-1">
                                    {userProfile.totalVideos}
                                </div>
                                <div className="text-sm text-gray-600 flex items-center justify-center">
                                    <Video className="w-4 h-4 mr-1" />
                                    Videos
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Videos Section */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent flex items-center mb-6">
                        <Video className="w-6 h-6 mr-2 text-blue-600" />
                        My Videos ({userVideos.length})
                    </h2>

                    {userVideos.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Video className="w-12 h-12 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">No videos uploaded yet</h3>
                            <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                Start creating and sharing your content with the world
                            </p>
                            <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center mx-auto">
                                <Upload className="w-5 h-5 mr-2" />
                                Upload Your First Video
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                            {userVideos.map((video: VideoData) => (
                                <VideoCard
                                    key={video._id}
                                    video={video}
                                    isHovered={hoveredVideoId === video._id}
                                    onHover={handleVideoHover}
                                    onClick={handleVideoClick}
                                    onEdit={handleVideoEdit}
                                    onDelete={handleVideoDelete}
                                    showProfileActions={true}
                                    editForm={videoEditForm}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Video Edit Modal */}
                {editingVideo && (
                    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-800">Edit Video</h3>
                                <button
                                    onClick={() => setEditingVideo(null)}
                                    className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        value={videoEditForm.title}
                                        onChange={(e) => setVideoEditForm(prev => ({ ...prev, title: e.target.value }))}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                        placeholder="Enter video title"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={videoEditForm.description}
                                        onChange={(e) => setVideoEditForm(prev => ({ ...prev, description: e.target.value }))}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm h-24 resize-none"
                                        placeholder="Enter video description"
                                    />
                                </div>
                            </div>
                            
                            <div className="flex space-x-3 mt-6">
                                <button
                                    onClick={handleVideoUpdate}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center"
                                >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Save Changes
                                </button>
                                <button
                                    onClick={() => setEditingVideo(null)}
                                    className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Success/Error Messages */}
                {message.text && (
                    <div className={`fixed bottom-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-3 max-w-sm ${
                        message.type === 'success' 
                            ? 'bg-green-50 border border-green-200' 
                            : 'bg-red-50 border border-red-200'
                    }`}>
                        {message.type === 'success' ? (
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        ) : (
                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                        )}
                        <p className={`text-sm font-medium ${
                            message.type === 'success' ? 'text-green-700' : 'text-red-700'
                        }`}>
                            {message.text}
                        </p>
                        <button
                            onClick={() => setMessage({ type: '', text: '' })}
                            className={`p-1 rounded-full hover:bg-gray-100 transition-colors`}
                            aria-label="Close message"
                        >
                            <X className="w-4 h-4 text-gray-500" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileDashboard;