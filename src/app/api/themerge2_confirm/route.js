import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

/* ================= CALENDAR HELPER ================= */
function buildICS({ uid, start, end, summary, description, location, url }) {
  const fmt = (d) =>
    d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "") + "Z";

  const lines = [
    "BEGIN:VCALENDAR",
    "PRODID:-//CLEOPE//THE INNER ROUTE//IT",
    "VERSION:2.0",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${fmt(new Date())}`,
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
    const { to, name } = await req.json();

    if (!to || !name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    /* ================= EVENT DATA ================= */
    const EVENT_DATE_START = new Date(Date.UTC(2026, 1, 28, 22, 0)); // 20:00 CET
    const EVENT_DATE_END = new Date(Date.UTC(2026, 2, 1, 3, 0));   // 03:00 CET

    const summary = "THE MERGE 2 - 28.02 SUPERLCUB";
    const description =
      "You are on the guest list for THE MERGE 2. Give your name at the entrance.";
    const location = "SUPERCLUB Milano, Via Tortona 27, 20144";
    const uid = `themerge2-${to.replace(/[^a-zA-Z0-9]/g, "")}@cleope.events`;

    const baseUrl = "https://cleopeofficial.com";

    const icsContent = buildICS({
      uid,
      start: EVENT_DATE_START,
      end: EVENT_DATE_END,
      summary,
      description,
      location,
      url: `${baseUrl}/themerge2/qrcode`,
    });

    const gcalLink = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      summary
    )}&dates=20260207T190000Z/20260208T020000Z&location=${encodeURIComponent(
      location
    )}&details=${encodeURIComponent(description)}`;

    /* ================= SMTP ================= */
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "cleope.events@gmail.com",
        pass: "xjja kpor ibgs acor",
      },
    });

    /* ================= EMAIL ================= */
    const html = `
      <div style="font-family:Helvetica,Arial,sans-serif;background:#000;color:#fff;padding:48px;text-align:center;border:1px solid #222;">

        <h1 style="font-size:26px;letter-spacing:5px;font-weight:300;margin-bottom:8px;">
          THE MERGE 2 - 28.02
        </h1>

        <p style="color:#777;font-size:12px;margin-bottom:36px;letter-spacing:2px;text-transform:uppercase;">
         THE MERGE 2 · Superclub Milano · Via Tortona, 27
        </p>

        <p style="font-size:15px;line-height:1.7;margin-bottom:32px;color:#ddd;">
          Dear <strong>${name}</strong>,<br/><br/>
          your request has been <strong>approved</strong>.<br/>
          You are now officially <strong>on the guest list</strong> for<br/>
          <em>THE MERGE 2 - Superclub</em>.
        </p>

        <p style="font-size:14px;color:#bbb;line-height:1.6;margin-bottom:28px;">
          We look forward to welcoming you at the venue.<br/>
          At the entrance you can either:<br/>
          <strong>–Give your name to our staff</strong>
        </p>

        <div style="background:#0e0e0e;border:1px solid #222;padding:22px;margin:32px auto;max-width:440px;text-align:left;">
          <p style="font-size:13px;color:#fff;margin-bottom:12px;letter-spacing:1px;">
            Event Information
          </p>

          <ul style="list-style:none;padding:0;margin:0;font-size:13px;line-height:1.7;color:#bbb;">
            <li><strong>After Party Access:</strong> from 23:00</li>
            <li><strong>Entry before 00:30:</strong> €15 </li>
            <li><strong>Entry after 00:30:</strong> €20 </li>
          </ul>
        </div>

        <div style="margin-top:28px;">
          <a href="${gcalLink}"
             style="display:inline-block;border:1px solid #fff;color:#fff;padding:12px 26px;text-decoration:none;letter-spacing:3px;font-size:11px;text-transform:uppercase;">
            Add to Calendar
          </a>
          <p style="font-size:11px;color:#777;margin-top:10px;">
            Apple / Outlook users can use the attached calendar file.
          </p>
        </div>

        <p style="font-size:13px;color:#bbb;margin-top:28px;line-height:1.6;">
          For tables or access (from 23:00), please contact:<br/>
          <strong>+39 351 389 5086</strong><br/>
          or <strong>cleope.events@gmail.com</strong>
        </p>

        <hr style="border:0;border-top:1px solid #222;margin:40px auto;width:70%;" />

        <p style="font-size:11px;color:#555;letter-spacing:3px;text-transform:uppercase;">
          CLEOPE · ANIMA.ENT · DG SOCIETY · FOLIE<br/>
          THE MERGE 2
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: "THE MERGE 2 <cleope.events@gmail.com>",
      to,
      subject: "You are on the guest list — THE MERGE 2",
      html,
      attachments: [
        {
          filename: "the-merge-2.ics",
          content: icsContent,
          contentType: "text/calendar; charset=utf-8; method=REQUEST",
        },
      ],
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("INNER ROUTE CONFIRM EMAIL ERROR:", err);
    return NextResponse.json(
      { error: "Email delivery failed" },
      { status: 500 }
    );
  }
}
