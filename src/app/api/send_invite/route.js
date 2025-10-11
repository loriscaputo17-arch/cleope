import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import QRCode from "qrcode";

// Helper ICS
function buildICS({ uid, start, end, summary, description, location, url }) {
  const fmt = (d) =>
    d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "") + "Z";
  const dtstamp = fmt(new Date());
  return [
    "BEGIN:VCALENDAR",
    "PRODID:-//CLEOPE//THE MERGE//IT",
    "VERSION:2.0",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}${url ? "\\n" + url : ""}`,
    `LOCATION:${location}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export async function POST(req) {
  try {
    const { to, name, code } = await req.json();
    if (!to || !name || !code)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const baseUrl = "https://cleopeofficial.com";

    // QR Code personalizzato
    const qrData = `${baseUrl}/themerge/checkin?code=${encodeURIComponent(code)}&email=${encodeURIComponent(to)}`;
    const qrImageBuffer = await QRCode.toBuffer(qrData, {
      type: "png",
      margin: 1,
      width: 512,
      errorCorrectionLevel: "M",
    });

    const startUtc = new Date(Date.UTC(2025, 9, 11, 21, 30, 0));
    const endUtc = new Date(Date.UTC(2025, 9, 12, 2, 30, 0));
    const summary = "THE MERGE – Secret Party";
    const description =
      "Data l'elevata affluenza, ti invitiamo a presentarti in anticipo per facilitare l’ingresso. Capienza limitata.";
    const location = "Via Tortona, 27, 20144 Milano MI";
    const uid = `the-merge-${code}@cleope.events`;

    const icsContent = buildICS({
      uid,
      start: startUtc,
      end: endUtc,
      summary,
      description,
      location,
      url: baseUrl + "/themerge",
    });

    // ✅ SMTP Brevo
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: "7fbe29001@smtp-brevo.com", // 👈 il tuo "Login" SMTP Brevo
        pass: "xsmtpsib-350b3a0bb0aa9473cfda1fd8188c187c0ac0356518b5eaf6d9e98b02645f1072-ZxK1Q8GMLvqrOhRn", // API key Brevo
      },
    });

    const html = `
      <div style="font-family:Arial,Helvetica,sans-serif; background:#f0f0f0; padding:30px; text-align:center">
        <h1 style="text-transform:uppercase; letter-spacing:2px;">THE MERGE – INVITO UFFICIALE</h1>
        <p>Ciao <strong>${name}</strong>, la tua registrazione è confermata ✅.<br/>Ecco il tuo QR Code personale:</p>
        <div style="margin:20px 0;">
          <img src="cid:qrcode" alt="QR Code" style="width:200px;"/>
          <p style="font-size:18px; font-weight:bold; margin-top:10px;">Codice: ${code}</p>
        </div>
        <div style="background:#fff; border:1px solid #ccc; padding:15px; text-align:left; max-width:420px; margin:20px auto;">
          <h3>Dettagli Evento</h3>
          <p><strong>Data:</strong> Sabato 11 Ottobre 2025<br/>
          <strong>Orario:</strong> 23:30 – 04:30<br/>
          <strong>Luogo:</strong> ${location}</p>
        </div>
        <p style="font-size:13px; color:#444;">Trovi allegato l'evento per il tuo calendario (.ics)</p>
        <hr style="margin:30px auto; border:none; border-top:1px solid #ccc; width:80%;" />
        <p>Ti aspettiamo,<br/>CLEOPE Team</p>
      </div>
    `;

    await transporter.sendMail({
      from: 'CLEOPE <cleope.events@gmail.com>',
      to,
      subject: "Il tuo invito ufficiale – THE MERGE",
      html,
      attachments: [
        { filename: "qrcode.png", content: qrImageBuffer, cid: "qrcode" },
        {
          filename: "themerge.ics",
          content: icsContent,
          contentType: "text/calendar; charset=utf-8; method=REQUEST",
        },
      ],
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("SEND_INVITE ERROR:", err);
    return NextResponse.json({ error: "Failed to send invite" }, { status: 500 });
  }
}
