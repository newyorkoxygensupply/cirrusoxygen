import { NextResponse } from "next/server";
import { Resend } from "resend";
import { escapeHtml } from "@/lib/email";
import { getRentalDevice } from "@/lib/rentals";
import { formatUSD, quoteForRange } from "@/lib/rental-quote";

export const runtime = "nodejs";

const REQUEST_INBOX = "info@cirrusoxygen.com";
const MAX_NOTES_LENGTH = 4000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[\d\s()+.\-]{7,30}$/;

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

  const { deviceKey, start, end, name, email, phone, zip, fulfillment, notes, website } =
    body as Record<string, unknown>;

  // Honeypot: real users never fill this hidden field.
  if (typeof website === "string" && website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  if (
    typeof deviceKey !== "string" ||
    typeof start !== "string" ||
    typeof end !== "string" ||
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof phone !== "string" ||
    typeof fulfillment !== "string" ||
    !name.trim() ||
    !email.trim() ||
    !phone.trim()
  ) {
    return NextResponse.json(
      { error: "Device, dates, name, email, and phone are required." },
      { status: 400 },
    );
  }

  const device = getRentalDevice(deviceKey);
  if (!device) {
    return NextResponse.json({ error: "Choose a rental device from the list." }, { status: 400 });
  }

  // Recomputed from live rates server-side — client-supplied totals are never trusted.
  const quote = quoteForRange(device, start, end);
  if (!quote) {
    return NextResponse.json({ error: "The end date must be after the start date." }, { status: 400 });
  }

  if (fulfillment !== "delivery" && fulfillment !== "pickup") {
    return NextResponse.json({ error: "Choose delivery or pickup." }, { status: 400 });
  }

  if (!EMAIL_RE.test(email.trim())) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  if (!PHONE_RE.test(phone.trim())) {
    return NextResponse.json({ error: "Enter a valid phone number." }, { status: 400 });
  }

  const zipValue = typeof zip === "string" ? zip.trim() : "";
  if (fulfillment === "delivery" && !zipValue) {
    return NextResponse.json({ error: "A ZIP code is required for delivery." }, { status: 400 });
  }

  const notesValue = typeof notes === "string" ? notes.trim() : "";
  if (
    name.length > 200 ||
    email.length > 200 ||
    phone.length > 40 ||
    zipValue.length > 20 ||
    notesValue.length > MAX_NOTES_LENGTH
  ) {
    return NextResponse.json({ error: "One or more fields are too long." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set; rental request could not be delivered.");
    return NextResponse.json(
      { error: "Requests are temporarily unavailable. Please call 1-877-OXYGEN-5." },
      { status: 503 },
    );
  }

  const resend = new Resend(apiKey);

  const quoteLines = [
    device.weeklyPrice !== null && quote.weeklyTotal !== null
      ? `Billed weekly: ${quote.weeks} × ${formatUSD(device.weeklyPrice)} = ${formatUSD(quote.weeklyTotal)}`
      : "Billed weekly: call for pricing",
    device.monthlyPrice !== null && quote.monthlyTotal !== null
      ? `Billed monthly: ${quote.months} × ${formatUSD(device.monthlyPrice)} = ${formatUSD(quote.monthlyTotal)}`
      : "Billed monthly: call for pricing",
  ];

  const summaryText = [
    `Device: ${device.name} (${device.brand})`,
    `Dates: ${start} to ${end} (${quote.days} days)`,
    ...quoteLines,
    `Fulfillment: ${fulfillment === "delivery" ? "Deliver to customer" : "Local pickup"}`,
    `ZIP: ${zipValue || "—"}`,
  ].join("\n");

  const summaryHtml = summaryText
    .split("\n")
    .map((line) => `<p>${escapeHtml(line)}</p>`)
    .join("");

  const safeName = escapeHtml(name.trim());
  const safeNotes = escapeHtml(notesValue).replace(/\n/g, "<br />");

  try {
    const { error } = await resend.emails.send({
      from: "CIRRUS Rentals <concierge@cirrusoxygen.com>",
      to: REQUEST_INBOX,
      replyTo: email.trim(),
      subject: `Rental request: ${device.name} — ${name.trim()}`,
      html: `
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${escapeHtml(email.trim())}</p>
        <p><strong>Phone:</strong> ${escapeHtml(phone.trim())}</p>
        ${summaryHtml}
        ${notesValue ? `<p><strong>Notes:</strong></p><p>${safeNotes}</p>` : ""}
      `,
      text: `Name: ${name.trim()}\nEmail: ${email.trim()}\nPhone: ${phone.trim()}\n${summaryText}${notesValue ? `\n\nNotes:\n${notesValue}` : ""}`,
    });

    if (error) {
      console.error("Resend failed to send rental request:", error);
      return NextResponse.json({ error: "Could not send your request. Please try again." }, { status: 502 });
    }
  } catch (err) {
    console.error("Unexpected error sending rental request:", err);
    return NextResponse.json({ error: "Could not send your request. Please try again." }, { status: 500 });
  }

  // Customer copy is best-effort: the request is already in the inbox above,
  // so a failure here shouldn't fail the submission.
  try {
    await resend.emails.send({
      from: "CIRRUS Rentals <concierge@cirrusoxygen.com>",
      to: email.trim(),
      subject: `We received your rental request — ${device.name}`,
      html: `
        <p>Hi ${safeName},</p>
        <p>We received your rental request. A specialist will confirm availability and final pricing within one business day.</p>
        ${summaryHtml}
        <p>This is a request, not a confirmed booking — nothing is charged, and nothing ships until your prescription is verified.</p>
        <p>Questions in the meantime? Call 1-877-OXYGEN-5.</p>
        <p>— CIRRUS Concierge</p>
      `,
      text: `Hi ${name.trim()},\n\nWe received your rental request. A specialist will confirm availability and final pricing within one business day.\n\n${summaryText}\n\nThis is a request, not a confirmed booking — nothing is charged, and nothing ships until your prescription is verified.\n\nQuestions in the meantime? Call 1-877-OXYGEN-5.\n\n— CIRRUS Concierge`,
    });
  } catch (err) {
    console.error("Rental request customer confirmation failed:", err);
  }

  return NextResponse.json({ ok: true });
}
