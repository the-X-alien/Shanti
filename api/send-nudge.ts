import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Resend } from 'resend'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email, status } = req.body as { email?: string; status?: string }

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Invalid email' })
  }

  if (!status || !['green', 'yellow', 'red'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' })
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'RESEND_API_KEY not configured' })
  }

  try {
    const resend = new Resend(apiKey)

    const statusColor = status === 'red' ? '#e6a817' : status === 'yellow' ? '#e6a817' : '#2ecc71'
    const statusLabel = status.toUpperCase()

    await resend.emails.send({
      from: 'Mental Tachometer <onboarding@resend.dev>',
      to: email,
      subject: `Your trusted contact's status: ${statusLabel}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="background:#000;color:#fff;font-family:Inter,sans-serif;padding:40px 24px;">
          <div style="max-width:480px;margin:0 auto;">
            <div style="width:24px;height:24px;border-radius:50%;background:${statusColor};margin-bottom:16px;"></div>
            <h2 style="font-size:20px;font-weight:400;margin:0 0 8px;">
              <span style="color:#999;">Status:</span>
              <span style="color:${statusColor};font-weight:600;">${statusLabel}</span>
            </h2>
            <p style="color:#999;font-size:14px;line-height:1.6;margin:0 0 24px;">
              Your trusted contact's status has changed. No personal data or scores are included — just a light.
              Reach out and check in?
            </p>
            <p style="color:#4d4d4d;font-size:12px;border-top:1px solid #333;padding-top:16px;">
              Sent by Mental Tachometer — a privacy-first wellness dashboard.
            </p>
          </div>
        </body>
        </html>
      `,
    })

    return res.status(200).json({ sent: true })
  } catch (error) {
    console.error('Resend error:', error)
    return res.status(500).json({ error: 'Failed to send email' })
  }
}
