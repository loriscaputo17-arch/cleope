import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import QRCode from "qrcode";

// Helper per ICS (CRLF obbligatori)
function buildICS({ uid, start, end, summary, description, location, url }) {
  const fmt = (d) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "") + "Z";
  const dtstamp = fmt(new Date());

const lines = [
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
  `ATTACH;FMTTYPE=image/png:https://www.cleopeofficial.com/_next/image?url=https%3A%2F%2Ffirebasestorage.googleapis.com%2Fv0%2Fb%2Fcleope-80cdc.firebasestorage.app%2Fo%2Flocandine%252Fflyer1.png%3Falt%3Dmedia%26token%3D12c9eeca-14c1-4c5c-8899-77f69806ace4&w=828&q=75`,
  "END:VEVENT",
  "END:VCALENDAR",
];


  return lines.join("\r\n");
}

export async function POST(req) {
  try {
    const { to, name, code } = await req.json();
    if (!to || !name || !code) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // ⚠️ Sostituisci con il tuo dominio pubblico in produzione
    const baseUrl = "https://localhost:3001"; // es: https://themerge.yourdomain.com

    // Link che codifichiamo nel QR (check-in)
    const qrData = `${baseUrl}/themerge/checkin?code=${encodeURIComponent(
      code
    )}&email=${encodeURIComponent(to)}`;

    // ✅ SOLUZIONE 2: immagine inline (cid)
    const qrImageBuffer = await QRCode.toBuffer(qrData, {
      type: "png",
      margin: 1,
      width: 512,
      errorCorrectionLevel: "M",
    });

    // Event times (Europe/Rome: 11 Ott 2025 23:30 → 12 Ott 04:30)
    // In UTC: 21:30Z → 02:30Z
    const startUtc = new Date(Date.UTC(2025, 9, 11, 21, 30, 0));
    const endUtc   = new Date(Date.UTC(2025, 9, 12, 2, 30, 0));

    const summary = "THE MERGE – Secret Party";
    const description = "Data l'elevata affluenza, ti invitiamo a presentarti in anticipo per facilitare l’ingresso. Capienza limitata.";
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

    // Link Google Calendar (facoltativo, comodo su Gmail)
    const gcalLink = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      summary
    )}&dates=20251011T213000Z/20251012T023000Z&location=${encodeURIComponent(
      location
    )}&details=${encodeURIComponent(description)}`;

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "cleope.events@gmail.com",
        // Usa una ENV VAR in produzione: process.env.SMTP_PASS
        pass: "zpyi vybi vlyk sumv",
      },
    });

    const html = `
      <div style="font-family:Arial,Helvetica,sans-serif; background:#f0f0f0; padding:30px; text-align:center">
        <h1 style="color:#000; text-transform:uppercase; letter-spacing:2px;">THE MERGE – INVITO UFFICIALE</h1>

        <p>Ciao <strong>${name}</strong>,<br/>
        la tua conferma è stata registrata ✅.<br/>
        Ecco il tuo <strong>QR Code personale</strong> da mostrare all'ingresso.</p>

        <div style="margin:20px 0;">
          <img src="cid:qrcode" alt="QR Code" style="width:200px;"/>
          <p style="font-size:18px; font-weight:bold; margin-top:10px;">Codice: ${code}</p>
        </div>

        <div style="background:#fff; border:1px solid #ccc; padding:15px; text-align:left; max-width:420px; margin:20px auto;">
          <h3 style="margin:0 0 8px 0;">Dettagli Evento</h3>
          <ul style="list-style:none; padding:0; margin:0; font-size:14px; line-height:1.6;">
            <li><strong>Evento:</strong> ${summary}</li>
            <li><strong>Data:</strong> Sabato 11 Ottobre 2025</li>
            <li><strong>Orario:</strong> 23:30 – 04:30</li>
            <li><strong>Luogo:</strong> ${location}</li>
          </ul>
          <p style="color:#b00; margin-top:10px;">
            Data l'elevata affluenza, ti invitiamo a presentarti in anticipo per facilitare l’ingresso. Capienza limitata.
            Il ticket é acquistabile all'ingresso.
          </p>
        </div>

        <div style="margin-top:20px;">
          <a href="${gcalLink}"
             style="display:inline-block; background:#000; color:#fff; padding:10px 18px; text-decoration:none; font-weight:bold; border-radius:4px; margin-right:8px;">
             ➕ Aggiungi a Google Calendar
          </a>
          <span style="display:block; font-size:12px; color:#333; margin-top:10px;">
            Per Apple/Outlook trovi l'allegato <strong>themerge.ics</strong>.
          </span>
        </div>

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
        // QR inline
        {
          filename: "qrcode.png",
          content: qrImageBuffer,
          cid: "qrcode", // deve corrispondere all'img src="cid:qrcode"
          contentType: "image/png",
        },
        // ICS allegato
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
