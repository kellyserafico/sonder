# test_prompt_generator.py
import os
import requests
from dotenv import load_dotenv

def test_gemini_prompt_generator():
    """Test function to generate a shorter prompt with Gemini and print to console"""

    load_dotenv()

    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    
    if not GEMINI_API_KEY:
        print("Error: GEMINI_API_KEY not found in environment variables")
        return

    GEMINI_API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"

    headers = {
        "Content-Type": "application/json"
    }
    
    data = {
        "contents": [{
            "parts": [{
                "text": "Generate a brief, thought-provoking question for a social app that users will answer. The question should be concise (under 10 words if possible) while still encouraging personal reflection. Keep it engaging but short."
            }]
        }],
        "generationConfig": {
            "temperature": 0.7,
            "topK": 40,
            "topP": 0.95,
            "maxOutputTokens": 50,  # Reduced from 100 to 50
        }
    }

    print("Calling Gemini API...")
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
                
            print("\n=== Generated Prompt ===")
            print(prompt_text)
            print(f"Length: {len(prompt_text)} characters")
            print("========================")
            return prompt_text
        else:
            print(f"Error: API returned status code {response.status_code}")
            return None
    
    except Exception as e:
        print(f"Exception occurred: {e}")
        return None

if __name__ == "__main__":
    prompt = test_gemini_prompt_generator()
    if prompt:
        print("\nPrompt generation successful!")