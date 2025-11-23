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
        user: "lorixyes@gmail.com",
        pass: "uyez ribm rypi rwdz",
      },
    });

const html = `
  <div style="font-family:Arial,Helvetica,sans-serif; background:#f0f0f0; color:#000; padding:30px; text-align:center">
    
    <h1 style="color:#000; text-transform:uppercase; letter-spacing:3px; margin-bottom:20px;">
      RSVP – Conferma la tua partecipazione
    </h1>

    <p style="font-size:16px; line-height:1.5; margin-bottom:20px;">
      Ciao <strong>${name}</strong>,<br/>
      ti sei iscritto in lista all'evento <strong>THE MERGE</strong> per l'<strong>11 Ottobre a Milano</strong>.
    </p>

    <p style="font-size:15px; margin-bottom:20px;">
      Dato l'alto numero di richieste ti chiediamo di <strong>confermare la tua partecipazione</strong>.
    </p>

    <!-- Bottone di conferma -->
    <div style="margin:30px 0;">
      <a href="https://cleopeofficial.com/themerge/confirmation?email=${encodeURIComponent(to)}"
         style="display:inline-block; padding:15px 30px; background:#28a745; color:#fff;
                font-size:16px; font-weight:bold; text-decoration:none; border-radius:6px;">
        SI, Confermo
      </a>
    </div>

    <p style="font-size:14px; line-height:1.5; margin-top:20px;">
      Per ottenere il <strong>QR Code</strong> da presentare all'ingresso<br/>
      è obbligatorio confermare la propria presenza.
    </p>

    <hr style="margin:40px auto; border:none; border-top:1px solid #ccc; width:80%;" />

    <p style="font-size:13px;">CLEOPE Team</p>

    <div style="margin-top:20px;">
      <a href="https://www.instagram.com/cleopeofficial" style="margin:0 8px; color:#000; text-decoration:none; font-weight:bold;">Instagram</a>
      <a href="https://www.tiktok.com/@cleopeofficial" style="margin:0 8px; color:#000; text-decoration:none; font-weight:bold;">TikTok</a>
      <a href="https://wa.me/+393513895086" style="margin:0 8px; color:#000; text-decoration:none; font-weight:bold;">WhatsApp</a>
    </div>
  </div>
`;

    await transporter.sendMail({
      from: "CLEOPE <cleope.events@gmail.com>",
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

