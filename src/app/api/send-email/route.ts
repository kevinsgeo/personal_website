/**
 * POST /api/send-email
 * Body: { senderEmail: string, message: string }
 * Requires: RESEND_API_KEY in .env.local (get one at resend.com)
 * Optional: RESEND_FROM_EMAIL (verified domain, e.g. contact@yourdomain.com)
 *   Defaults to onboarding@resend.dev for development.
 */
import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

const TO_EMAIL = "shinegeorge@wisc.edu";
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

export async function POST(request: Request) {
  try {
    const { senderEmail, message } = await request.json();
    if (!senderEmail || !message || typeof senderEmail !== "string" || typeof message !== "string") {
      return NextResponse.json(
        { error: "senderEmail and message are required" },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: `"${senderEmail}" <${FROM_EMAIL}>`,
      to: [TO_EMAIL],
      replyTo: senderEmail,
      subject: "Message from your website",
      text: message,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to send" },
      { status: 500 }
    );
  }
}
