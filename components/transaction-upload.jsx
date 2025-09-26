"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, CheckCircle, AlertCircle, X } from "lucide-react";
import { toast } from "sonner";

const TransactionUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    
    if (selectedFile) {
      // Validate file type
      if (selectedFile.type !== "application/pdf") {
        toast.error("Please select a PDF file");
        return;
      }
      
      // Validate file size (10MB limit)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }
      
      setFile(selectedFile);
      setUploadStatus(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    setUploading(true);
    setUploadStatus(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload-transactions", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();
      
      setUploadStatus("success");
      toast.success(`File uploaded to S3: ${result.s3Key}`);
      console.log(`✅ Uploaded to S3: s3://${result.s3Bucket}/${result.s3Key}`);
      
      // Reset form
      setFile(null);
      const fileInput = document.getElementById("transaction-file");
      if (fileInput) fileInput.value = "";
      
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus("error");
      toast.error("Failed to upload transaction data. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setUploadStatus(null);
    const fileInput = document.getElementById("transaction-file");
    if (fileInput) fileInput.value = "";
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Transaction Data
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          {!file ? (
            <div className="space-y-4">
              <FileText className="h-12 w-12 text-gray-400 mx-auto" />
              <div>
                <p className="text-lg font-medium">Upload your transaction PDF</p>
                <p className="text-sm text-gray-500 mt-1">
                  Bank statements, credit card statements, or transaction exports
                </p>
              </div>
              <div>
                <input
                  id="transaction-file"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById("transaction-file").click()}
                  className="gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Select PDF File
                </Button>
              </div>
              <p className="text-xs text-gray-400">
                Maximum file size: 10MB | Supported format: PDF
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2">
                <FileText className="h-8 w-8 text-blue-600" />
                <div className="text-left">
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={removeFile}
                  className="ml-auto"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {uploadStatus === "success" && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">Upload successful!</span>
                </div>
              )}
              
              {uploadStatus === "error" && (
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">Upload failed. Please try again.</span>
                </div>
              )}
            </div>
          )}
        </div>

        {file && (
          <div className="flex gap-2">
            <Button 
              onClick={handleUpload} 
              disabled={uploading}
              className="flex-1"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload to S3
                </>
              )}
            </Button>
            <Button variant="outline" onClick={removeFile} disabled={uploading}>
              Cancel
            </Button>
          </div>
        )}
        
        <div className="text-xs text-gray-500 space-y-1">
          <p>• Files stored in S3 bucket: <code>mybucketawsibm/data/</code></p>
          <p>• Encrypted and secured with AWS S3 server-side encryption</p>
          <p>• Automatically indexed for AI-powered financial analysis</p>
          <p>• Supported formats: PDF bank statements, credit card statements</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionUpload;