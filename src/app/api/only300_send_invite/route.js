import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import QRCode from "qrcode";

// Helper ICS (CRLF obbligatori)
function buildICS({ uid, start, end, summary, description, location, url }) {
  const fmt = (d) =>
    d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "") + "Z";
  const dtstamp = fmt(new Date());

  const lines = [
    "BEGIN:VCALENDAR",
    "PRODID:-//CLEOPE//ONLY300//IT",
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
  ];

  return lines.join("\r\n");
}

export async function POST(req) {
  try {
    const { to, name, code } = await req.json();
    if (!to || !name || !code) {
      return NextResponse.json({ error: "Campi mancanti" }, { status: 400 });
    }

    const baseUrl = "https://cleopeofficial.com";

    // QR personalizzato
    const qrData = `${baseUrl}/only300/checkin?code=${encodeURIComponent(
      code
    )}&email=${encodeURIComponent(to)}`;

    const qrImageBuffer = await QRCode.toBuffer(qrData, {
      type: "png",
      margin: 1,
      width: 512,
      errorCorrectionLevel: "M",
    });

    // 📍 Evento: 29 novembre 2025 — 22:30 → 00:00
    const startUtc = new Date(Date.UTC(2025, 10, 29, 21, 30, 0)); // 22:30 italiane
    const endUtc = new Date(Date.UTC(2025, 10, 30, 0, 0, 0)); // mezzanotte giorno dopo

    const summary = "ONLY300";
    const description =
      "Accesso confermato. Questo QR Code è richiesto per l’ingresso. A breve riceverai informazioni aggiuntive.";
    const location = "Milano — Location privata.";
    const uid = `only300-${code}@cleope.events`;

    // ICS attachment
    const icsContent = buildICS({
      uid,
      start: startUtc,
      end: endUtc,
      summary,
      description,
      location,
      url: baseUrl + "/only300",
    });

    // Google Calendar URL
    const gcalLink = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      summary
    )}&dates=${encodeURIComponent(
      "20251129T213000Z/20251130T000000Z"
    )}&location=${encodeURIComponent(
      location
    )}&details=${encodeURIComponent(description)}`;

    // Mail server
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "cleope.events@gmail.com",
        pass: "xjja kpor ibgs acor",
      },
    });

    // Email HTML
    const html = `
  <div style="font-family:Helvetica,Arial,sans-serif;background:#000;color:#fff;padding:40px;text-align:center;border:1px solid #222;">
    
    <h1 style="font-size:32px;letter-spacing:6px;color:#ff0000;font-weight:bold;margin-bottom:5px;">
      ONLY300
    </h1>

    <p style="color:#aaa;font-size:14px;margin-bottom:30px;">
      29.11.2025 · 22:30
    </p>

    <p style="font-size:16px;margin-bottom:30px;line-height:1.6;">
      Ciao <strong>${name}</strong>,<br/>
      il tuo accesso è stato <strong>aggiunto</strong>.<br/>
      Mostra questo QR Code all’ingresso.
    </p>

    <img src="cid:qrcode" style="width:200px;filter:drop-shadow(0 0 12px red);" />

    <p style="font-size:18px;margin-top:14px;font-weight:bold;color:#ff0000;">
      CODE: ${code}
    </p>

    <div style="margin-top:35px;">
      <a href="${gcalLink}" style="background:#ff0000;padding:12px 25px;color:#fff;text-decoration:none;font-weight:bold;letter-spacing:2px;">
        Aggiungi al calendario
      </a>
      <p style="font-size:11px;color:#777;margin-top:8px;">
        Per Apple/Outlook usa il file .ICS allegato.
      </p>
    </div>

    <hr style="border:0;border-top:1px solid #222;margin:40px auto;width:70%;" />

    <p style="font-size:13px;color:#666;letter-spacing:2px;text-transform:uppercase;">
      Non condividere questo codice.
    </p>
  </div>
`;

    await transporter.sendMail({
      from: "ONLY300 <only300@cleope.events>",
      to,
      subject: "ACCESSO RICEVUTO — ONLY300",
      html,
      attachments: [
        {
          filename: "qrcode.png",
          content: qrImageBuffer,
          cid: "qrcode",
        },
        {
          filename: "only300.ics",
          content: icsContent,
          contentType: "text/calendar; charset=utf-8; method=REQUEST",
        },
      ],
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("SEND_INVITE ERROR:", err);
    return NextResponse.json(
      { error: "Errore durante l'invio" },
      { status: 500 }
    );
  }
}
