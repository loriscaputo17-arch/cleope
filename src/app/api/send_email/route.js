

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
        user: "cleope.events@gmail.com",
        pass: "zpyi vybi vlyk sumv",
      },
    });

const html = `
  <div style="font-family:Arial,Helvetica,sans-serif; background:#f0f0f0; color:#000; padding:30px; text-align:center">
    
    <h1 style="color:#000; text-transform:uppercase; letter-spacing:3px; margin-bottom:20px;">
      RSVP Confirmation – THE MERGE
    </h1>

    <p style="font-size:16px; line-height:1.5; margin-bottom:20px;">
      Hi <strong>${name}</strong>,<br/>
      we’ve received your RSVP for the secret party.<br/>
      You’re officially on the <strong>waiting list</strong>.
    </p>

    <div style="background:#fff; border:1px solid #ccc; padding:20px; margin:20px auto; max-width:400px; text-align:left;">
      <h3 style="margin-top:0; font-size:16px; font-weight:bold;">Your details</h3>
      <ul style="list-style:none; padding:0; margin:0; font-size:14px; line-height:1.6;">
        <li><strong>Event:</strong> ${optionLabel}</li>
        <li><strong>Name:</strong> ${name}</li>
        <li><strong>Phone:</strong> ${phone}</li>
        <li><strong>Email:</strong> ${to}</li>
      </ul>
    </div>

    <p style="margin-top:30px; font-size:15px; line-height:1.5;">
      In the next days you will receive a <strong>private link</strong> to purchase early access tickets.<br/>
      Stay tuned – the mystery location will be revealed soon.
    </p>

    <hr style="margin:40px auto; border:none; border-top:1px solid #ccc; width:80%;" />

    <p style="font-size:13px;">
      CLEOPE Team
    </p>

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

