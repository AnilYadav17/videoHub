"use client";
import React, { useState} from 'react';
import {
    Video, 
    Edit3, 
    Camera, 
    Upload, 
    Play,
    Eye,
    Calendar,
    AlertCircle,
    CheckCircle,
    X,
    Settings,
    Mail,
    Grid3X3,
    List
} from 'lucide-react';
import FileUpload from '../components/FileUpload';
import Footer from '../components/Fotter';
import { UploadResponse } from '@imagekit/next';

// Type definitions
interface UserProfile {
    email: string;
    profilePhoto: string;
    name: string;
    joinDate: string;
    totalVideos: number;
    totalViews: number;
}

interface VideoItem {
    id: string;
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl: string;
    uploadDate: string;
    views: number;
    duration: string;
}

const ProfileDashboard: React.FC = () => {
    const [userProfile, setUserProfile] = useState<UserProfile>({
        email: 'user@example.com',
        profilePhoto: '/api/placeholder/150/150',
        name: 'John Doe',
        joinDate: '2024-01-15',
        totalVideos: 12,
        totalViews: 1542
    });

    const [userVideos, setUserVideos] = useState<VideoItem[]>([
        {
            id: '1',
            title: 'My First Video Tutorial',
            description: 'A comprehensive guide to getting started with video creation',
            videoUrl: '/api/placeholder/video',
            thumbnailUrl: '/api/placeholder/320/180',
            uploadDate: '2024-07-01',
            views: 245,
            duration: '5:32'
        },
        {
            id: '2',
            title: 'Advanced Tips and Tricks',
            description: 'Pro-level techniques for better video quality',
            videoUrl: '/api/placeholder/video',
            thumbnailUrl: '/api/placeholder/320/180',
            uploadDate: '2024-06-28',
            views: 412,
            duration: '8:45'
        },
        {
            id: '3',
            title: 'Behind the Scenes',
            description: 'See how I create my content',
            videoUrl: '/api/placeholder/video',
            thumbnailUrl: '/api/placeholder/320/180',
            uploadDate: '2024-06-25',
            views: 187,
            duration: '3:21'
        }
    ]);

    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [editForm, setEditForm] = useState({ name: userProfile.name, email: userProfile.email });
    const [uploading, setUploading] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [message, setMessage] = useState({ type: '', text: '' });

    // Handle profile photo upload
    const handleProfilePhotoUpload = (res: UploadResponse) => {
        console.log("Profile photo upload success:", res);
        setUserProfile(prev => ({ ...prev, profilePhoto: res.url ?? prev.profilePhoto }));
        setUploading(false);
        setMessage({ type: 'success', text: 'Profile photo updated successfully!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    // Handle profile update
    const handleProfileUpdate = async () => {
        try {
            // Simulate API call
            setUserProfile(prev => ({ ...prev, name: editForm.name, email: editForm.email }));
            setIsEditingProfile(false);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        }
    };

    // Format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Format views count
    const formatViews = (views: number) => {
        if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
        if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
        return views.toString();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-2 sm:py-4">
            <div className="max-w-6xl mx-auto px-2 sm:px-4">
                {/* Header */}
                <div className="text-center mb-3 sm:mb-4">
                    <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-1">
                        My Profile
                    </h1>
                    <p className="text-sm text-gray-600">Manage your account and content</p>
                </div>

                {/* Profile Section */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-200/50 mb-4">
                    <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                        {/* Profile Photo */}
                        <div className="relative">
                            <img
                                src={userProfile.profilePhoto}
                                alt="Profile"
                                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                            />
                            <div className="absolute bottom-0 right-0">
                                {!uploading ? (
                                    <FileUpload
                                        fileType='image'
                                        buttonText={
                                            <button className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-lg">
                                                <Camera className="w-3 h-3" />
                                            </button>
                                        }
                                        onSuccess={handleProfilePhotoUpload}
                                        onProgress={(percent) => {
                                            console.log("Profile photo upload progress: ", percent + "%");
                                            setUploading(true);
                                        }}
                                    />
                                ) : (
                                    <div className="p-2 bg-gray-400 rounded-full">
                                        <Camera className="w-3 h-3 text-white animate-pulse" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Profile Info */}
                        <div className="flex-1 text-center md:text-left">
                            {!isEditingProfile ? (
                                <>
                                    <h2 className="text-xl font-bold text-gray-800 mb-1">{userProfile.name}</h2>
                                    <div className="flex items-center justify-center md:justify-start text-gray-600 mb-2">
                                        <Mail className="w-4 h-4 mr-1" />
                                        <span className="text-sm">{userProfile.email}</span>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-3">
                                        Member since {formatDate(userProfile.joinDate)}
                                    </p>
                                    <button
                                        onClick={() => {
                                            setIsEditingProfile(true);
                                            setEditForm({ name: userProfile.name, email: userProfile.email });
                                        }}
                                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg text-sm hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center mx-auto md:mx-0"
                                    >
                                        <Edit3 className="w-4 h-4 mr-1" />
                                        Edit Profile
                                    </button>
                                </>
                            ) : (
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        value={editForm.name}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                        placeholder="Your name"
                                    />
                                    <input
                                        type="email"
                                        value={editForm.email}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                        placeholder="Your email"
                                    />
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={handleProfileUpdate}
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors flex items-center"
                                        >
                                            <CheckCircle className="w-4 h-4 mr-1" />
                                            Save
                                        </button>
                                        <button
                                            onClick={() => setIsEditingProfile(false)}
                                            className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700 transition-colors flex items-center"
                                        >
                                            <X className="w-4 h-4 mr-1" />
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div className="bg-blue-50 rounded-lg p-3">
                                <div className="text-xl font-bold text-blue-600">{userProfile.totalVideos}</div>
                                <div className="text-xs text-gray-600">Videos</div>
                            </div>
                            <div className="bg-indigo-50 rounded-lg p-3">
                                <div className="text-xl font-bold text-indigo-600">{formatViews(userProfile.totalViews)}</div>
                                <div className="text-xs text-gray-600">Views</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Videos Section */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-200/50">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                            <Video className="w-5 h-5 mr-2 text-blue-600" />
                            My Videos ({userVideos.length})
                        </h2>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg transition-colors ${
                                    viewMode === 'grid' 
                                        ? 'bg-blue-600 text-white' 
                                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                }`}
                            >
                                <Grid3X3 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg transition-colors ${
                                    viewMode === 'list' 
                                        ? 'bg-blue-600 text-white' 
                                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                }`}
                            >
                                <List className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {userVideos.length === 0 ? (
                        <div className="text-center py-12">
                            <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-600 mb-2">No videos uploaded yet</h3>
                            <p className="text-sm text-gray-500 mb-4">Start creating and sharing your content</p>
                            <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center mx-auto">
                                <Upload className="w-4 h-4 mr-2" />
                                Upload Video
                            </button>
                        </div>
                    ) : (
                        <div className={
                            viewMode === 'grid' 
                                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' 
                                : 'space-y-4'
                        }>
                            {userVideos.map((video) => (
                                <div key={video.id} className={`bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow ${
                                    viewMode === 'list' ? 'flex items-center space-x-4 p-4' : ''
                                }`}>
                                    <div className={`relative ${viewMode === 'list' ? 'w-32 h-18 flex-shrink-0' : ''}`}>
                                        <img
                                            src={video.thumbnailUrl}
                                            alt={video.title}
                                            className={`object-cover ${
                                                viewMode === 'list' 
                                                    ? 'w-full h-full rounded' 
                                                    : 'w-full h-36'
                                            }`}
                                        />
                                        <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 py-0.5 rounded">
                                            {video.duration}
                                        </div>
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/20 rounded">
                                            <Play className="w-8 h-8 text-white" />
                                        </div>
                                    </div>
                                    <div className={`p-3 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                                        <h3 className="font-medium text-gray-800 text-sm mb-1 line-clamp-2">{video.title}</h3>
                                        <p className="text-xs text-gray-600 mb-2 line-clamp-1">{video.description}</p>
                                        <div className="flex items-center justify-between text-xs text-gray-500">
                                            <div className="flex items-center space-x-3">
                                                <span className="flex items-center">
                                                    <Eye className="w-3 h-3 mr-1" />
                                                    {formatViews(video.views)}
                                                </span>
                                                <span className="flex items-center">
                                                    <Calendar className="w-3 h-3 mr-1" />
                                                    {formatDate(video.uploadDate)}
                                                </span>
                                            </div>
                                            <button className="text-blue-600 hover:text-blue-800 transition-colors">
                                                <Settings className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Messages */}
                {message.text && (
                    <div className={`mt-4 p-3 rounded-lg flex items-center space-x-2 ${
                        message.type === 'success' 
                            ? 'bg-green-50 border border-green-200' 
                            : 'bg-red-50 border border-red-200'
                    }`}>
                        {message.type === 'success' ? (
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        ) : (
                            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                        )}
                        <p className={`text-sm ${
                            message.type === 'success' ? 'text-green-700' : 'text-red-700'
                        }`}>
                            {message.text}
                        </p>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default ProfileDashboard;