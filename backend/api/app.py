from flask import Flask, request, jsonify
import os
import google.generativeai as genai
import re
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for development

# Configure the API key
genai.configure(api_key=os.getenv('AIzaSyBHzYmazATYFaXYhknplN29zY6NNVL5gao'))
model = genai.GenerativeModel(model_name='gemini-1.5-pro')

@app.route('/api/translate_code', methods=['POST'])
def translate_code():
    try:
        data = request.json
        input_code = data.get('code')
        source_language = data.get('source_language')
        target_language = data.get('target_language')

        if not input_code or not source_language or not target_language:
            return jsonify({"error": "Invalid input"}), 400

        prompt = (
            f"Translate the following code from {source_language} to {target_language}:"
            f"\n\n{input_code}"
        )
        
        response = model.generate_content(prompt)
        code_blocks = re.findall(r"```.*?\n(.*?)```", response.text, re.DOTALL)
        translated_code = code_blocks[0].strip() if code_blocks else response.text.strip()

        return jsonify({"translated_code": translated_code})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
