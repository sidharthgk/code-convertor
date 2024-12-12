from flask import Flask, request, jsonify
import os
import google.generativeai as genai
import re

app = Flask(__name__)

# Configure the API key
genai.configure(api_key=os.environ['API_KEY'])
model = genai.GenerativeModel(model_name='gemini-1.5-pro')

@app.route('/translate', methods=['POST'])
def translate_code():
    data = request.json
    input_code = data.get('code')
    source_language = data.get('source_language')
    target_language = data.get('target_language')

    prompt = (
        f"Translate the following code from {source_language} to {target_language}:"
        f"\n\n{input_code}"
    )
    
    response = model.generate_content(prompt)
    code_blocks = re.findall(r"```.*?\n(.*?)```", response.text, re.DOTALL)
    translated_code = code_blocks[0].strip() if code_blocks else response.text.strip()

    return jsonify({"translated_code": translated_code})

if __name__ == '__main__':
    app.run(debug=True)
