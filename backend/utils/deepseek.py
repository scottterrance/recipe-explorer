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