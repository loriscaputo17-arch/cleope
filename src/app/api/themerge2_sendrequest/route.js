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
          THE MERGE II · MILAN FASHION WEEK
        </h1>

        <p style="color:#777;font-size:12px;margin-bottom:36px;letter-spacing:2px;text-transform:uppercase;">
          28.02.2026
        </p>

        <p style="font-size:15px;line-height:1.7;margin-bottom:32px;color:#ddd;">
          Dear <strong>${name}</strong>,<br/><br/>
          we have received your request and it is currently under review.<br/>
          Our team will contact you shortly with further details.
        </p>

         <p style="font-size:15px;line-height:1.7;margin-bottom:32px;color:#ddd;">
            Invite your friend
          </p>
          <a
            href="https://wa.me/?text=You%27ve%20been%20selected%20for%20THE%20MERGE%20II.%0A%0A28.02.2026%20%E2%80%93%20Milan%20Fashion%20Week.%0A%0APrivate%20access%20only.%0ARequest%20here:%20https://www.cleopeofficial.com/formats/themerge2?q=INVITECODE"
            target="_blank"
            style="
              display:inline-block;
              font-size:13px;
              letter-spacing:0.35em;
              text-transform:uppercase;
              color:#ffffff;
              border:1px solid #ffffff;
              padding:12px 20px;
              text-decoration:none;
            "
          >
            Share via WhatsApp
          </a>

        <p style="font-size:13px;color:#bbb;margin-top:28px;line-height:1.6;">
          To book tables and get further information, please contact:<br/>
          <strong>+39 351 389 5086</strong><br/>
          or <strong>cleope.events@gmail.com</strong>
        </p>

        <hr style="border:0;border-top:1px solid #222;margin:40px auto;width:70%;" />

        <p style="font-size:11px;color:#555;letter-spacing:3px;text-transform:uppercase;">
          THE MERGE II</br>
          MILAN FASHION WEEK
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: "THE MERGE II <cleope.events@gmail.com>",
      to,
      subject: "Request Received — THE MERGE II - MILAN FASHION WEEK",
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
