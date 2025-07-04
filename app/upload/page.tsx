"use client";
import React, { useState } from 'react';
import { 
    Upload, 
    X, 
    Play, 
    Image, 
    FileVideo, 
    AlertCircle,
    Camera,
    CheckCircle
} from 'lucide-react';
import FileUpload from '../components/FileUpload';
import { useRouter } from 'next/navigation';
import Footer from '../components/Fotter';
import { UploadResponse } from '@imagekit/next';

// Type definitions
interface VideoFile {
    file: File;
    preview: string;
    size: string;
    name: string;
}

interface ThumbnailFile {
    file: File;
    preview: string;
    name: string;
}

interface FormData {
    title: string;
    description: string;
}

const UploadVideoPage: React.FC = () => {
    const [videoFile, setVideoFile] = useState<VideoFile | null>(null);
    const [thumbnailFile, setThumbnailFile] = useState<ThumbnailFile | null>(null);
    const [formData, setFormData] = useState<FormData>({
        title: '',
        description: ''
    });
    const [errors, setErrors] = useState<{[key: string]: string}>({});
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string>('');
    const [uploadedThumbnailUrl, setUploadedThumbnailUrl] = useState<string>('');

    const [uploading, setUploading] = useState(false);

    const router = useRouter();

    // Format file size
    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Handle video upload success
    const handleVideoUploadSuccess = (res: UploadResponse) => {
        console.log("Video upload success:", res);
        const videoUrl = res.url ?? "";
        setUploadedVideoUrl(videoUrl);
    
        // Set the video file for UI preview
        const mockFile = new File([], res.name || "UploadedVideo");
        setVideoFile({
            file: mockFile,
            preview: videoUrl,
            size: formatFileSize(res.size || 0),
            name: res.name || "UploadedVideo"
        });
    
        // 🟢 If no custom thumbnail uploaded, generate one using ImageKit
        if (!thumbnailFile) {
            const defaultThumbUrl = `${videoUrl}/ik-thumbnail.jpg?tr=w-400,so-2`;
            setUploadedThumbnailUrl(defaultThumbUrl);
    
            const defaultThumbFile = new File([], "default-thumbnail.jpg");
            setThumbnailFile({
                file: defaultThumbFile,
                preview: defaultThumbUrl,
                name: "Auto-generated thumbnail"
            });
        }
    
       setErrors(prev => ({ ...prev, video: '' }));
    };

    // Handle thumbnail upload success
    const handleThumbnailUploadSuccess = (res: UploadResponse) => {
        console.log("Thumbnail upload success:", res);
        setUploadedThumbnailUrl(res.url ?? "");
        
        // Create a mock file object for display
        const mockFile = new File([], res.name || "UploadedThumbnail");
        setThumbnailFile({
            file: mockFile,
            preview: res.url ?? "", // Use the uploaded URL as preview
            name: res.name || "UploadedThumbnail"
        });
        setErrors(prev => ({ ...prev, thumbnail: '' }));
    };

    // Validate form
    const validateForm = (): boolean => {
        const newErrors: {[key: string]: string} = {};
        
        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }
        
        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        }
        
        if (!videoFile || !uploadedVideoUrl) {
            newErrors.video = 'Please upload a video file';
        }

        if (!uploadedThumbnailUrl) {
            newErrors.thumbnail = 'Failed to generate thumbnail';
        }

        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            const res = await fetch('/api/video', {
               method: 'POST',
               headers: {
                 'Content-Type': 'application/json',
               },
               body: JSON.stringify({ 
                   title: formData.title, 
                   description: formData.description, 
                   videoUrl: uploadedVideoUrl, 
                   thumbnailUrl: uploadedThumbnailUrl
               }),
            });

            const data = await res.json();
            console.log(data);
            if(!res.ok){
               setError(data.error || "Video Upload Failed")
               return;
            }
            setSuccess('Upload successful! Redirecting...');
            setTimeout(() => {
                router.push('/');
            }, 1200);
        } catch (error) {            
            console.error(error);
            setError('Server error. Please try again later.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-2 sm:py-4">
            <div className="max-w-6xl mx-auto px-2 sm:px-4">
                {/* Compact Header */}
                <div className="text-center mb-3 sm:mb-4">
                    <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-1">
                        Upload Video
                    </h1>
                    <p className="text-sm text-gray-600">Share your content with the world</p>
                </div>

                {/* Main Content */}
                <div className="space-y-3 sm:space-y-4">
                    {/* Video Upload & Thumbnail Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                        {/* Video Upload Section */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-gray-200/50">
                            <h2 className="text-base font-semibold text-gray-800 mb-2 flex items-center">
                                <FileVideo className="w-4 h-4 mr-2 text-blue-600" />
                                Video File
                            </h2>
                            
                            {!videoFile ? (
                                <div className="text-center py-2">
                                    <FileVideo className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                                    <p className="text-xs text-gray-700 mb-2">Select your video file</p>
                                    
                                    <FileUpload
                                        fileType='video'
                                        buttonText="Choose Video"
                                        onSuccess={(res) => {
                                            handleVideoUploadSuccess(res);
                                            setUploading(false);
                                        }}
                                        onProgress={(percent) => {
                                            console.log("Video upload progress: ", percent + "%");
                                            setUploading(true);
                                        }}
                                    />
                                    
                                    <p className="text-xs text-gray-500 mt-1">
                                        MP4, MOV, AVI, MKV
                                    </p>
                                </div>
                            ) : (
                                <div className="bg-gray-50 rounded-lg p-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <div className="relative">
                                                <video
                                                    src={videoFile.preview}
                                                    className="w-12 h-8 object-cover rounded"
                                                    controls={false}
                                                />
                                                <Play className="absolute inset-0 w-3 h-3 text-white m-auto" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-800 text-xs truncate max-w-20">{videoFile.name}</p>
                                                <p className="text-xs text-gray-600">{videoFile.size}</p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setVideoFile(null);
                                                setUploadedVideoUrl('');
                                            }}
                                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                                        >
                                            <X className="w-3 h-3 text-gray-500" />
                                        </button>
                                    </div>
                                </div>
                            )}
                            
                            {errors.video && (
                                <div className="mt-1 flex items-center text-red-600">
                                    <AlertCircle className="w-3 h-3 mr-1" />
                                    <span className="text-xs">{errors.video}</span>
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Section */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-gray-200/50">
                            <h2 className="text-base font-semibold text-gray-800 mb-2 flex items-center">
                                <Image className="w-4 h-4 mr-2 text-blue-600" />
                                Thumbnail
                            </h2>
                            
                            {!thumbnailFile ? (
                                <div className="text-center py-2">
                                    <Camera className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                                    <p className="text-xs text-gray-700 mb-2">Upload a custom thumbnail</p>
                                    
                                    <FileUpload
                                        fileType='image'
                                        buttonText="Choose Image"
                                        onSuccess={(res) => {
                                            handleThumbnailUploadSuccess(res);
                                            setUploading(false);
                                        }}
                                        onProgress={(percent) => {
                                            console.log("Thumbnail upload progress: ", percent + "%");
                                            setUploading(true);
                                        }}
                                    />
                                    
                                    <p className="text-xs text-gray-500 mt-1">
                                        JPG, PNG, GIF
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="bg-gray-50 rounded-lg p-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <img
                                                    src={thumbnailFile.preview}
                                                    alt="Thumbnail preview"
                                                    className="w-12 h-8 object-cover rounded"
                                                />
                                                <div>
                                                    <p className="font-medium text-gray-800 text-xs truncate max-w-20">{thumbnailFile.name}</p>
                                                    <p className="text-xs text-gray-600">Image uploaded</p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setThumbnailFile(null);
                                                    setUploadedThumbnailUrl('');
                                                }}
                                                className="p-1 hover:bg-gray-200 rounded transition-colors"
                                            >
                                                <X className="w-3 h-3 text-gray-500" />
                                            </button>
                                            {thumbnailFile?.name !== "Auto-generated thumbnail" && (
                                               <button
                                                   type="button"
                                                   onClick={() => {
                                                       if (uploadedVideoUrl) {
                                                          const defaultThumbUrl = `${uploadedVideoUrl}/ik-thumbnail.jpg?tr=w-400,so-2`;
                                                           setUploadedThumbnailUrl(defaultThumbUrl);
                                                           setThumbnailFile({
                                                               file: new File([], "default-thumbnail.jpg"),
                                                               preview: defaultThumbUrl,
                                                               name: "Auto-generated thumbnail"
                                                           });
                                                       }
                                                   }}
                                                   className="text-xs text-blue-500 underline mt-1"
                                               >
                                                   Use auto-generated thumbnail
                                               </button>
                                            )}
                                        </div>
                                    </div>
                                    {thumbnailFile?.name === "Auto-generated thumbnail" && (
                                        <span className="text-xs text-blue-600 mt-1 block italic">
                                            Auto-generated from video
                                        </span>
                                    )}
                                </>
                            )}

                            {errors.thumbnail && (
                                <div className="mt-1 flex items-center text-red-600">
                                    <AlertCircle className="w-3 h-3 mr-1" />
                                    <span className="text-xs">{errors.thumbnail}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Video Details */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-gray-200/50">
                        <h2 className="text-base font-semibold text-gray-800 mb-3">Video Details</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    placeholder="Enter video title..."
                                />
                                {errors.title && (
                                    <span className="text-xs text-red-600 mt-1 block">{errors.title}</span>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description *
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                                    placeholder="Describe your video..."
                                    rows={3}
                                />
                                {errors.description && (
                                    <span className="text-xs text-red-600 mt-1 block">{errors.description}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center">
                        <button
                            onClick={handleSubmit}
                            disabled={uploading}
                            className={`px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center ${
                                uploading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            <Upload className="w-5 h-5 mr-2" />
                            {uploading ? "Uploading..." : "Upload Video"}
                        </button>
                    </div>

                    {/* Error/Success messages */}
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <p className="text-green-700 text-sm">{success}</p>
                        </div>
                    )}
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default UploadVideoPage;