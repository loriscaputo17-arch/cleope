import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import QRCode from "qrcode";

// Helper per ICS (CRLF obbligatori)
function buildICS({ uid, start, end, summary, description, location, url }) {
  const fmt = (d) =>
    d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "") + "Z";
  const dtstamp = fmt(new Date());

  const lines = [
    "BEGIN:VCALENDAR",
    "PRODID:-//CLEOPE//BREAKOUT//IT",
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

    // Dominio pubblico del progetto
    const baseUrl = "https://breakoutpeople.com";

    // Link QR per check-in e pagamento all’ingresso
    const qrData = `${baseUrl}/breakout/checkin?code=${encodeURIComponent(
      code
    )}&email=${encodeURIComponent(to)}`;

    const qrImageBuffer = await QRCode.toBuffer(qrData, {
      type: "png",
      margin: 1,
      width: 512,
      errorCorrectionLevel: "M",
    });

    // Evento: 22 novembre 2025 (Milano)
    // Orari indicativi (23:00 – 04:00, UTC → 22:00Z – 03:00Z)
    const startUtc = new Date(Date.UTC(2025, 10, 22, 22, 0, 0));
    const endUtc = new Date(Date.UTC(2025, 10, 23, 3, 0, 0));

    const summary = "BREAKOUT 22.11 Milan";
    const description =
      "Conferma di registrazione all’evento BREAKOUT. Ti ricordiamo che il QR Code è valido per l’ingresso e il pagamento in loco. Nei prossimi giorni riceverai un’email con la possibilità di completare il pagamento online a prezzo ridotto per un tempo limitato.";
    const location = "Milano – Location anonima.";
    const uid = `breakout-${code}@cleope.events`;

    const icsContent = buildICS({
      uid,
      start: startUtc,
      end: endUtc,
      summary,
      description,
      location,
      url: baseUrl + "/breakout",
    });

    const gcalLink = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      summary
    )}&dates=20251122T220000Z/20251123T030000Z&location=${encodeURIComponent(
      location
    )}&details=${encodeURIComponent(description)}`;

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "cleope.events@gmail.com",
        pass: "xjja kpor ibgs acor",
      },
    });

    const html = `
      <div style="font-family:Arial,Helvetica,sans-serif; background:#111; color:#fff; padding:40px; text-align:center;">
        <h1 style="text-transform:uppercase; letter-spacing:3px; font-size:24px; margin-bottom:10px;">
          BREAKOUT – INVITO UFFICIALE
        </h1>
        <p style="color:#bbb;">22 Novembre 2025 · Milano</p>

        <p style="margin:30px 0; font-size:16px;">
          Ciao <strong>${name}</strong>,<br/>
          la tua registrazione è stata <strong>confermata</strong><br/>
          Qui sotto trovi il tuo <strong>QR Code personale</strong> per l’ingresso.
        </p>

        <div style="margin:20px 0;">
          <img src="cid:qrcode" alt="QR Code" style="width:200px;"/>
          <p style="font-size:18px; font-weight:bold; margin-top:10px;">Codice: ${code}</p>
        </div>

        <div style="background:#1a1a1a; border:1px solid #333; padding:20px; text-align:left; max-width:440px; margin:20px auto; border-radius:8px;">
          <h3 style="margin:0 0 10px 0; color:#fff;">Dettagli Evento</h3>
          <ul style="list-style:none; padding:0; margin:0; font-size:14px; line-height:1.7; color:#ccc;">
            <li><strong>Evento:</strong> BREAKOUT – Secret Event</li>
            <li><strong>Data:</strong> Sabato 22 Novembre 2025</li>
            <li><strong>Orario:</strong> 23:00 – 04:00</li>
            <li><strong>Luogo:</strong> Milano (indirizzo verrà comunicato)</li>
          </ul>
          <p style="margin-top:12px; color:#dd0005;">
            Il QR Code è valido per il pagamento all’ingresso.<br/>
            Nei prossimi giorni riceverai una mail con la possibilità di completare il pagamento online a prezzo ridotto per un periodo limitato.
          </p>
        </div>

        <div style="margin-top:25px;">
          <a href="${gcalLink}"
             style="display:inline-block; background:#dd0005; color:#fff; padding:10px 20px; text-decoration:none; font-weight:bold; border-radius:4px;">
             Aggiungi al tuo calendario
          </a>
          <p style="font-size:12px; color:#888; margin-top:10px;">
            Per Apple/Outlook puoi usare l’allegato <strong>breakout.ics</strong>.
          </p>
        </div>

        <hr style="margin:40px auto; border:none; border-top:1px solid #333; width:80%;" />
        <p style="font-size:13px; color:#888;">
          Questo non è solo un evento.<br/>
          È BREAKOUT.
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: 'BREAKOUT <breakout.people@gmail.com>',
      to,
      subject: "Il tuo invito ufficiale – BREAKOUT",
      html,
      attachments: [
        {
          filename: "qrcode.png",
          content: qrImageBuffer,
          cid: "qrcode",
          contentType: "image/png",
        },
        {
          filename: "breakout.ics",
          content: icsContent,
          contentType: "text/calendar; charset=utf-8; method=REQUEST",
        },
      ],
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("SEND_INVITE ERROR:", err);
    return NextResponse.json(
      { error: "Invio dell’invito non riuscito" },
      { status: 500 }
    );
  }
}
