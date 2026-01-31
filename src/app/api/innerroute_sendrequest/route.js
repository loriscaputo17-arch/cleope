import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { to, name } = await req.json();

    if (!to || !name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // SMTP (usa ENV in produzione)
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "cleope.events@gmail.com", 
        pass: "xjja kpor ibgs acor",
        //pass: "flnz zfec czbz rrgh",
      },
    });

    // EMAIL CONTENT
    const html = `
      <div style="font-family:Helvetica,Arial,sans-serif;background:#000;color:#fff;padding:48px;text-align:center;border:1px solid #222;">

        <h1 style="font-size:26px;letter-spacing:5px;font-weight:300;margin-bottom:8px;">
          THE INNER ROUTE
        </h1>

        <p style="color:#777;font-size:12px;margin-bottom:36px;letter-spacing:2px;text-transform:uppercase;">
          Part I · Shinto Milan - Corso Sempione, 30
        </p>

        <p style="font-size:15px;line-height:1.7;margin-bottom:32px;color:#ddd;">
          Dear <strong>${name}</strong>,<br/><br/>
          we have received your request and it is currently under review.<br/>
          Our team will contact you shortly with further details.
        </p>

        <div style="background:#0e0e0e;border:1px solid #222;padding:22px;margin:32px auto;max-width:420px;text-align:left;">
          <p style="font-size:13px;color:#fff;margin-bottom:12px;letter-spacing:1px;">
            Event Information
          </p>

          <ul style="list-style:none;padding:0;margin:0;font-size:13px;line-height:1.7;color:#bbb;">
            <li><strong>Dinner access:</strong> from 20:00</li>
            <li><strong>Post-dinner access:</strong> from 23:00</li>
            <li><strong>Post-dinner access before 00:30:</strong> €15 (drink included)</li>
            <li><strong>Post-dinner access after 00:30:</strong> €20 (drink included)</li>
          </ul>
        </div>

        <p style="font-size:13px;color:#bbb;margin-top:28px;line-height:1.6;">
          For dinner tables or post-dinner tables (from 23:00), please contact:<br/>
          <strong>+39 351 389 5086</strong><br/>
          or <strong>cleope.events@gmail.com</strong>
        </p>

        <hr style="border:0;border-top:1px solid #222;margin:40px auto;width:70%;" />

        <p style="font-size:11px;color:#555;letter-spacing:3px;text-transform:uppercase;">
          CLEOPE · VESPER BEACH CLUB<br/>
          The Inner Route
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: "THE INNER ROUTE <cleope.events@gmail.com>",
      to,
      subject: "Request Received — The Inner Route",
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("REQUEST RECEIVED EMAIL ERROR:", err);
    return NextResponse.json(
      { error: "Email delivery failed" },
      { status: 500 }
    );
  }
}
