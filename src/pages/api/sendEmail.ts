// src/pages/api/sendEmail.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Estrai i dati dal body della richiesta
    const { email, subject, body } = req.body;

    // Configurazione per inviare l'email tramite nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Puoi sostituirlo con un altro provider se necessario
      auth: {
        user: 'cleope.events@gmail.com',
        pass: 'uldv msaz xkup xbls',
      },
    });

    const mailOptions = {
      from: 'cleope.events@gmail.com', // La tua email
      to: email,                   // Email del destinatario
      subject: subject,            // Oggetto dell'email
      text: body,                  // Corpo dell'email
    };

    try {
      // Invio dell'email
      await transporter.sendMail(mailOptions);
      return res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ error: 'Failed to send email' });
    }
  } else {
    // Metodo HTTP non supportato
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
