# test_prompt_generator.py
import os
import requests
from dotenv import load_dotenv

def test_gemini_prompt_generator():
    """Test function to generate a prompt with Gemini and print to console"""

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
                "text": "Generate a thought-provoking question for a social app that users will answer. The question should encourage personal reflection and be answerable in a paragraph. Make it unique and engaging."
            }]
        }],
        "generationConfig": {
            "temperature": 0.7,
            "topK": 40,
            "topP": 0.95,
            "maxOutputTokens": 50,
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
            print("\n=== Generated Prompt ===")
            print(prompt_text.strip())
            print("========================")
            return prompt_text.strip()
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