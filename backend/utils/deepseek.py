import requests
import os
import json
from dotenv import load_dotenv

load_dotenv()

class DeepSeekClient:
    BASE_URL = "https://api.deepseek.com/chat/completions"

    @staticmethod
    def correct_food_name(user_input):
        api_key = os.getenv('DEEPSEEK_API_KEY')
        print(f"🔑 DeepSeek correcting: '{user_input}' | Key loaded: {'YES' if api_key else 'NO'}")

        if not api_key:
            print("⚠️ No DeepSeek key → returning original")
            return {'corrected': user_input, 'was_corrected': False, 'original': user_input}

        headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }

        prompt = f"""You are an expert food name corrector.
Fix spelling mistakes, typos, and return ONLY valid JSON.

User input: "{user_input}"

Return exactly this JSON format:
{{
    "corrected": "proper food name",
    "was_corrected": true or false,
    "original": "{user_input}"
}}"""

        payload = {
            "model": "deepseek-chat",
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": 150,
            "temperature": 0.0,
            "response_format": {"type": "json_object"}
        }

        try:
            response = requests.post(
                DeepSeekClient.BASE_URL,
                headers=headers,
                json=payload,
                timeout=12
            )

            if response.status_code == 200:
                content = response.json()['choices'][0]['message']['content']
                result = json.loads(content.strip())
                print(f"✅ DeepSeek corrected: '{user_input}' → '{result.get('corrected')}'")
                return result
            else:
                print(f"❌ DeepSeek API error {response.status_code}")
                return {'corrected': user_input, 'was_corrected': False, 'original': user_input}

        except Exception as e:
            print(f"DeepSeek exception: {e}")
            return {'corrected': user_input, 'was_corrected': False, 'original': user_input}
    
    @staticmethod
    def generate_recipes_from_ingredients(prompt):
        """Generate creative recipes from fridge ingredients"""
        api_key = os.getenv('DEEPSEEK_API_KEY')
        
        if not api_key:
            return [{"title": "AI temporarily unavailable", "description": "Please add your DeepSeek key in .env", "time": "5 min", "servings": 1, "difficulty": "Easy", "ingredients_used": [], "why_it_works": "Fallback mode"}]

        headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }

        payload = {
            "model": "deepseek-chat",
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": 800,
            "temperature": 0.7,
            "response_format": {"type": "json_object"}
        }

        try:
            response = requests.post(
                DeepSeekClient.BASE_URL,
                headers=headers,
                json=payload,
                timeout=20
            )

            if response.status_code == 200:
                content = response.json()['choices'][0]['message']['content']
                recipes = json.loads(content.strip())
                # Handle both array and object formats
                if isinstance(recipes, dict) and "recipes" in recipes:
                    return recipes["recipes"]
                return recipes if isinstance(recipes, list) else [recipes]
            else:
                print(f"DeepSeek fridge error: {response.status_code}")
                return []
        except Exception as e:
            print(f"Fridge AI exception: {e}")
            return []
    
    @staticmethod
    def chat_with_recipe(recipe_title, recipe_context, user_message):
        """AI Chatbot for a specific recipe"""
        api_key = os.getenv('DEEPSEEK_API_KEY')
        
        if not api_key:
            return "AI is temporarily unavailable. Please add your DeepSeek API key."

        headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }

        prompt = f"""You are a helpful, friendly cooking assistant.
Recipe: {recipe_title}

Context: {recipe_context}

User question: {user_message}

Answer in a short, friendly, and helpful way. Be creative and practical."""

        payload = {
            "model": "deepseek-chat",
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": 400,
            "temperature": 0.7
        }

        try:
            response = requests.post(
                DeepSeekClient.BASE_URL,
                headers=headers,
                json=payload,
                timeout=15
            )
            if response.status_code == 200:
                return response.json()['choices'][0]['message']['content'].strip()
            else:
                return "Sorry, I couldn't get an answer right now."
        except Exception as e:
            print(f"Chatbot error: {e}")
            return "Sorry, something went wrong with the AI."