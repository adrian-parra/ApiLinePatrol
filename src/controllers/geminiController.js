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