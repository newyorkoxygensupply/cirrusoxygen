import { NextResponse } from "next/server";
import { Resend } from "resend";
import { escapeHtml } from "@/lib/email";
import { formatPrice } from "@/lib/products";

export const runtime = "nodejs";

const ORDER_INBOX = "info@cirrusoxygen.com";
const MAX_FIELD_LENGTH = 400;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_LINES = 50;

type OrderLine = { slug: string; name: string; price: number; qty: number };

// Excludes 0/O/1/I/L so it's unambiguous to read back over the phone.
const ORDER_NUMBER_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

function generateOrderNumber() {
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += ORDER_NUMBER_ALPHABET[Math.floor(Math.random() * ORDER_NUMBER_ALPHABET.length)];
  }
  return `CIRRUS-${code}`;
}

function isValidLine(l: unknown): l is OrderLine {
  if (typeof l !== "object" || l === null) return false;
  const { slug, name, price, qty } = l as Record<string, unknown>;
  return (
    typeof slug === "string" &&
    typeof name === "string" &&
    name.trim().length > 0 &&
    name.length <= MAX_FIELD_LENGTH &&
    typeof price === "number" &&
    Number.isFinite(price) &&
    price >= 0 &&
    typeof qty === "number" &&
    Number.isInteger(qty) &&
    qty > 0 &&
    qty <= 99
  );
}

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

  const {
    firstName,
    lastName,
    email,
    phone,
    address,
    city,
    state,
    zip,
    prescriptionFileName,
    lines,
    website,
  } = body as Record<string, unknown>;

  // Honeypot: real users never fill this hidden field.
  if (typeof website === "string" && website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const requiredStrings = { firstName, lastName, email, phone, address, city, state, zip };
  for (const [key, value] of Object.entries(requiredStrings)) {
    if (typeof value !== "string" || !value.trim()) {
      return NextResponse.json({ error: "All contact and shipping fields are required." }, { status: 400 });
    }
    if (value.length > MAX_FIELD_LENGTH) {
      return NextResponse.json({ error: "One or more fields are too long." }, { status: 400 });
    }
  }

  if (!EMAIL_RE.test((email as string).trim())) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  if (
    prescriptionFileName !== undefined &&
    prescriptionFileName !== null &&
    (typeof prescriptionFileName !== "string" || prescriptionFileName.length > MAX_FIELD_LENGTH)
  ) {
    return NextResponse.json({ error: "Invalid prescription file reference." }, { status: 400 });
  }

  if (!Array.isArray(lines) || lines.length === 0 || lines.length > MAX_LINES || !lines.every(isValidLine)) {
    return NextResponse.json({ error: "Your cart is empty or invalid." }, { status: 400 });
  }

  const orderLines = lines as OrderLine[];
  const subtotal = orderLines.reduce((sum, l) => sum + l.price * l.qty, 0);

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set; order request could not be delivered.");
    return NextResponse.json({ error: "Orders are temporarily unavailable. Please call 1-877-OXYGEN-5." }, { status: 503 });
  }

  const resend = new Resend(apiKey);
  const orderNumber = generateOrderNumber();

  const fullName = `${(firstName as string).trim()} ${(lastName as string).trim()}`;
  const safeName = escapeHtml(fullName);
  const safeEmail = escapeHtml((email as string).trim());
  const safePhone = escapeHtml((phone as string).trim());
  const safeAddress = escapeHtml(
    `${(address as string).trim()}, ${(city as string).trim()}, ${(state as string).trim()} ${(zip as string).trim()}`
  );
  const safeRx =
    typeof prescriptionFileName === "string" && prescriptionFileName.trim()
      ? escapeHtml(prescriptionFileName.trim())
      : "Not uploaded — customer opted for physician e-verification";

  const itemsHtml = orderLines
    .map(
      (l) =>
        `<tr><td>${escapeHtml(l.name)}</td><td style="text-align:center">${l.qty}</td><td style="text-align:right">${formatPrice(l.price * l.qty)}</td></tr>`
    )
    .join("");
  const itemsText = orderLines.map((l) => `- ${l.name} × ${l.qty} — ${formatPrice(l.price * l.qty)}`).join("\n");

  try {
    const [businessResult, customerResult] = await Promise.all([
      resend.emails.send({
        from: "CIRRUS Orders <orders@cirrusoxygen.com>",
        to: ORDER_INBOX,
        replyTo: (email as string).trim(),
        subject: `New order request [${orderNumber}] — ${fullName}`,
        html: `
          <p><strong>Order #:</strong> ${orderNumber}</p>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Phone:</strong> ${safePhone}</p>
          <p><strong>Shipping address:</strong> ${safeAddress}</p>
          <p><strong>Prescription:</strong> ${safeRx}</p>
          <p><strong>Order:</strong></p>
          <table cellpadding="6"><tbody>${itemsHtml}</tbody></table>
          <p><strong>Subtotal:</strong> ${formatPrice(subtotal)} (shipping and tax to be confirmed by phone)</p>
        `,
        text: `Order #: ${orderNumber}\nName: ${fullName}\nEmail: ${(email as string).trim()}\nPhone: ${(phone as string).trim()}\nShipping: ${(address as string).trim()}, ${(city as string).trim()}, ${(state as string).trim()} ${(zip as string).trim()}\nPrescription: ${safeRx}\n\nOrder:\n${itemsText}\n\nSubtotal: ${formatPrice(subtotal)} (shipping and tax to be confirmed by phone)`,
      }),
      resend.emails.send({
        from: "CIRRUS Orders <orders@cirrusoxygen.com>",
        to: (email as string).trim(),
        replyTo: ORDER_INBOX,
        subject: `Your CIRRUS order confirmation — ${orderNumber}`,
        html: `
          <p>Hi ${safeName.split(" ")[0]},</p>
          <p>We've received your order request. A concierge specialist will call within one business day to verify your prescription and finalize secure payment by phone — no card details were collected on this page.</p>
          <p><strong>Order #:</strong> ${orderNumber}<br />Reference this number if you call or email us before your specialist reaches out.</p>
          <p><strong>Order summary:</strong></p>
          <table cellpadding="6"><tbody>${itemsHtml}</tbody></table>
          <p><strong>Subtotal:</strong> ${formatPrice(subtotal)} (shipping and tax confirmed by your specialist)</p>
          <p>Questions in the meantime? Reply to this email or call 1-877-OXYGEN-5.</p>
        `,
        text: `Hi ${fullName.split(" ")[0]},\n\nWe've received your order request. A concierge specialist will call within one business day to verify your prescription and finalize secure payment by phone — no card details were collected on this page.\n\nOrder #: ${orderNumber}\nReference this number if you call or email us before your specialist reaches out.\n\nOrder summary:\n${itemsText}\n\nSubtotal: ${formatPrice(subtotal)} (shipping and tax confirmed by your specialist)\n\nQuestions in the meantime? Reply to this email or call 1-877-OXYGEN-5.`,
      }),
    ]);

    if (businessResult.error) {
      console.error("Resend failed to send order notification:", businessResult.error);
      return NextResponse.json({ error: "Could not submit your order. Please try again." }, { status: 502 });
    }
    if (customerResult.error) {
      // Business copy landed; customer receipt failed. Don't fail the whole order over this.
      console.error("Resend failed to send customer order receipt:", customerResult.error);
    }
  } catch (err) {
    console.error("Unexpected error sending order emails:", err);
    return NextResponse.json({ error: "Could not submit your order. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, orderNumber });
}
