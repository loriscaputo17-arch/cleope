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
      secure: true,
      auth: {
        user: "lorixyes@gmail.com",
        pass: "uyez ribm rypi rwdz",
      },
    });

    const html = `
      <div style="font-family:Arial,Helvetica,sans-serif; background:#f0f0f0; color:#000; padding:30px; text-align:center">
        
        <h2 style="color:#000; text-transform:uppercase; letter-spacing:3px; margin-bottom:20px;">
          REMINDER THE MERGE | MILANO
        </h2>

        <p style="font-size:16px; line-height:1.5; margin-bottom:20px;">
          Ciao <strong>${name}</strong>!<br/>
          Stasera <strong>sabato 11 ottobre 2025</strong> ci vediamo al <strong>Superclub Milano</strong> – Via Tortona, 27, 20144 Milano MI.
        </p>

        <p style="font-size:15px; margin-bottom:20px; line-height:1.6;">
          <a href="https://maps.app.goo.gl/jeR2MNmYn8YbCrQE6" style="color:#000; font-weight:bold; text-decoration:none;">Clicca qui per la Location su Google Maps</a><br/>
          Apertura porte: <strong>ore 23:45</strong><br/>
          Ti consigliamo di arrivare in anticipo per l'elevata richiesta.
        </p>

        <hr style="margin:30px auto; border:none; border-top:1px solid #ccc; width:80%;" />

        <p style="font-size:15px; line-height:1.6; margin-bottom:20px;">
          Mostra il <strong>QR code</strong> all'ingresso e acquista il ticket alla porta.<br/>
          Entro l'<strong>01:00 → €15 con drink incluso</strong><br/>
          Dopo l'<strong>01:00 → €20 con drink incluso</strong>
        </p>

        <p style="font-size:15px; line-height:1.6; margin-bottom:20px;">
          Le liste rimarranno aperte ancora per poche ore per dare possibilità di aggiungere gli ultimi +1:<br/>
          <a href="https://www.cleopeofficial.com/themerge/11.10" style="color:#000; font-weight:bold;">https://www.cleopeofficial.com/themerge/11.10</a><br/>
          Dopo verranno chiuse definitivamente.
        </p>

        <p style="font-size:15px; line-height:1.6; margin-bottom:20px;">
          Ultimo tavolo disponibile per il prive.<br/>
          Conferma la tua presenza in lista per assicurarti l'ingresso.
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