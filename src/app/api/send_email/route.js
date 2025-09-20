// /app/api/send-confirmation/route.js
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { to, subject, name, phone, optionLabel } = await req.json();

    if (!to || !subject || !name || !optionLabel) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: 465,
      auth: {
        user: "cleope.events@gmail.com",
        pass: "zpyi vybi vlyk sumv",
      },
    });

    const html = `
      <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;line-height:1.6">
        <h2>Conferma prenotazione – CLEOPE</h2>
        <p>Ciao ${name},</p>
        <p>grazie per la tua richiesta. Ecco il riepilogo:</p>
        <ul>
          <li><strong>Evento:</strong> ${optionLabel}</li>
          <li><strong>Nome:</strong> ${name}</li>
          <li><strong>Telefono:</strong> ${phone}</li>
          <li><strong>Email:</strong> ${to}</li>
        </ul>
        <p>Ti aspettiamo! ✨</p>
         <p>Team Cleope</p>

         <a href="https://www.instagram.com/cleopeofficial">Seguici su Instagram</a>
        <a href="https://www.tiktok.com/@cleopeofficial">Seguici su TikTok</a>
        <a href="https://wa.me/+393513895086">Se hai domande per i prossimi eventi scrivici</a>

      </div>
    `;

    await transporter.sendMail({
      from: "CLEOPE <cleope.events@gmail.com>" || process.env.SMTP_USER,
      to,
      subject,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("MAIL ERROR:", err);
    return NextResponse.json({ error: "Mail send failed" }, { status: 500 });
  }
}
