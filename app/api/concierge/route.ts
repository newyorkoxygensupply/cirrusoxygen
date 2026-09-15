import { NextResponse } from "next/server";
import { Resend } from "resend";
import { escapeHtml } from "@/lib/email";

export const runtime = "nodejs";

const ENQUIRY_INBOX = "info@cirrusoxygen.com";
const MAX_FIELD_LENGTH = 4000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, email, topic, message, website } = body as Record<string, unknown>;

  // Honeypot: real users never fill this hidden field.
  if (typeof website === "string" && website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof topic !== "string" ||
    typeof message !== "string" ||
    !name.trim() ||
    !email.trim() ||
    !message.trim()
  ) {
    return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
  }

  if (!EMAIL_RE.test(email.trim())) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  if (name.length > 200 || email.length > 200 || topic.length > 200 || message.length > MAX_FIELD_LENGTH) {
    return NextResponse.json({ error: "One or more fields are too long." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set; concierge enquiry could not be delivered.");
    return NextResponse.json({ error: "Enquiries are temporarily unavailable. Please call 1-877-OXYGEN-5." }, { status: 503 });
  }

  const resend = new Resend(apiKey);

  const safeName = escapeHtml(name.trim());
  const safeEmail = escapeHtml(email.trim());
  const safeTopic = escapeHtml(topic.trim() || "Something else");
  const safeMessage = escapeHtml(message.trim()).replace(/\n/g, "<br />");

  try {
    const { error } = await resend.emails.send({
      from: "CIRRUS Concierge <concierge@cirrusoxygen.com>",
      to: ENQUIRY_INBOX,
      replyTo: email.trim(),
      subject: `Concierge enquiry: ${topic.trim() || "Something else"} — ${name.trim()}`,
      html: `
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Topic:</strong> ${safeTopic}</p>
        <p><strong>Message:</strong></p>
        <p>${safeMessage}</p>
      `,
      text: `Name: ${name.trim()}\nEmail: ${email.trim()}\nTopic: ${topic.trim() || "Something else"}\n\n${message.trim()}`,
    });

    if (error) {
      console.error("Resend failed to send concierge enquiry:", error);
      return NextResponse.json({ error: "Could not send your message. Please try again." }, { status: 502 });
    }
  } catch (err) {
    console.error("Unexpected error sending concierge enquiry:", err);
    return NextResponse.json({ error: "Could not send your message. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
