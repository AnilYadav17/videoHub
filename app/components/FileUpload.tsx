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

interface FileUploadProps {
    onSuccess: (res: UploadResponse) => void;
    onProgress?: (progress: number) => void;
    fileType?: "image" | "video";
    className?: string;
    children?: React.ReactNode;
}

const FileUpload = ({
    onSuccess,
    onProgress,
    fileType = "image",
    className = "",
    children
}: FileUploadProps) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Optional validation
    const validateFile = (file: File) => {
        setError(null); // Clear previous errors
        
        if (fileType === "video") {
            if (!file.type.startsWith("video/")) { // Fixed typo: "/vidoe" to "video/"
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

        try {
            const authRes = await fetch("/api/auth/imagekit-auth");
            const auth = await authRes.json();

            const res = await upload({
                file,
                fileName: file.name,
                publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
                signature: auth.signature,
                expire: auth.expire,
                token: auth.token,
                onProgress: (event) => {
                    if (event.lengthComputable && onProgress) {
                        const percent = (event.loaded / event.total) * 100;
                        onProgress(Math.round(percent));
                    }
                },
            });
            
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
        }
    };

    const handleClick = () => {
        if (!uploading && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <div className={`relative ${className}`}>
            <input
                ref={fileInputRef}
                className="hidden"
                type="file"
                accept={fileType === "video" ? "video/*" : "image/*"}
                onChange={handleFileChange}
                disabled={uploading}
            />
            
            {/* Upload button/trigger */}
            <button
                type="button"
                onClick={handleClick}
                disabled={uploading}
                className=""
            >
                {children}
            </button>

            {/* Uploading indicator */}
            {uploading && (
                <div className="mt-2 flex items-center space-x-2 text-blue-600 text-sm">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                    <span>Uploading...</span>
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