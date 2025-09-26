#!/usr/bin/env python3
"""
FastAPI server to serve the IBM Granite model for the chatbot.
This integrates with your existing main.py functionality.

To run this server:
1. pip install fastapi uvicorn
2. python fastapi_server.py
3. Update the Next.js API route to call http://localhost:8000/chat

Make sure you have the required dependencies from main.py:
- transformers
- torch
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sys
import os

# Add the parent directory to Python path to import main.py
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

try:
    from main import call_ibm_model
    MODEL_AVAILABLE = True
    print("✅ IBM Granite model loaded successfully")
except ImportError as e:
    print(f"⚠️  Could not import IBM model: {e}")
    print("📝 Running in mock mode - install required dependencies to use real model")
    MODEL_AVAILABLE = False
except Exception as e:
    print(f"⚠️  Model loading error (possibly CUDA memory): {e}")
    print("📝 Running in mock mode - try using CPU mode or free up GPU memory")
    MODEL_AVAILABLE = False

app = FastAPI(title="FinAdvisor Chat API", version="1.0.0")

# Add CORS middleware to allow requests from Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],  # Next.js dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    content: str

class ChatResponse(BaseModel):
    response: str

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """
    Chat endpoint that uses the IBM Granite model from main.py
    """
    try:
        if not request.content.strip():
            raise HTTPException(status_code=400, detail="Content cannot be empty")
        
        if MODEL_AVAILABLE:
            try:
                # Use the actual IBM Granite model
                response = call_ibm_model(request.content)
            except Exception as e:
                print(f"Model inference error: {e}")
                response = f"I apologize, but I'm experiencing technical difficulties with the AI model (possibly GPU memory issues). Here's a basic financial guidance response: For budgeting questions, consider the 50/30/20 rule. For investment advice, consult a financial advisor. Please try your question again or restart the server to free up resources."
        else:
            # Fallback response when model is not available
            response = f"[Mock Response] Thank you for your question: '{request.content}'. The IBM Granite model is not currently loaded due to technical issues (possibly CUDA memory). Please ensure you have sufficient GPU memory or try CPU mode."
        
        return ChatResponse(response=response)
    
    except Exception as e:
        print(f"Error processing chat request: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "model_available": MODEL_AVAILABLE,
        "message": "FinAdvisor Chat API is running"
    }

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "FinAdvisor Chat API",
        "model_status": "loaded" if MODEL_AVAILABLE else "mock_mode",
        "endpoints": {
            "chat": "/chat",
            "health": "/health"
        }
    }

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting FinAdvisor Chat API server...")
    print("📡 Server will be available at: http://localhost:8000")
    print("📋 API docs available at: http://localhost:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000)