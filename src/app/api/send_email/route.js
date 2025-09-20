// /app/api/send-confirmation/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(Re) {
  try {
    const { to, subject, name, phone, optionLabel } = await req.json();

    if (!to || !subject || !name || !optionLabel) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
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
      </div>
    `;

    await transporter.sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER,
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
