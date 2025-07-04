"use client" // This component must be a client component

import {
    ImageKitAbortError,
    ImageKitInvalidRequestError,
    ImageKitServerError,
    ImageKitUploadNetworkError,
    upload,
    UploadResponse,
} from "@imagekit/next";
import { useState, useRef } from "react";
import { Upload, Image, Loader2 } from "lucide-react";

interface FileUploadProps {
    onSuccess: (res: UploadResponse) => void;
    onProgress?: (progress: number) => void;
    fileType?: "image" | "video";
    className?: string;
    buttonText?: string;
    disabled?: boolean;
}

const FileUpload = ({
    onSuccess,
    onProgress,
    fileType = "image",
    className = "",
    buttonText,
    disabled = false
}: FileUploadProps) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Optional validation
    const validateFile = (file: File) => {
        setError(null); // Clear previous errors
        
        if (fileType === "video") {
            if (!file.type.startsWith("video/")) {
                setError("Please upload a valid video file");
                return false;
            }
        } else if (fileType === "image") {
            if (!file.type.startsWith("image/")) {
                setError("Please upload a valid image file");
                return false;
            }
        }
        
        if (file.size > 100 * 1024 * 1024) {
            setError("File size must be less than 100MB");
            return false;
        }
        
        return true;
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        
        if (!file || !validateFile(file)) return;

        setUploading(true);
        setError(null);
        setUploadProgress(0);

        try {
            const authRes = await fetch("/api/imagekit-auth");
            const auth = await authRes.json();
            const res = await upload({
                file,
                fileName: file.name,
                publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
                signature: auth.authParams.signature,
                expire: auth.authParams.expire,
                token: auth.authParams.token,
                onProgress: (event) => {
                    if (event.lengthComputable) {
                        const percent = (event.loaded / event.total) * 100;
                        const roundedPercent = Math.round(percent);
                        setUploadProgress(roundedPercent);
                        if (onProgress) {
                            onProgress(roundedPercent);
                        }
                    }
                },
            });
            console.log(res)
            
            onSuccess(res);
            
            // Clear the input after successful upload
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            
        } catch (error) {
            // Handle specific error types provided by the ImageKit SDK
            if (error instanceof ImageKitAbortError) {
                console.error("Upload aborted:", error.reason);
                setError("Upload was aborted");
            } else if (error instanceof ImageKitInvalidRequestError) {
                console.error("Invalid request:", error.message);
                setError("Invalid request. Please try again.");
            } else if (error instanceof ImageKitUploadNetworkError) {
                console.error("Network error:", error.message);
                setError("Network error. Please check your connection.");
            } else if (error instanceof ImageKitServerError) {
                console.error("Server error:", error.message);
                setError("Server error. Please try again later.");
            } else {
                // Handle any other errors that may occur
                console.error("Upload error:", error);
                setError("An unexpected error occurred. Please try again.");
            }
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    const handleClick = () => {
        if (!uploading && !disabled && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const getButtonText = () => {
        if (buttonText) return buttonText;
        return fileType === "video" ? "Choose Video" : "Choose Image";
    };

    const getButtonIcon = () => {
        if (uploading) return <Loader2 className="w-4 h-4 mr-2 animate-spin" />;
        return fileType === "video" ? 
            <Upload className="w-4 h-4 mr-2" /> : 
            <Image className="w-4 h-4 mr-2" />;
    };

    return (
        <div className={`relative ${className}`}>
            <input
                ref={fileInputRef}
                className="hidden"
                type="file"
                accept={fileType === "video" ? "video/*" : "image/*"}
                onChange={handleFileChange}
                disabled={uploading || disabled}
            />
            
            {/* Minimalist Upload Button */}
            <button
                type="button"
                onClick={handleClick}
                disabled={uploading || disabled}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {getButtonIcon()}
                {uploading ? "Uploading..." : getButtonText()}
            </button>

            {/* Upload Progress Bar */}
            {uploading && (
                <div className="mt-3 w-full max-w-xs mx-auto">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                        <span>Uploading</span>
                        <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                        ></div>
                    </div>
                </div>
            )}

            {/* Error message */}
            {error && (
                <div className="mt-2 text-red-600 text-sm">
                    {error}
                </div>
            )}
        </div>
    );
};

export default FileUpload;