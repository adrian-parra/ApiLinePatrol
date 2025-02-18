import { toAskGemini } from '../services/gemini.js';

export const correctText = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ 
        success: false, 
        message: 'Texto requerido para corrección' 
      });
    }

    const correctedText = await toAskGemini({ 
      message: text 
    });

    res.status(200).json({
      success: true,
      originalText: text,
      correctedText: correctedText
    });

  } catch (error) {
    console.error('Error en corrección de texto:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno al corregir texto' 
    });
  }
};

export const analyzeText = async (req, res) => {
  try {
    const { text, history } = req.body;

    if (!text) {
      return res.status(400).json({ 
        success: false, 
        message: 'Texto requerido para análisis' 
      });
    }

    const analyzedText = await toAskGeminiSoportes({ 
      message: text, 
      history
    });

    res.status(200).json({
      success: true,
      originalText: text,
      analyzedText: analyzedText
    });

  } catch (error) {
    console.error('Error en análisis de texto:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error interno al analizar texto',
      error: error.message
    });
  }
};