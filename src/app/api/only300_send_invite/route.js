import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import QRCode from "qrcode";

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
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const baseUrl = "https://cleopeofficial.com";

    // QR Code payload
    const qrData = `${baseUrl}/only300/checkin?code=${encodeURIComponent(
      code
    )}&email=${encodeURIComponent(to)}`;

    const qrImageBuffer = await QRCode.toBuffer(qrData, {
      type: "png",
      margin: 1,
      width: 512,
      errorCorrectionLevel: "M",
    });

    // Event time (UTC aligned)
    const startUtc = new Date(Date.UTC(2025, 10, 29, 21, 30, 0));
    const endUtc = new Date(Date.UTC(2025, 10, 30, 0, 0, 0));

    const summary = "ONLY300";
    const description =
      "Access verified. This QR code is required for entry. Further instructions will follow.";
    const location = "Private Location — Milano";
    const uid = `only300-${code}@cleope.events`;

    // ICS attachment content
    const icsContent = buildICS({
      uid,
      start: startUtc,
      end: endUtc,
      summary,
      description,
      location,
      url: `${baseUrl}/only300`,
    });

    // Google Calendar link
    const gcalLink = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      summary
    )}&dates=${encodeURIComponent(
      "20251129T213000Z/20251130T000000Z"
    )}&location=${encodeURIComponent(
      location
    )}&details=${encodeURIComponent(description)}`;

    // SMTP
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "cleope.events@gmail.com",
        pass: "xjja kpor ibgs acor",
      },
    });

    // Email Body (HTML)
    const html = `
  <div style="font-family:Helvetica,Arial,sans-serif;background:#000;color:#fff;padding:40px;text-align:center;border:1px solid #221;">
    
    <h1 style="font-size:34px;letter-spacing:8px;color:#ff0000;font-weight:bold;margin-bottom:4px;">
      ONLY300
    </h1>

    <p style="color:#888;font-size:14px;margin-bottom:30px;">
      November 29th, 2025 · Milano
    </p>

    <p style="font-size:16px;margin-bottom:30px;line-height:1.6;">
      Hello <strong>${name}</strong>,<br/>
      your request has been <strong>received</strong>.<br/>
      Our team will reach out shortly for final confirmation.<br/>
    </p>

    <div style="margin-top:35px;">
      <a href="${gcalLink}" style="background:#ff0000;padding:14px 28px;color:#fff;text-decoration:none;font-weight:bold;letter-spacing:2px;">
        ADD TO CALENDAR
      </a>
      <p style="font-size:11px;color:#777;margin-top:10px;">
        Apple / Outlook users: use the attached calendar file (.ICS)
      </p>
    </div>

    <hr style="border:0;border-top:1px solid #222;margin:40px auto;width:70%;" />

    <p style="font-size:12px;color:#555;letter-spacing:2px;text-transform:uppercase;">
      Do not share this code.
    </p>
  </div>
`;

    await transporter.sendMail({
      from: "ONLY300 <only300@cleope.events>",
      to,
      subject: "REQUEST SUBMITTED — ONLY300",
      html,
      attachments: [
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
      { error: "Email delivery failed" },
      { status: 500 }
    );
  }
}
