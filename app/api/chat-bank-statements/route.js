import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// AWS Bedrock RAG Integration
// Based on your aws.py implementation

export async function POST(request) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { question } = await request.json();
    
    if (!question) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 });
    }

    // Always use real AWS Bedrock RAG for bank statement analysis
    const response = await callRealAWSBedrockRAG(question, userId);
    
    return NextResponse.json(response);

  } catch (error) {
    console.error("Bank statement chat error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Mock simulation function removed - now using real AWS Bedrock RAG only

// Real AWS Bedrock integration
import { spawn } from 'child_process';

async function callAWSBedrockRAG(question, userId) {
  return new Promise((resolve, reject) => {
    // Call your AWS Bedrock API script
    const python = spawn('python3', ['/home/phantom/Desktop/ibm/aws_bedrock_api.py', question]);
    
    let response = '';
    let error = '';
    
    python.stdout.on('data', (data) => {
      response += data.toString();
    });
    
    python.stderr.on('data', (data) => {
      error += data.toString();
    });
    
    python.on('close', (code) => {
      if (code === 0) {
        try {
          const result = JSON.parse(response);
          resolve(result);
        } catch (e) {
          resolve({ answer: response.trim(), citations: null });
        }
      } else {
        reject(new Error(`AWS Bedrock error: ${error}`));
      }
    });
  });
}

// Direct AWS Bedrock RAG execution
async function callRealAWSBedrockRAG(question, userId) {
  try {
    console.log(`Calling AWS Bedrock RAG for user ${userId}: ${question}`);
    const realResponse = await callAWSBedrockRAG(question, userId);
    return realResponse;
  } catch (error) {
    console.error("AWS Bedrock RAG error:", error);
    
    // Return error response instead of falling back to mock
    return {
      answer: `I encountered an error connecting to AWS Bedrock: ${error.message}. Please ensure your AWS credentials are configured and the Knowledge Base is accessible.`,
      citations: null,
      success: false,
      error: error.message
    };
  }
}