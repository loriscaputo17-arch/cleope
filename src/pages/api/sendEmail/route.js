// src/app/api/sendEmail/route.js

import nodemailer from 'nodemailer';

export async function POST(req) {
  const { to, subject, text, html } = await req.json();

  const transporter = nodemailer.createTransport({
    service: 'gmail',  
    auth: {
      user: 'cleope.events@gmail.com',
      pass: 'uldv msaz xkup xbls',
    },
  });

  try {
    // Invio dell'email
    const info = await transporter.sendMail({
      from: 'cleope.events@gmail.com', 
      to,
      subject,
      text,
      html,
    });

    return new Response(
      JSON.stringify({ message: 'Email inviata con successo', info }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Errore durante l\'invio dell\'email', details: error }),
      {
        status: 500,
      }
    );
  }
}
