import os
import requests
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"

def generate_prompt():
    """Generate a daily prompt using Gemini AI"""
    
    headers = {
        "Content-Type": "application/json"
    }
    
    data = {
        "contents": [{
            "parts": [{
                "text": "Generate a thought-provoking question for a social app that users will answer. The question should encourage personal reflection and be answerable in a paragraph. Make it unique and engaging."
            }]
        }],
        "generationConfig": {
            "temperature": 0.7,
            "topK": 40,
            "topP": 0.95,
            "maxOutputTokens": 100,
        }
    }
    
    try:
        response = requests.post(
            GEMINI_API_URL,
            headers=headers,
            json=data
        )
        
        if response.status_code == 200:
            result = response.json()
            prompt_text = result["candidates"][0]["content"]["parts"][0]["text"]
            return prompt_text.strip()
        else:
            print(f"Gemini API error: {response.status_code} - {response.text}")
            return "What's something unexpected that brought you joy this week?"
    except Exception as e:
        print(f"Exception when calling Gemini API: {e}")
        return "What's something unexpected that brought you joy this week?"