import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export interface InquiryEmailData {
  name: string;
  email: string;
  phone: string;
  message?: string | null;
  propertyTitle?: string | null;
  inquiryType?: string;
}

/**
 * Sends an email notification to the admin when a new inquiry is submitted.
 * Gracefully skips if RESEND_API_KEY is not set or no recipient email is configured.
 */
export async function sendInquiryNotification(
  inquiry: InquiryEmailData
): Promise<void> {
  if (!resend) {
    console.log(
      "[Email] RESEND_API_KEY not set — skipping inquiry notification email."
    );
    return;
  }

  // Determine recipient: notification_email > company_email > ADMIN_EMAIL env
  let recipientEmail: string | null = null;

  try {
    const settings = await prisma.siteSettings.findMany({
      where: { key: { in: ["notification_email", "company_email"] } },
    });

    const settingsMap: Record<string, string> = {};
    for (const row of settings) {
      settingsMap[row.key] = row.value;
    }

    recipientEmail =
      settingsMap["notification_email"] ||
      settingsMap["company_email"] ||
      null;
  } catch (error) {
    console.error("[Email] Failed to fetch settings for email recipient:", error);
  }

  if (!recipientEmail) {
    recipientEmail = process.env.ADMIN_EMAIL || null;
  }

  if (!recipientEmail) {
    console.log(
      "[Email] No recipient email configured (notification_email, company_email, or ADMIN_EMAIL) — skipping."
    );
    return;
  }

  const subject = inquiry.propertyTitle
    ? `New Inquiry: ${inquiry.propertyTitle}`
    : `New Inquiry from ${inquiry.name}`;

  const htmlBody = buildInquiryEmailHtml(inquiry);

  try {
    const { error } = await resend.emails.send({
      from: "City Nexa <onboarding@resend.dev>",
      to: recipientEmail,
      subject,
      html: htmlBody,
    });

    if (error) {
      console.error("[Email] Resend API error:", error);
    } else {
      console.log(`[Email] Inquiry notification sent to ${recipientEmail}`);
    }
  } catch (error) {
    console.error("[Email] Failed to send inquiry notification:", error);
  }
}

function buildInquiryEmailHtml(inquiry: InquiryEmailData): string {
  const rows: Array<{ label: string; value: string }> = [
    { label: "Name", value: inquiry.name },
    { label: "Email", value: inquiry.email },
    { label: "Phone", value: inquiry.phone },
  ];

  if (inquiry.inquiryType) {
    rows.push({
      label: "Inquiry Type",
      value: inquiry.inquiryType.replace(/_/g, " "),
    });
  }

  if (inquiry.propertyTitle) {
    rows.push({ label: "Property", value: inquiry.propertyTitle });
  }

  const detailRows = rows
    .map(
      (r) =>
        `<tr>
          <td style="padding:8px 12px;font-weight:600;color:#374151;border-bottom:1px solid #e5e7eb;white-space:nowrap;">${r.label}</td>
          <td style="padding:8px 12px;color:#1f2937;border-bottom:1px solid #e5e7eb;">${escapeHtml(r.value)}</td>
        </tr>`
    )
    .join("\n");

  const messageSection = inquiry.message
    ? `<div style="margin-top:20px;">
        <h3 style="margin:0 0 8px;font-size:14px;color:#374151;">Message</h3>
        <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:12px;color:#1f2937;font-size:14px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(inquiry.message)}</div>
      </div>`
    : "";

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:560px;margin:20px auto;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
    <div style="background:#1e40af;padding:20px 24px;">
      <h1 style="margin:0;color:#ffffff;font-size:18px;font-weight:600;">New Inquiry Received</h1>
    </div>
    <div style="padding:24px;">
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        ${detailRows}
      </table>
      ${messageSection}
      <div style="margin-top:24px;padding-top:16px;border-top:1px solid #e5e7eb;">
        <a href="${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/admin/inquiries"
           style="display:inline-block;background:#1e40af;color:#ffffff;text-decoration:none;padding:10px 20px;border-radius:6px;font-size:14px;font-weight:500;">
          View in Dashboard
        </a>
      </div>
    </div>
    <div style="background:#f9fafb;padding:12px 24px;text-align:center;font-size:12px;color:#6b7280;">
      City Nexa Networks — Inquiry Notification
    </div>
  </div>
</body>
</html>`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
