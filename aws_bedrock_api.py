#!/usr/bin/env python3
"""
AWS Bedrock RAG API wrapper for bank statement analysis.
Based on your aws.py implementation, but designed to be called from Next.js API.

Usage: python3 aws_bedrock_api.py "Your question here"
Returns: JSON response with answer and citations
"""

import os
import json
import sys
import boto3
from botocore.exceptions import ClientError

# Configuration from your aws.py
AWS_REGION = "us-east-1"
KB_ID = "I2UQSX77TF"  # Your Knowledge Base ID
MODEL_ARN = "amazon.nova-pro-v1:0"

def build_request(text, session_id=None):
    """Build the Bedrock request (same as your aws.py)"""
    kb_conf = {"knowledgeBaseId": KB_ID}
    if MODEL_ARN:
        kb_conf["modelArn"] = MODEL_ARN

    req = {
        "input": {"text": text},
        "retrieveAndGenerateConfiguration": {
            "type": "KNOWLEDGE_BASE",
            "knowledgeBaseConfiguration": kb_conf
        }
    }
    
    if session_id:
        req["sessionId"] = session_id
    return req

def extract_answer(resp):
    """Extract answer from response (same as your aws.py)"""
    out = resp.get("output")
    if not out:
        return None
    
    # Direct string
    if isinstance(out, str):
        return out
    
    # Dict cases
    if isinstance(out, dict):
        # Common key names
        for k in ("text", "content", "message"):
            v = out.get(k)
            if isinstance(v, str):
                return v
            if isinstance(v, dict) and isinstance(v.get("text"), str):
                return v.get("text")
        
        # Sometimes content is a list of chunks
        if "content" in out and isinstance(out["content"], list):
            parts = []
            for c in out["content"]:
                if isinstance(c, str):
                    parts.append(c)
                elif isinstance(c, dict):
                    t = c.get("text") or c.get("content")
                    if isinstance(t, str):
                        parts.append(t)
            if parts:
                return "\n".join(parts)
        
        # Messages array
        if "messages" in out and isinstance(out["messages"], list):
            for m in out["messages"]:
                if isinstance(m, dict):
                    if isinstance(m.get("content"), str):
                        return m.get("content")
                    if isinstance(m.get("content"), dict) and isinstance(m["content"].get("text"), str):
                        return m["content"]["text"]
    
    # Fallback scan for any string value
    for v in resp.values():
        if isinstance(v, str):
            return v
    return None

def process_question(question):
    """Process a single question and return JSON response"""
    try:
        # Initialize Bedrock client
        client_kwargs = {}
        if AWS_REGION:
            client_kwargs["region_name"] = AWS_REGION
        
        client = boto3.client("bedrock-agent-runtime", **client_kwargs)
        
        # Build and send request
        req = build_request(question)
        resp = client.retrieve_and_generate(**req)
        
        # Extract answer
        answer = extract_answer(resp)
        if not answer:
            answer = "Sorry, I couldn't extract a meaningful answer from the knowledge base."
        
        # Extract citations
        citations = resp.get("citations") or resp.get("retrievedReferences") or resp.get("retrieved_references")
        
        # Format response
        result = {
            "answer": answer,
            "citations": citations,
            "session_id": resp.get("sessionId"),
            "success": True
        }
        
        return result
        
    except ClientError as e:
        error_code = e.response['Error']['Code']
        error_message = e.response['Error']['Message']
        return {
            "answer": f"AWS Bedrock error: {error_message}",
            "citations": None,
            "success": False,
            "error_code": error_code
        }
    except Exception as e:
        return {
            "answer": f"Error processing your question: {str(e)}",
            "citations": None,
            "success": False,
            "error": str(e)
        }

def main():
    """Main function for command-line usage"""
    if len(sys.argv) < 2:
        print(json.dumps({
            "answer": "No question provided. Usage: python3 aws_bedrock_api.py 'Your question here'",
            "citations": None,
            "success": False
        }))
        sys.exit(1)
    
    question = " ".join(sys.argv[1:])
    
    # Check required environment
    if not KB_ID:
        print(json.dumps({
            "answer": "ERROR: Knowledge Base ID not configured",
            "citations": None,
            "success": False
        }))
        sys.exit(1)
    
    # Process question and return JSON
    result = process_question(question)
    print(json.dumps(result, indent=2, default=str))

if __name__ == "__main__":
    main()