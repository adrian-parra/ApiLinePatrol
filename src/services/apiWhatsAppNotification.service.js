import fetch from 'node-fetch';

const ACCESS_TOKEN = "EAAHCmvyxZCekBO9m9pO1ZBXq8kd9PuAtjE1kYXARPqDUKj2mqPgqngh3eiKaVZCn6gwADDddylUYiyZC3Qy61FbClhNaZAvRNifukjze7EUd2dRqDrPaoyZCIZBZCcX72qFXR5kD1qqfUTwQKYblLxaRjyNtRHEjsWounjbcB6JBTRmqeFg1OTOntSrzCs7sjG7DZCduiZBmMbZBCy6Rn4M4NQwn7eB1IupMXynX8cByGfZADuTCJPbkdata";
const PHONE_NUMBER_ID = "458392434032506";
const RECIPIENT_PHONE = "526683972780"; // El número de WhatsApp del destinatario


// URL de la API de WhatsApp
const WHATSAPP_API_URL = `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`;


export const notifyFileChange = async ({userName, fileName, action, performedBy})=>{
    console.log(userName, fileName, action, performedBy)

    const templateData = {
        messaging_product: "whatsapp",
        to: RECIPIENT_PHONE,
        type: "template",
        template: {
          name: "file_change_notification",
          language: { code: "es_MX" },
          components: [
            {
              type: "body",
              parameters: [
               { type: 'text', text: userName },      // Nombre del usuario afectado
            { type: 'text', text: fileName },      // Nombre del archivo
            { type: 'text', text: action },        // Acción (subido o eliminado)
            { type: 'text', text: performedBy },   // Usuario que realizó la acción (por ejemplo, admin)
           ],
            },
          ],
        },
      };

      try {
        const response = await fetch(WHATSAPP_API_URL, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(templateData),
        });
    
        if (!response.ok) {
          console.log(response)
          throw new Error("Error al enviar la notificación");
        }
    
        const data = await response.json();
        console.log("Notificación enviada:", data);
      } catch (error) {
        console.error("Error:", error);
      }
}