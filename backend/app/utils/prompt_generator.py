import os
import requests
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"

def generate_prompt():
    """Generate a short daily prompt using Gemini AI"""
    
    headers = {
        "Content-Type": "application/json"
    }
    
    import random
    prompt_types = [
        "Generate a reflective question about personal growth that's 10-15 words.",
        "Create a brief question about relationships or connections between people.",
        "Devise a short question about life choices or decisions people make.",
        "Formulate a concise question about values or principles people hold.",
        "Craft a brief question about memories or nostalgia.",
        "Create a short question about hopes or aspirations."
    ]
    
    selected_prompt = random.choice(prompt_types)
    
    data = {
        "contents": [{
            "parts": [{
                "text": f"{selected_prompt} Make it thought-provoking and unique. Provide ONLY a single question."
            }]
        }],
        "generationConfig": {
            "temperature": 1.0,
            "topK": 90,
            "topP": 0.99,
            "maxOutputTokens": 60,
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
            prompt_text = prompt_text.strip()
            if len(prompt_text) > 100:
                prompt_text = prompt_text.split('.')[0] + '.'
            return prompt_text
        else:
            print(f"Gemini API error: {response.status_code} - {response.text}")
            return "What brought you joy today?"
    except Exception as e:
        print(f"Exception when calling Gemini API: {e}")
        return "What brought you joy today?"