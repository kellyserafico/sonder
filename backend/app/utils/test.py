import os
import requests
import random
import re
from dotenv import load_dotenv

def test_gemini_prompt_generator():
    """Test function to generate shorter, diverse prompts with Gemini"""

    load_dotenv()

    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    
    if not GEMINI_API_KEY:
        return None

    GEMINI_API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"

    headers = {
        "Content-Type": "application/json"
    }

    prompt_types = [
        "Generate a very short reflective question (maximum 10-12 words) about personal growth. The question must address 'you' not 'I' or 'me'.",
        "Create an extremely brief question (maximum 10-12 words) about relationships. The question must address 'you' not 'I' or 'me'.",
        "Devise a concise question (maximum 10-12 words) about life choices. The question must address 'you' not 'I' or 'me'.",
        "Formulate a short question (maximum 10-12 words) about values or principles. The question must address 'you' not 'I' or 'me'.",
        "Craft a brief question (maximum 10-12 words) about memories. The question must address 'you' not 'I' or 'me'.",
        "Create a compact question (maximum 10-12 words) about hopes or aspirations. The question must address 'you' not 'I' or 'me'."
    ]
    
    selected_prompt = random.choice(prompt_types)
    
    data = {
        "contents": [{
            "parts": [{
                "text": f"{selected_prompt} Make it thought-provoking and unique. Provide ONLY a single question. Keep it VERY short - ideally under 10 words, maximum 12 words. The question MUST be addressed to 'you' and NEVER use 'I' or 'me'."
            }]
        }],
        "generationConfig": {
            "temperature": 1.0,
            "topK": 90,
            "topP": 0.99,
            "maxOutputTokens": 40,
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
            prompt_text = result["candidates"][0]["content"]["parts"][0]["text"].strip()

            if any(line.strip().startswith(('1.', '2.', '3.', '-', '•')) for line in prompt_text.split('\n')):
                for line in prompt_text.split('\n'):
                    line = line.strip()
                    if line.startswith(('1.', '-', '•')) and len(line) > 2:
                        prompt_text = line.split('.', 1)[-1].strip() if '.' in line[:2] else line[1:].strip()
                        break

            prompt_text = prompt_text.replace('?.', '?')

            if '?' in prompt_text:
                prompt_text = prompt_text.split('?')[0] + '?'
            elif '.' in prompt_text:
                prompt_text = prompt_text.split('.')[0] + '.'

            prompt_text = prompt_text.lstrip('123456789.- •').strip()

            if not (prompt_text.endswith('.') or prompt_text.endswith('?')):
                if '?' in prompt_text:
                    prompt_text += '?'
                else:
                    prompt_text += '.'
            
            words = re.findall(r'\b\w+\b', prompt_text.lower())
            if 'i' in words or 'me' in words or 'my' in words or "i'm" in words or "i've" in words:
                fallback_questions = [
                    "What value guides your decisions most?",
                    "Which memory would you relive if possible?",
                    "Who shaped your worldview most profoundly?",
                    "How have your priorities shifted over time?",
                    "What unexpected lesson changed you?",
                    "Which decision would you remake differently?"
                ]
                prompt_text = random.choice(fallback_questions)
            
            word_count = len(prompt_text.split())
            if word_count > 12:
                for unnecessary_phrase in ['do you think', 'in your opinion', 'according to you', 'in your experience', 
                                          'would you say', 'would you agree', 'do you believe', 'do you feel',
                                          'do you find', 'to you', 'for you']:
                    if unnecessary_phrase in prompt_text.lower():
                        prompt_text = prompt_text.lower().replace(unnecessary_phrase, '').strip().capitalize()
                        break
                
                if len(prompt_text.split()) > 12:
                    fallback_questions = [
                        "What shapes your core values?",
                        "Which memory changed you most?",
                        "Who influences your decisions?",
                        "How have you evolved recently?",
                        "What unexpected wisdom guides you?",
                        "Which choice defines you?"
                    ]
                    prompt_text = random.choice(fallback_questions)
                
            return prompt_text
        else:
            return "What brought you joy today?"
    
    except Exception:
        return "What brought you joy today?"

def run_multiple_tests(count=5):
    """Run multiple tests to demonstrate variety in generated prompts"""
    
    results = []
    for i in range(count):
        prompt = test_gemini_prompt_generator()
        if prompt:
            results.append(prompt)
    
    print("\n=== GENERATED PROMPTS ===")
    for i, prompt in enumerate(results):
        print(f"{i+1}. {prompt}")
    print("========================")

if __name__ == "__main__":
    run_multiple_tests(5)