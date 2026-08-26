import nodemailer, { type Transporter } from 'nodemailer';
import { query } from './db';
import { ensureEntity } from './admin-db';

// SMTP credentials live in .env (never in the database):
//   EMAIL_HOST=smtp.gmail.com
//   EMAIL_PORT=587
//   EMAIL=<the gmail account that sends>
//   APP_PASSWORD=<16-char Gmail app password, NOT the account password>
//
// Only the routing (who receives inquiries) is editable in /admin, so changing
// the destination never needs a redeploy.

export type EmailSettings = {
  enabled: boolean;
  recipient: string;
  cc: string;
  subjectPrefix: string;
};

function envFallback(): EmailSettings {
  return {
    // Without a configured recipient there's nowhere to send, so default to the
    // sending account itself — mail lands in the same inbox rather than nowhere.
    enabled: true,
    recipient: process.env.EMAIL || '',
    cc: '',
    subjectPrefix: '[Nissan CDO]',
  };
}

export async function getEmailSettings(): Promise<EmailSettings> {
  try {
    await ensureEntity('email_settings');
    const rows = await query<any>(
      'SELECT enabled, recipient, cc, subject_prefix FROM email_settings WHERE id = 1 LIMIT 1',
    );
    if (!rows.length) return envFallback();
    const r = rows[0];
    return {
      enabled: Number(r.enabled) === 1,
      recipient: String(r.recipient || '').trim() || process.env.EMAIL || '',
      cc: String(r.cc || '').trim(),
      subjectPrefix: String(r.subject_prefix || '').trim() || '[Nissan CDO]',
    };
  } catch {
    return envFallback();
  }
}

// Cache the transporter on globalThis for the same reason as the MySQL pool:
// each Next.js route is its own bundle, so a module-level singleton would be
// rebuilt per bundle and open a fresh SMTP connection pool each time.
const globalForMail = globalThis as unknown as { __mailer?: Transporter | null };

/** Returns null when SMTP isn't configured, so callers can skip silently. */
export function getTransporter(): Transporter | null {
  if (globalForMail.__mailer !== undefined) return globalForMail.__mailer;

  const user = process.env.EMAIL;
  const pass = process.env.APP_PASSWORD;
  if (!user || !pass) {
    globalForMail.__mailer = null;
    return null;
  }

  const port = Number(process.env.EMAIL_PORT || 587);
  globalForMail.__mailer = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port,
    // 465 is implicit TLS; 587 starts plaintext and upgrades via STARTTLS.
    secure: port === 465,
    auth: { user, pass },
  });
  return globalForMail.__mailer;
}

export type InquiryEmail = {
  salutation: string;
  full_name: string;
  email: string;
  phone: string;
  inquiry_type: string;
  vehicle: string | null;
  message: string | null;
};

const esc = (v: unknown) =>
  String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

function buildHtml(i: InquiryEmail, submittedAt: Date): string {
  const row = (label: string, value: unknown) =>
    `<tr>
      <td style="padding:8px 12px;background:#f5f5f5;font:600 12px/1.4 Arial,sans-serif;color:#666;text-transform:uppercase;letter-spacing:.05em;white-space:nowrap;vertical-align:top">${esc(label)}</td>
      <td style="padding:8px 12px;font:14px/1.5 Arial,sans-serif;color:#111">${esc(value) || '—'}</td>
    </tr>`;

  return `<div style="max-width:640px;margin:0 auto;font-family:Arial,sans-serif">
  <div style="background:#111;padding:18px 20px">
    <span style="color:#fff;font:600 16px/1 Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase">Nissan Cagayan de Oro</span>
    <span style="color:#c3002f;font:600 16px/1 Arial,sans-serif"> &nbsp;|&nbsp; New Inquiry</span>
  </div>
  <table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;border:1px solid #e5e5e5;border-top:none">
    ${row('Name', `${i.salutation} ${i.full_name}`.trim())}
    ${row('Email', i.email)}
    ${row('Mobile', i.phone)}
    ${row('Inquiry Type', i.inquiry_type)}
    ${row('Vehicle', i.vehicle)}
    ${row('Message', i.message)}
    ${row('Submitted', submittedAt.toLocaleString('en-PH', { timeZone: 'Asia/Manila' }))}
  </table>
  <p style="font:12px/1.6 Arial,sans-serif;color:#888;margin:14px 0 0">
    Sent automatically from the Nissan Cagayan de Oro website. Reply directly to this email to respond to the customer.
  </p>
</div>`;
}

function buildText(i: InquiryEmail, submittedAt: Date): string {
  return [
    'NEW INQUIRY — Nissan Cagayan de Oro',
    '',
    `Name:         ${`${i.salutation} ${i.full_name}`.trim()}`,
    `Email:        ${i.email}`,
    `Mobile:       ${i.phone}`,
    `Inquiry Type: ${i.inquiry_type || '—'}`,
    `Vehicle:      ${i.vehicle || '—'}`,
    `Message:      ${i.message || '—'}`,
    `Submitted:    ${submittedAt.toLocaleString('en-PH', { timeZone: 'Asia/Manila' })}`,
  ].join('\n');
}

/**
 * Forward an inquiry to the configured recipient.
 *
 * Never throws: the inquiry is already saved by the time this runs, and a
 * mail outage must not turn a successful submission into an error for the
 * customer. Returns a result the caller can log.
 */
export async function sendInquiryNotification(
  inquiry: InquiryEmail,
): Promise<{ sent: boolean; reason?: string }> {
  try {
    const settings = await getEmailSettings();
    if (!settings.enabled) return { sent: false, reason: 'disabled in admin settings' };
    if (!settings.recipient) return { sent: false, reason: 'no recipient configured' };

    const transporter = getTransporter();
    if (!transporter) return { sent: false, reason: 'SMTP not configured (EMAIL/APP_PASSWORD)' };

    const submittedAt = new Date();
    const subjectBits = [inquiry.inquiry_type || 'Inquiry', inquiry.vehicle]
      .filter(Boolean)
      .join(' — ');

    await transporter.sendMail({
      // Gmail rewrites From to the authenticated account anyway, so send as the
      // dealership and put the customer on Reply-To instead.
      from: `"Nissan CDO Website" <${process.env.EMAIL}>`,
      to: settings.recipient,
      cc: settings.cc || undefined,
      replyTo: inquiry.email ? `"${inquiry.full_name}" <${inquiry.email}>` : undefined,
      subject: `${settings.subjectPrefix} ${subjectBits} — ${inquiry.full_name}`.trim(),
      text: buildText(inquiry, submittedAt),
      html: buildHtml(inquiry, submittedAt),
    });

    return { sent: true };
  } catch (err) {
    return { sent: false, reason: (err as Error)?.message || 'unknown error' };
  }
}
