/**
 * @module gemini
 * @description Este modulo es para interactuar con el modelo de gemini
 */
import fetch, { Headers } from 'node-fetch';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Hacer fetch y Headers globales
globalThis.fetch = fetch;
globalThis.Headers = Headers;

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
 systemInstruction: `Eres un corrector de texto profesional. Tus tareas son:
 1. Corregir errores ortográficos y gramaticales
 2. Mejorar la claridad y coherencia del texto
 3. Mantener el significado original
 4. Ser conciso y directo
 5. Usar un lenguaje formal pero natural
 6. No expandir el texto más allá de lo necesario
 7. Reemplazar todos los asteriscos (*) por el icono de estrella sólida (⭐)
 8. Reemplazar todos los dos puntos (:) por el icono de rombo con patrón (💠)

 
 Devuelve solo el texto corregido, sin explicaciones adicionales.`,
});

// const model = genAI.getGenerativeModel({
//   model: "gemini-2.0-flash-exp",
//   systemInstruction: `Eres un corrector de texto profesional especializado en mejora lingüística. Tus objetivos son:

// Corrección Técnica 💠
// ⭐ Identificar y corregir errores ortográficos
// ⭐ Rectificar construcciones gramaticales incorrectas
// ⭐ Verificar concordancia y coherencia sintáctica

// Mejora Estilística 💠
// ⭐ Optimizar la claridad del texto
// ⭐ Mantener el significado original del documento
// ⭐ Equilibrar formalidad y naturalidad

// Principios Fundamentales 💠
// ⭐ Ser conciso y directo
// ⭐ No expandir el texto más allá de lo estrictamente necesario
// ⭐ Preservar el tono y estilo original del documento

// Transformaciones Especiales 💠
// ⭐ Reemplazar asteriscos (*) por ⭐
// ⭐ Sustituir dos puntos (:) por 💠

// Restricciones 💠
// ⭐ No añadir información no presente en el texto original
// ⭐ Mantener la intención comunicativa

// Devuelve únicamente el texto corregido, sin explicaciones adicionales.`
// });


const generationConfig = {
  temperature: 0.3,  // Reducir para mayor precisión y consistencia
  topP: 0.8,         // Disminuir para resultados más predecibles
  topK: 20,          // Reducir el rango de tokens para mayor coherencia
  maxOutputTokens: 8192,  // Mantener, suficiente para textos largos
  responseMimeType: "text/plain",
};



/**
 * @param {string} message 
 * @param {Array<{role: string, parts: {text: string}}>} history 
 * @returns {Promise<string>}
 * @description Esta funcion es para corregir texto
 */
export async function toAskGemini({message, history}) {
  const chatSession = model.startChat({
    generationConfig,
    history: history || [],
  });

  try {
    const result = await chatSession.sendMessage(
      `Corrige el siguiente texto, mejorando su sintaxis, ortografía y claridad:\n\n${message}`
    );
    const textCorrected = result.response.text();
    return textCorrected.trim();
  } catch (error) {
    console.error("Error al corregir texto con Gemini:", error);
    return message; // Devolver texto original en caso de error
  }
}

