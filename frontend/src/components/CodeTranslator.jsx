import { useState } from 'react';
import axios from 'axios';

const LANGUAGES = [
  'Python', 'JavaScript', 'Java', 'C++', 'Ruby', 'Go', 'Rust', 'Swift'
];

function CodeTranslator() {
  const [sourceLanguage, setSourceLanguage] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [translatedCode, setTranslatedCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTranslate = async () => {
    if (!sourceLanguage || !targetLanguage || !inputCode) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/translate', {
        code: inputCode,
        source_language: sourceLanguage,
        target_language: targetLanguage
      });

      setTranslatedCode(response.data.translated_code);
    } catch (error) {
      console.error('Translation error:', error);
      alert('Translation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="code-translator">
      <div className="input-section">
        <select 
          value={sourceLanguage} 
          onChange={(e) => setSourceLanguage(e.target.value)}
        >
          <option value="">Source Language</option>
          {LANGUAGES.map(lang => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>

        <select 
          value={targetLanguage} 
          onChange={(e) => setTargetLanguage(e.target.value)}
        >
          <option value="">Target Language</option>
          {LANGUAGES.map(lang => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>

        <textarea 
          placeholder="Enter your code here..." 
          value={inputCode}
          onChange={(e) => setInputCode(e.target.value)}
        />

        <button onClick={handleTranslate} disabled={loading}>
          {loading ? 'Translating...' : 'Translate'}
        </button>
      </div>

      <div className="output-section">
        <h3>Translated Code:</h3>
        <pre>{translatedCode || 'Translation will appear here'}</pre>
      </div>
    </div>
  );
}

export default CodeTranslator;