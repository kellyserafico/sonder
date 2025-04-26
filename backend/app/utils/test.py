# test_prompt_generator.py
import os
import requests
import random
from dotenv import load_dotenv

def test_gemini_prompt_generator():
    """Test function to generate diverse, short prompts with Gemini and print to console"""

    load_dotenv()

    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    
    if not GEMINI_API_KEY:
        print("Error: GEMINI_API_KEY not found in environment variables")
        return

    GEMINI_API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"

    headers = {
        "Content-Type": "application/json"
    }
    
    prompt_types = [
        "Generate a reflective question about personal growth that's 10-15 words.",
        "Create a brief question about relationships or connections between people.",
        "Devise a short question about life choices or decisions people make.",
        "Formulate a concise question about values or principles people hold.",
        "Craft a brief question about memories or nostalgia.",
        "Create a short question about hopes or aspirations."
    ]
    
    selected_prompt = random.choice(prompt_types)
    print(f"Selected prompt type: {selected_prompt}")
    
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

    print("Calling Gemini API...")
    try:
        response = requests.post(
            GEMINI_API_URL,
            headers=headers,
            json=data
        )
        
        if response.status_code == 200:
            result = response.json()
            original_text = result["candidates"][0]["content"]["parts"][0]["text"]
            prompt_text = original_text.strip()
            
            print("\n=== Original Response ===")
            print(original_text)
            print("========================")
            
            if any(line.strip().startswith(('1.', '2.', '3.', '-', '•')) for line in prompt_text.split('\n')):
                print("Multiple options detected, selecting first option...")
                for line in prompt_text.split('\n'):
                    line = line.strip()
                    if line.startswith(('1.', '-', '•')) and len(line) > 2:
                        prompt_text = line.split('.', 1)[-1].strip() if '.' in line[:2] else line[1:].strip()
                        break
            
            if len(prompt_text) > 100 or prompt_text.count('.') > 1:
                print("Text too long or multiple sentences, taking first sentence...")
                sentences = prompt_text.split('.')
                prompt_text = sentences[0].strip() + '.'
                
            print("\n=== Processed Prompt ===")
            print(prompt_text)
            print(f"Length: {len(prompt_text)} characters")
            print(f"Word count: {len(prompt_text.split())}")
            print("========================")
            return prompt_text
        else:
            print(f"Error: API returned status code {response.status_code}")
            return None
    
    except Exception as e:
        print(f"Exception occurred: {e}")
        return None

def run_multiple_tests(count=5):
    """Run multiple tests to demonstrate variety in generated prompts"""
    print(f"\n=== RUNNING {count} CONSECUTIVE TESTS ===\n")
    
    results = []
    for i in range(count):
        print(f"\n--- Test #{i+1} ---")
        prompt = test_gemini_prompt_generator()
        if prompt:
            results.append(prompt)
        print("----------------")
    
    print("\n=== SUMMARY OF RESULTS ===")
    for i, prompt in enumerate(results):
        print(f"{i+1}. {prompt}")
    print("========================")

if __name__ == "__main__":
    run_multiple_tests(5)