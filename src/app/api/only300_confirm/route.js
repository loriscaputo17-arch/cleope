import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { to, name } = await req.json();

    if (!to || !name) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "cleope.events@gmail.com",
        pass: "xjja kpor ibgs acor", // sposta in process.env in produzione
      },
    });

    const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;background:#000;padding:40px;color:#fff;text-align:center;">
      
      <h1 style="font-size:40px;font-weight:bold;letter-spacing:6px;color:#ff2a2a;margin-bottom:10px;">
        ONLY300
      </h1>

      <p style="color:#aaa;font-size:14px;margin-bottom:30px;">
        Sabato 29 Novembre 2025 — Milano
      </p>

      <p style="font-size:18px;line-height:1.8;margin-bottom:25px;">
        Ciao <strong>${name}</strong>,<br/>
        la tua richiesta è stata approvata.
      </p>

      <div style="background:#111;padding:20px;border:1px solid #222;border-radius:10px;margin-bottom:25px;">
        <p style="font-size:15px;line-height:1.6;color:#ccc;">
          Importante:<br/>
          L'approvazione non garantisce automaticamente l'ingresso.<br/>
          All’entrata sarà effettuata selezione.<br/><br/>
          Si consiglia di arrivare con anticipo.
        </p>
      </div>

      <p style="font-size:16px;margin-bottom:20px;line-height:1.5;">
        Ingresso dalle 22:30<br/>
        Dresscode: Casual
      </p>

      <p style="font-size:15px;margin-top:10px;margin-bottom:20px;color:#ccc;">
        Location: <strong>RONIN</strong><br/>
        Via Vittorio Alfieri, 17, 20154 Milano MI
      </p>

      <a href="https://www.instagram.com/cleopeofficial/" 
         style="display:inline-block;margin-top:20px;padding:12px 26px;background:#ff2a2a;color:#fff;text-decoration:none;font-size:14px;font-weight:bold;letter-spacing:1px;border-radius:4px;">
        SEGUICI SU INSTAGRAM
      </a>

      <p style="margin-top:40px;color:#666;font-size:12px;letter-spacing:1px;">
        Ulteriori comunicazioni verranno inviate via email.
      </p>
    </div>
    `;

    await transporter.sendMail({
      from: "ONLY300 <only300@cleope.events>",
      to,
      subject: "APPROVED — ONLY300 — TONIGHT RONIN MILANO",
      html,
    });

    return NextResponse.json({ ok: true });

  } catch (err) {
    console.error("SEND_APPROVAL_ERROR:", err);
    return NextResponse.json({ error: "Email delivery failed" }, { status: 500 });
  }
}
