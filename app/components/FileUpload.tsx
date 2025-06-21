"use client" // This component must be a client component

import {
    ImageKitAbortError,
    ImageKitInvalidRequestError,
    ImageKitServerError,
    ImageKitUploadNetworkError,
    upload,
} from "@imagekit/next";
import { useRef, useState } from "react";

interface FileUploadProps{
    onSuccess: (res:any) => void
    onProgress?: (progress:number) => void
    fileType?: "image" | "video"
}

const FileUpload = ({
    onSuccess,
    onProgress,
    fileType
}: FileUploadProps) => {
     
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    //optional validation
    const validateFile = (file: File) =>{
        if(fileType === "video"){
            if(!file.type.startsWith("/vidoe")){
                setError("Please upload a Valid video file")
            }
        }
        if(file.size > 100 * 1024 * 1024){
            setError("File size must be less than 100MB");   
        }
        return true;
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
         const file = e.target.files?.[0]

         if(!file || !validateFile(file)) return 

         setUploading(true)
         setError(null)

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
                    if(event.lengthComputable && onProgress){
                        const percent = (event.loaded / event.total) * 100;
                        onProgress(Math.round(percent));
                    }
                },
            });

            onSuccess(res);
         } catch (error) {
             // Handle specific error types provided by the ImageKit SDK.
            if (error instanceof ImageKitAbortError) {
                console.error("Upload aborted:", error.reason);
            } else if (error instanceof ImageKitInvalidRequestError) {
                console.error("Invalid request:", error.message);
            } else if (error instanceof ImageKitUploadNetworkError) {
                console.error("Network error:", error.message);
            } else if (error instanceof ImageKitServerError) {
                console.error("Server error:", error.message);
            } else {
                // Handle any other errors that may occur.
                console.error("Upload error:", error);
            }
         } finally {
            setUploading(false)
         }

    }

    return (
        <>
            <input 
              type="file"
              accept={fileType === "video" ? "video/*" : "image/*"}
              onChange={handleFileChange}
            />
            {uploading && (
                <span>Loading...</span>
            )}
        </>
    );
};

export default FileUpload;