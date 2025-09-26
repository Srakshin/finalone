import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// AWS S3 Integration with real credentials
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Initialize S3 client with your credentials
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function POST(request) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get form data
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 });
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File size exceeds 10MB limit" }, { status: 400 });
    }

    // Upload to S3
    console.log(`Processing file: ${file.name}, Size: ${file.size}, User: ${userId}`);
    
    const s3Key = await uploadToS3(file, userId);

    return NextResponse.json({
      success: true,
      message: "Transaction data uploaded successfully to S3",
      fileName: file.name,
      size: file.size,
      s3Key: s3Key,
      s3Bucket: process.env.AWS_S3_BUCKET_NAME,
      uploadDate: new Date().toISOString()
    });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// S3 Upload Implementation (uncomment after installing @aws-sdk/client-s3)
/*
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function uploadToS3(file, userId) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = `transactions/${userId}/${Date.now()}-${file.name}`;
  
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: fileName,
    Body: buffer,
    ContentType: file.type,
    Metadata: {
      userId: userId,
      originalName: file.name,
      uploadDate: new Date().toISOString(),
    },
  });

  await s3Client.send(command);
  return fileName;
}
*/

// Real S3 upload function
async function uploadToS3(file, userId) {
  try {
    console.log(`Uploading file: ${file.name} for user: ${userId} to S3`);
    
    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Create S3 key with data folder structure: data/userId/timestamp-filename
    const timestamp = Date.now();
    const s3Key = `data/${userId}/${timestamp}-${file.name}`;
    
    // Upload to S3
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME, // mybucketawsibm
      Key: s3Key,
      Body: buffer,
      ContentType: file.type,
      Metadata: {
        userId: userId,
        originalName: file.name,
        uploadDate: new Date().toISOString(),
        fileSize: file.size.toString(),
      },
    });

    const result = await s3Client.send(command);
    console.log(`✅ File uploaded successfully to S3: ${s3Key}`);
    console.log(`📍 S3 Location: s3://${process.env.AWS_S3_BUCKET_NAME}/${s3Key}`);
    
    return s3Key;
  } catch (error) {
    console.error("❌ S3 upload error:", error);
    throw new Error(`Failed to upload to S3: ${error.message}`);
  }
}