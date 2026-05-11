import requests
import os
import json
from dotenv import load_dotenv

load_dotenv()

class DeepSeekClient:
    BASE_URL = "https://api.deepseek.com/v1"
    API_KEY = os.getenv('DEEPSEEK_API_KEY')

    @staticmethod
    def correct_food_name(user_input):
        try:
            if not DeepSeekClient.API_KEY:
                return {'corrected': user_input, 'was_corrected': False}, 200

            headers = {
                'Authorization': f'Bearer {DeepSeekClient.API_KEY}',
                'Content-Type': 'application/json'
            }

            prompt = f"""You are a food name correction assistant.
Take the user input and:
- Detect typos or misspellings in food names
- Correct them to the most likely proper spelling
- Handle multi-word dishes (e.g., "chiken tikka masala" → "chicken tikka masala")
- If completely unknown, return the original input unchanged
- Preserve the original meaning as much as possible

User input: "{user_input}"

Respond ONLY in this exact JSON format, nothing else:
{{
    "corrected": "corrected food name here",
    "was_corrected": true or false,
    "original": "original input here"
}}"""

            payload = {
                "model": "deepseek-chat",
                "messages": [
                    {"role": "user", "content": prompt}
                ],
                "max_tokens": 100,
                "temperature": 0.1
            }

            response = requests.post(
                DeepSeekClient.BASE_URL,
                headers=headers,
                json=payload,
                timeout=10
            )

            if response.status_code == 200:
                content = response.json()['choices'][0]['message']['content']
                # Clean response in case of markdown
                content = content.strip().replace('```json', '').replace('```', '').strip()
                result = json.loads(content)
                return result, 200
            else:
                # If API fails, return original input
                return {'corrected': user_input, 'was_corrected': False, 'original': user_input}, 200

        except Exception as e:
            print(f"DeepSeek error: {str(e)}")
            return {'corrected': user_input, 'was_corrected': False, 'original': user_input}, 200