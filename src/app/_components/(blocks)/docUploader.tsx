"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "~/components/ui/button";
import { Progress } from "~/components/ui/progress";
import { FileText, FileType, X } from "lucide-react";

interface BookUploaderProps {
  onUploadSuccess: (url: string) => void;
  initialFile?: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FILE_TYPES = {
  "application/pdf": [".pdf"],
  "application/msword": [".doc"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  "application/vnd.ms-powerpoint": [".ppt"],
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"],
};

export const BookUploader = ({ onUploadSuccess, initialFile }: BookUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialFile ?? null);

  const handleUpload = useCallback(async (fileToUpload: File) => {
    try {
      setUploading(true);
      setProgress(0);

      const formData = new FormData();
      formData.append('file', fileToUpload);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
      
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Upload failed');
      }

      setPreviewUrl(data.secure_url);
      onUploadSuccess(data.secure_url);
      setProgress(100);
    } catch (err) {
      console.error("Upload failed:", err);
      setError(
        err instanceof Error ? err.message : "File upload failed. Please try again."
      );
    } finally {
      setUploading(false);
    }
  }, [onUploadSuccess]);


  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (!selectedFile) return;

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError("File size exceeds 10MB limit");
      return;
    }

    setFile(selectedFile);
    setError(null);
    await handleUpload(selectedFile);
  }, [handleUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    multiple: false,
    maxSize: MAX_FILE_SIZE,
  });

  const removeFile = () => {
    setFile(null);
    setPreviewUrl(null);
    onUploadSuccess("");
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"}
          ${error ? "border-red-500 bg-red-50" : ""}`}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center gap-4">
          <FileType className="h-8 w-8 text-gray-500" />
          
          <div>
            <p className="font-medium">
              {isDragActive ? "Drop here" : "Drag & drop or click to upload"}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Supported formats: PDF, DOC, DOCX, PPT, PPTX (max 10MB)
            </p>
          </div>
          
          {file && (
            <div className="mt-4 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="text-sm">{file.name}</span>
            </div>
          )}
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {uploading && (
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-gray-500">Uploading... {progress}%</p>
        </div>
      )}

      {previewUrl && (
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              View Uploaded File
            </a>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={removeFile}
            disabled={uploading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};