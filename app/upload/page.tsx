"use client";
import React, { useState, useRef, useCallback } from 'react';
import { 
    Upload, 
    X, 
    Play, 
    Image, 
    FileVideo, 
    AlertCircle,
    Camera
} from 'lucide-react';
import FileUpload from '../components/FileUpload';

// Type definitions
interface VideoFile {
    file: File;
    preview: string;
    size: string;
}

interface ThumbnailFile {
    file: File;
    preview: string;
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
    const [dragActive, setDragActive] = useState<boolean>(false);
    const [errors, setErrors] = useState<{[key: string]: string}>({});

    const videoInputRef = useRef<HTMLInputElement>(null);
    const thumbnailInputRef = useRef<HTMLInputElement>(null);

    // Format file size
    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Handle video file selection
    const handleVideoUpload = useCallback((file: File) => {
        if (file && file.type.startsWith('video/')) {
            const url = URL.createObjectURL(file);
            setVideoFile({
                file,
                preview: url,
                size: formatFileSize(file.size)
            });
            setErrors(prev => ({ ...prev, video: '' }));
        } else {
            setErrors(prev => ({ ...prev, video: 'Please select a valid video file' }));
        }
    }, []);

    // Handle thumbnail file selection
    const handleThumbnailUpload = useCallback((file: File) => {
        if (file && file.type.startsWith('image/')) {
            const url = URL.createObjectURL(file);
            setThumbnailFile({
                file,
                preview: url
            });
            setErrors(prev => ({ ...prev, thumbnail: '' }));
        } else {
            setErrors(prev => ({ ...prev, thumbnail: 'Please select a valid image file' }));
        }
    }, []);

    // Handle drag and drop
    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith('video/')) {
                handleVideoUpload(file);
            }
        }
    }, [handleVideoUpload]);

    // Validate form
    const validateForm = (): boolean => {
        const newErrors: {[key: string]: string} = {};
        
        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }
        
        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        }
        
        if (!videoFile) {
            newErrors.video = 'Please upload a video file';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = () => {
        if (!validateForm()) return;
        
        // Here you would typically send the data to your backend
        console.log('Uploading video...', { formData, videoFile, thumbnailFile });
        console.log(videoFile);
        alert('Video uploaded successfully!');
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
                            <div
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                                    dragActive 
                                        ? 'border-blue-500 bg-blue-50' 
                                        : 'border-gray-300 hover:border-blue-400'
                                }`}
                            >
                                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-lg font-medium text-gray-700 mb-2">
                                    Drag and drop your video here
                                </p>
                                <p className="text-gray-500 mb-4">or</p>
                                <button
                                    type="button"
                                    onClick={() => videoInputRef.current?.click()}
                                    className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                                >
                                    Choose Video File
                                </button> 
                                <br />
                                <FileUpload
                                    fileType='video'
                                    onSuccess={(res) => {
                                      // res.url or res.filePath can be used
                                      const videoFile = {
                                        file: new File([], res.name || "UploadedVideo"),
                                        preview: res.url,
                                        size: formatFileSize(res.size || 0)
                                      };
                                    }}
                                    onProgress={(percent) => {
                                        console.log("upload progress: ", percent + "%");
                                    }                                       
                                    }
                                />
                                <input
                                    ref={videoInputRef}
                                    type="file"
                                    accept="video/*"
                                    onChange={(e) => e.target.files?.[0] && handleVideoUpload(e.target.files[0])}
                                    className="hidden"
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
                                            <p className="font-medium text-gray-800">{videoFile.file.name}</p>
                                            <p className="text-sm text-gray-600">{videoFile.size}</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setVideoFile(null)}
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
                            Thumbnail (Optional)
                        </h2>
                        
                        {!thumbnailFile ? (
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                                <Camera className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                                <p className="text-gray-700 font-medium mb-2">Upload a custom thumbnail</p>
                                <button
                                    type="button"
                                    onClick={() => thumbnailInputRef.current?.click()}
                                    className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                                >
                                    Choose Image
                                </button>
                                <input
                                    ref={thumbnailInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => e.target.files?.[0] && handleThumbnailUpload(e.target.files[0])}
                                    className="hidden"
                                />
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
                                            <p className="font-medium text-gray-800">{thumbnailFile.file.name}</p>
                                            <p className="text-sm text-gray-600">
                                                {formatFileSize(thumbnailFile.file.size)}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setThumbnailFile(null)}
                                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                                    >
                                        <X className="w-5 h-5 text-gray-500" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center">
                        <button
                            onClick={handleSubmit}
                            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center"
                        >
                            <Upload className="w-5 h-5 mr-2" />
                            Upload Video
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UploadVideoPage;