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
        setUploadedVideoUrl(res.url ?? "");
        
        // Create a mock file object for display
        const mockFile = new File([], res.name || "UploadedVideo");
        setVideoFile({
            file: mockFile,
            preview: res.url ?? "", // Use the uploaded URL as preview
            size: formatFileSize(res.size || 0),
            name: res.name || "UploadedVideo"
        });
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

        if (!thumbnailFile || !uploadedThumbnailUrl) {
            newErrors.thumbnail = 'Please upload a thumbnail file';
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                        Upload Your Video
                    </h1>
                    <p className="text-gray-600">Share your content with the world</p>
                </div>

                <div className="space-y-6">
                    {/* Video Upload Section */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                            <FileVideo className="w-6 h-6 mr-2 text-blue-600" />
                            Video File
                        </h2>
                        
                        {!videoFile ? (
                            <div className="text-center py-4">
                                <FileVideo className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-700 mb-4">Select your video file</p>
                                
                                <FileUpload
                                    fileType='video'
                                    buttonText="Choose Video File"
                                    onSuccess={(res) => {
                                        handleVideoUploadSuccess(res);
                                        setUploading(false);
                                    }}
                                    onProgress={(percent) => {
                                        console.log("Video upload progress: ", percent + "%");
                                        setUploading(true);
                                    }}
                                />
                                
                                <p className="text-sm text-gray-500 mt-4">
                                    Supported formats: MP4, MOV, AVI, MKV
                                </p>
                            </div>
                        ) : (
                            <div className="bg-gray-50 rounded-xl p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="relative">
                                            <video
                                                src={videoFile.preview}
                                                className="w-24 h-16 object-cover rounded-lg"
                                                controls={false}
                                            />
                                            <Play className="absolute inset-0 w-6 h-6 text-white m-auto" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800">{videoFile.name}</p>
                                            <p className="text-sm text-gray-600">{videoFile.size}</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setVideoFile(null);
                                            setUploadedVideoUrl('');
                                        }}
                                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                                    >
                                        <X className="w-5 h-5 text-gray-500" />
                                    </button>
                                </div>
                            </div>
                        )}
                        
                        {errors.video && (
                            <div className="mt-2 flex items-center text-red-600">
                                <AlertCircle className="w-4 h-4 mr-1" />
                                <span className="text-sm">{errors.video}</span>
                            </div>
                        )}
                    </div>

                    {/* Video Details */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Video Details</h2>
                        
                        <div className="space-y-6">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter video title..."
                                />
                                {errors.title && (
                                    <span className="text-sm text-red-600 mt-1 block">{errors.title}</span>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description *
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                                    placeholder="Describe your video..."
                                    rows={4}
                                />
                                {errors.description && (
                                    <span className="text-sm text-red-600 mt-1 block">{errors.description}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Thumbnail Section */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                            <Image className="w-6 h-6 mr-2 text-blue-600" />
                            Thumbnail
                        </h2>
                        
                        {!thumbnailFile ? (
                            <div className="text-center py-4">
                                <Camera className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                                <p className="text-gray-700 font-medium mb-3">Upload a custom thumbnail</p>
                                
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
                                
                                <p className="text-sm text-gray-500 mt-3">
                                    Supported formats: JPG, PNG, GIF
                                </p>
                            </div>
                        ) : (
                            <div className="bg-gray-50 rounded-xl p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <img
                                            src={thumbnailFile.preview}
                                            alt="Thumbnail preview"
                                            className="w-24 h-16 object-cover rounded-lg"
                                        />
                                        <div>
                                            <p className="font-medium text-gray-800">{thumbnailFile.name}</p>
                                            <p className="text-sm text-gray-600">Image uploaded</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setThumbnailFile(null);
                                            setUploadedThumbnailUrl('');
                                        }}
                                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                                    >
                                        <X className="w-5 h-5 text-gray-500" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {errors.thumbnail && (
                            <div className="mt-2 flex items-center text-red-600">
                                <AlertCircle className="w-4 h-4 mr-1" />
                                <span className="text-sm">{errors.thumbnail}</span>
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center">
                        <button
                            onClick={handleSubmit}
                           disabled={uploading}
                            className={`px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center ${
                                uploading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            <Upload className="w-5 h-5 mr-2" />
                            {uploading ? "Uploading..." : "Upload Video"}
                        </button>

                    </div>
                    
                    {/* Error/Success messages */}
                    {error && (
                        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3 animate-fade-in">
                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center space-x-3 animate-fade-in">
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
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