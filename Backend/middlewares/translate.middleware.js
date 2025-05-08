// translateMiddleware.js
const { Translate } = (await import('@google-cloud/translate')).v2;
import dotenv from 'dotenv';
await dotenv.config();

// Create a singleton instance
const key = process.env.GOOGLE_TRANSLATE_API_KEY;
// Instantiates a client just once
const translate = new Translate({ key });

/**
 * Translates string values to the target language.
 * @param {string} text - The text to translate
 * @param {string} targetLang - Target language code (default: 'lt')
 * @returns {Promise<string>} Translated text
 */
const translateText = async (text, targetLang = 'lt') => {
  if (!text) return text;
  const [translated] = await translate.translate(text, targetLang);
  return translated;
};

export default translateText;
