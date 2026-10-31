import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as path from 'path';
import * as fs from 'fs';

export interface SendReportEmailOptions {
  to: string;
  reportTitle?: string;
  qualityScore?: number;
  releaseDecision?: string;
  releaseRisk?: string;
  totalTests?: number;
  passed?: number;
  failed?: number;
  pdfAttachment?: Buffer;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    this.initTransporter();
  }

  private async initTransporter() {
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
    const smtpSecure = process.env.SMTP_SECURE === 'true';

    // 1. If explicit SMTP credentials exist, create production SMTP transporter with fast timeouts
    if (smtpHost && smtpUser && smtpPass) {
      this.transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
        connectionTimeout: 4000,
        greetingTimeout: 4000,
        socketTimeout: 5000,
      });
      this.logger.log(`[EmailService] Configured production SMTP via ${smtpHost}:${smtpPort}`);
      return;
    }

    // 2. Fallback / Test Account for instant zero-configuration preview
    try {
      const testAccount = await nodemailer.createTestAccount();
      this.transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      this.logger.log(`[EmailService] Configured Ethereal Test Account (${testAccount.user}) for preview`);
    } catch (err: any) {
      this.logger.warn(`[EmailService] Could not initialize Ethereal test account: ${err.message}. Using JSON mock transport.`);
      this.transporter = nodemailer.createTransport({
        jsonTransport: true,
      });
    }
  }

  async sendReportEmail(options: SendReportEmailOptions) {
    if (!this.transporter) {
      await this.initTransporter();
    }

    const {
      to,
      reportTitle = 'Master Release Assurance Quality Report',
      qualityScore = 92,
      releaseDecision = 'APPROVED_WITH_WARNINGS',
      releaseRisk = 'MEDIUM',
      totalTests = 12,
      passed = 11,
      failed = 1,
      pdfAttachment,
    } = options;

    const fromAddress = process.env.SMTP_FROM || '"QualityPilot AI" <noreply@qualitypilot.io>';
    const isApproved = releaseDecision.includes('APPROVED');
    const badgeColor = isApproved ? '#10b981' : '#A31C18';

    // Locate brand logo for inline email embedding
    const candidatePaths = [
      path.resolve(process.cwd(), 'apps/web/public/brand/qualitypilot-logo.png'),
      path.resolve(__dirname, '../../../../apps/web/public/brand/qualitypilot-logo.png'),
      path.resolve(__dirname, '../../../web/public/brand/qualitypilot-logo.png'),
    ];
    const logoFilePath = candidatePaths.find((p) => fs.existsSync(p));

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #06110C; color: #f8fafc; margin: 0; padding: 24px; }
            .container { max-width: 580px; margin: 0 auto; background: #171717; border: 1px solid #2a2a2a; border-radius: 16px; overflow: hidden; }
            .header { background: linear-gradient(135deg, #171717, #06110C); padding: 26px 24px; text-align: center; border-bottom: 2px solid #A31C18; }
            .title { font-size: 19px; font-weight: 800; color: #ffffff; margin: 6px 0 2px 0; }
            .subtitle { font-size: 12px; color: #94a3b8; }
            .body { padding: 24px; }
            .badge { display: inline-block; padding: 5px 12px; border-radius: 6px; font-size: 11px; font-weight: 800; background: ${badgeColor}25; color: ${badgeColor === '#10b981' ? '#10b981' : '#F87171'}; border: 1px solid ${badgeColor}50; text-transform: uppercase; margin-bottom: 16px; }
            .score-box { background: #06110C; border: 1px solid #2a2a2a; border-radius: 10px; padding: 16px 20px; margin-bottom: 20px; }
            .score-header { display: flex; align-items: center; justify-content: space-between; }
            .score-label { font-size: 13px; color: #cbd5e1; font-weight: 600; }
            .score-val { font-size: 28px; font-weight: 900; color: ${isApproved ? '#10b981' : '#F87171'}; }
            .pdf-box { background: #06110C; border: 1px solid #A31C1850; border-radius: 12px; padding: 22px 20px; text-align: center; margin: 20px 0; }
            .pdf-icon { font-size: 38px; margin-bottom: 8px; }
            .pdf-title { font-size: 15px; font-weight: 800; color: #ffffff; margin-bottom: 6px; }
            .pdf-desc { font-size: 12px; color: #94a3b8; line-height: 1.5; margin-bottom: 14px; }
            .pdf-pill { display: inline-block; background: #A31C1820; border: 1px solid #A31C18; color: #F87171; padding: 7px 16px; border-radius: 6px; font-size: 11px; font-weight: 700; }
            .footer { padding: 16px 24px; background: #06110C; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #2a2a2a; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              ${
                logoFilePath
                  ? `<img src="cid:qualitypilot-brand-logo" alt="QualityPilot AI Logo" style="height: 48px; width: auto; max-width: 220px; object-fit: contain; margin-bottom: 8px; display: inline-block;" />`
                  : `<div style="font-size: 28px;">🛡️</div><div class="title">QualityPilot AI</div>`
              }
              <div class="subtitle">Official Release Assurance & Quality Gate Audit</div>
            </div>
            <div class="body">
              <div class="badge">${releaseDecision.replace(/_/g, ' ')} (Risk: ${releaseRisk})</div>
              
              <div class="score-box">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td>
                      <div class="score-label">${reportTitle}</div>
                      <div style="font-size: 11px; color: #64748b; margin-top: 2px;">Decision: ${releaseDecision} • Risk: ${releaseRisk}</div>
                    </td>
                    <td align="right">
                      <div class="score-val">${qualityScore}<span style="font-size: 14px; color: #64748b;">/100</span></div>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Attached PDF Notice -->
              <div class="pdf-box">
                <div class="pdf-icon">📄</div>
                <div class="pdf-title">Full Release Report Attached as PDF</div>
                <div class="pdf-desc">
                  The complete multi-dimensional quality audit, test execution results, AST code scanning findings, and AI recommendations are compiled into the attached PDF file.
                </div>
                <div class="pdf-pill">
                  📎 QualityPilot-Release-Assurance-Report.pdf
                </div>
              </div>
              
              <div style="font-size: 11px; color: #94a3b8; line-height: 1.5; text-align: center;">
                Please download and inspect the attached PDF document for full technical audit details.
              </div>
            </div>
            <div class="footer">
              Dispatched automatically by QualityPilot AI Autonomous Testing Platform.<br/>
              © ${new Date().getFullYear()} QualityPilot AI. All rights reserved.
            </div>
          </div>
        </body>
      </html>
    `;

    // Construct MIME attachments (PDF Report + optional inline logo)
    const emailAttachments: any[] = [];
    if (pdfAttachment) {
      emailAttachments.push({
        filename: 'QualityPilot-Release-Assurance-Report.pdf',
        content: pdfAttachment,
        contentType: 'application/pdf',
      });
    }
    if (logoFilePath) {
      emailAttachments.push({
        filename: 'qualitypilot-logo.png',
        path: logoFilePath,
        cid: 'qualitypilot-brand-logo',
      });
    }

    const mailOptions: nodemailer.SendMailOptions = {
      from: fromAddress,
      to,
      subject: `[QualityGate] ${releaseDecision}: ${reportTitle} (Score: ${qualityScore}/100) — PDF Attached`,
      html: htmlContent,
      attachments: emailAttachments.length > 0 ? emailAttachments : undefined,
    };

    // 1. If production SMTP credentials exist (e.g. Gmail App Password), dispatch directly via SMTP
    if (process.env.SMTP_USER && process.env.SMTP_PASS && this.transporter) {
      try {
        const info = await this.transporter.sendMail(mailOptions);
        this.logger.log(`[EmailService] Report with PDF attachment dispatched directly via SMTP to ${to}. MessageId: ${info.messageId}`);
        return {
          success: true,
          provider: 'GMAIL_SMTP',
          messageId: info.messageId,
          sentTo: to,
          isForwarded: false,
          hasPdfAttachment: Boolean(pdfAttachment),
          previewUrl: null,
          message: `Official quality report with PDF attachment dispatched directly to ${to} via Gmail SMTP`,
        };
      } catch (smtpErr: any) {
        this.logger.warn(`[EmailService] SMTP direct dispatch failed: ${smtpErr.message}. Trying Resend fallback.`);
      }
    }

    // 2. Fallback to Resend if RESEND_API_KEY is configured
    if (process.env.RESEND_API_KEY) {
      try {
        const resendFrom = process.env.RESEND_FROM || 'QualityPilot AI <onboarding@resend.dev>';
        const adminEmail = 'patelkrish2890@gmail.com';
        
        const attachmentsPayload = pdfAttachment
          ? [
              {
                filename: 'QualityPilot-Release-Assurance-Report.pdf',
                content: pdfAttachment.toString('base64'),
              },
            ]
          : undefined;

        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: resendFrom,
            to: [to],
            subject: mailOptions.subject,
            html: htmlContent,
            attachments: attachmentsPayload,
          }),
        });
        const resendData = await resendRes.json();
        if (resendRes.ok && resendData.id) {
          this.logger.log(`[EmailService] Dispatched via Resend API: ${resendData.id} with PDF attachment`);
          return {
            success: true,
            provider: 'RESEND',
            messageId: resendData.id,
            sentTo: to,
            isForwarded: false,
            hasPdfAttachment: Boolean(pdfAttachment),
            previewUrl: null,
            message: `Official quality report with PDF attachment dispatched via Resend to ${to}`,
          };
        } else {
          this.logger.warn(`[EmailService] Resend API report notice for ${to}: ${JSON.stringify(resendData)}.`);
          // If Resend failed (e.g. 403 unverified domain) and recipient is not admin, forward to verified admin inbox with PDF attached
          if (to.toLowerCase() !== adminEmail.toLowerCase()) {
            this.logger.log(`[EmailService] Forwarding report with PDF attachment to verified inbox ${adminEmail} via Resend...`);
            const fallbackRes = await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
              },
              body: JSON.stringify({
                from: resendFrom,
                to: [adminEmail],
                subject: `[QualityPilot Report Attached for ${to}] ${mailOptions.subject}`,
                html: htmlContent,
                attachments: attachmentsPayload,
              }),
            });
            const fallbackData = await fallbackRes.json();
            if (fallbackRes.ok && fallbackData.id) {
              return {
                success: true,
                provider: 'RESEND',
                messageId: fallbackData.id,
                sentTo: adminEmail,
                intendedFor: to,
                isForwarded: true,
                hasPdfAttachment: Boolean(pdfAttachment),
                previewUrl: null,
                message: `Resend sandbox restriction: PDF Report dispatched to verified account (${adminEmail}) for recipient ${to}.`,
              };
            }
          }
        }
      } catch (err: any) {
        this.logger.warn(`[EmailService] Resend dispatch failed: ${err.message}. Falling back to SMTP.`);
      }
    }

    // 3. Fallback to Ethereal Preview
    const info = await this.transporter!.sendMail(mailOptions);
    const previewUrl = nodemailer.getTestMessageUrl(info);

    this.logger.log(`[EmailService] Email dispatched to ${to}. MessageId: ${info.messageId}`);
    if (previewUrl) {
      this.logger.log(`[EmailService] Ethereal live preview URL: ${previewUrl}`);
    }

    return {
      success: true,
      provider: previewUrl ? 'ETHEREAL_PREVIEW' : 'SMTP',
      messageId: info.messageId,
      sentTo: to,
      previewUrl: previewUrl || null,
      message: previewUrl
        ? `Report email dispatched! View live rendered preview at: ${previewUrl}`
        : `Report email sent successfully to ${to} via SMTP.`,
    };
  }

  private async dispatchEmailDirect(options: { from: string; to: string; subject: string; html: string }) {
    if (!this.transporter) await this.initTransporter();

    const targetEmail = options.to.trim();
    const adminEmail = 'patelkrish2890@gmail.com';

    // 1. If production SMTP credentials exist (e.g. Gmail App Password), dispatch directly to ANY recipient
    if (process.env.SMTP_USER && process.env.SMTP_PASS && this.transporter) {
      try {
        const info = await this.transporter.sendMail({
          from: options.from,
          to: targetEmail,
          subject: options.subject,
          html: options.html,
        });
        this.logger.log(`[EmailService] Security notice dispatched via Gmail SMTP to ${targetEmail} (id: ${info.messageId})`);
        return {
          success: true,
          provider: 'GMAIL_SMTP',
          messageId: info.messageId,
          sentTo: targetEmail,
          isForwarded: false,
          previewUrl: null,
          message: `Security notification delivered directly to ${targetEmail} via Gmail SMTP`,
        };
      } catch (smtpErr: any) {
        this.logger.warn(`[EmailService] SMTP direct dispatch failed: ${smtpErr.message}. Trying Resend fallback.`);
      }
    }

    // 2. Fallback to Resend if RESEND_API_KEY is configured
    if (process.env.RESEND_API_KEY) {
      try {
        const resendFrom = process.env.RESEND_FROM || 'QualityPilot AI <onboarding@resend.dev>';
        
        // Attempt direct delivery to the specified recipient
        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: resendFrom,
            to: [targetEmail],
            subject: options.subject,
            html: options.html,
          }),
        });

        const resendData = await resendRes.json();
        if (resendRes.ok && resendData.id) {
          this.logger.log(`[EmailService] Dispatched security notice via Resend: ${resendData.id} to ${targetEmail}`);
          return { success: true, provider: 'RESEND', messageId: resendData.id, previewUrl: null };
        }

        this.logger.warn(`[EmailService] Resend API notice: ${JSON.stringify(resendData)}`);

        // If Resend failed (e.g. sandbox 403 on unverified domain) and recipient is not admin:
        // Forward notification to the verified admin inbox (patelkrish2890@gmail.com) so phone inbox gets the alert!
        if (targetEmail.toLowerCase() !== adminEmail.toLowerCase()) {
          this.logger.log(`[EmailService] Forwarding security notice for ${targetEmail} to verified inbox ${adminEmail} via Resend...`);
          const fwdRes = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            },
            body: JSON.stringify({
              from: resendFrom,
              to: [adminEmail],
              subject: `[QualityPilot Security Alert] Account Session for ${targetEmail}`,
              html: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #06110C; color: #f8fafc; padding: 24px; border-radius: 12px; border: 1px solid #2a2a2a; max-width: 580px; margin: 0 auto;">
                  <div style="margin-bottom: 16px;">
                    <span style="font-size: 26px;">🛡️</span>
                    <h2 style="color: #ffffff; font-size: 18px; margin: 6px 0 0 0;">QualityPilot Security Notification</h2>
                  </div>
                  <div style="background: #171717; border: 1px solid #2a2a2a; border-left: 4px solid #A31C18; padding: 12px 16px; border-radius: 8px; margin-bottom: 20px;">
                    <div style="color: #F87171; font-weight: bold; font-size: 13px; margin-bottom: 4px;">Account Session Alert</div>
                    <div style="color: #cbd5e1; font-size: 12px; line-height: 1.5;">
                      A sign-in or registration activity was logged for: <strong>${targetEmail}</strong>.<br/>
                      Forwarded to verified account owner inbox <strong>${adminEmail}</strong> via Resend Gateway.
                    </div>
                  </div>
                  <div>
                    ${options.html}
                  </div>
                </div>
              `,
            }),
          });

          const fwdData = await fwdRes.json();
          if (fwdRes.ok && fwdData.id) {
            this.logger.log(`[EmailService] Forwarded security notice to ${adminEmail} successfully (id: ${fwdData.id})`);
            return {
              success: true,
              provider: 'RESEND',
              messageId: fwdData.id,
              previewUrl: null,
              forwardedTo: adminEmail,
            };
          }
        }
      } catch (err: any) {
        this.logger.warn(`[EmailService] Resend direct dispatch failed: ${err.message}. Falling back.`);
      }
    }

    // 2. Fallback to Nodemailer (SMTP / Ethereal) with safety timeout
    try {
      if (!this.transporter) return { success: false, provider: 'NONE', messageId: null, previewUrl: null };
      
      const sendPromise = this.transporter.sendMail(options);
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('SMTP send timed out after 5s')), 5000)
      );

      const info: any = await Promise.race([sendPromise, timeoutPromise]);
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        this.logger.log(`[EmailService] Security Notice Preview: ${previewUrl}`);
      }
      return {
        success: true,
        provider: previewUrl ? 'ETHEREAL_PREVIEW' : 'SMTP',
        messageId: info.messageId,
        previewUrl: previewUrl || null,
      };
    } catch (err: any) {
      this.logger.warn(`[EmailService] Mail dispatch non-fatal error: ${err.message}`);
      return {
        success: false,
        provider: 'FAILED',
        messageId: null,
        previewUrl: null,
      };
    }
  }

  async sendLoginNotificationEmail(to: string, fullName: string, provider: string, meta?: { ip?: string; time?: string }) {
    const timestamp = meta?.time || new Date().toLocaleString();
    const fromAddress = process.env.SMTP_FROM || '"QualityPilot AI Security" <noreply@qualitypilot.io>';

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #06110C; color: #f8fafc; margin: 0; padding: 24px; }
            .container { max-width: 560px; margin: 0 auto; background: #171717; border: 1px solid #2a2a2a; border-radius: 16px; overflow: hidden; }
            .header { background: linear-gradient(135deg, #171717, #06110C); padding: 28px 24px; text-align: center; border-bottom: 1px solid #2a2a2a; }
            .title { font-size: 18px; font-weight: 800; color: #ffffff; margin-top: 8px; }
            .body { padding: 24px; }
            .badge { display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; background: #A31C1825; color: #F87171; border: 1px solid #A31C1850; margin-bottom: 16px; }
            .info-table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 12px; }
            .info-table td { padding: 8px 12px; border-bottom: 1px solid #2a2a2a; }
            .info-table td:first-child { color: #94a3b8; width: 35%; font-weight: 600; }
            .info-table td:last-child { color: #f8fafc; font-family: monospace; }
            .notice { margin-top: 20px; padding: 12px 16px; background: #06110C; border-left: 3px solid #A31C18; border-radius: 4px; font-size: 11px; color: #94a3b8; }
            .footer { padding: 16px 24px; background: #06110C; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #2a2a2a; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div style="font-size: 32px;">🔐</div>
              <div class="title">Security Notification: Successful Sign-In</div>
            </div>
            <div class="body">
              <div class="badge">ACTIVE SESSION</div>
              <p style="font-size: 13px; line-height: 1.6; color: #cbd5e1; margin: 0 0 16px 0;">
                Hello <strong>${fullName}</strong>,<br/>
                Your account was just signed into QualityPilot AI. Your previous testing sessions and saved workspaces are ready for you.
              </p>
              <table class="info-table">
                <tr><td>Account Email</td><td>${to}</td></tr>
                <tr><td>Sign-in Method</td><td>${provider.toUpperCase()}</td></tr>
                <tr><td>Timestamp</td><td>${timestamp}</td></tr>
                <tr><td>Client Location</td><td>${meta?.ip || '127.0.0.1 (Localhost)'}</td></tr>
              </table>
              <div class="notice">
                If you initiated this sign-in, no further action is required. If this was not you, please secure your account immediately.
              </div>
            </div>
            <div class="footer">
              Dispatched automatically by QualityPilot AI Autonomous Testing Platform.<br/>
              © ${new Date().getFullYear()} QualityPilot AI. All rights reserved.
            </div>
          </div>
        </body>
      </html>
    `;

    return this.dispatchEmailDirect({
      from: fromAddress,
      to,
      subject: `[QualityPilot Security] Successful Sign-In Detected (${provider})`,
      html: htmlContent,
    });
  }

  async sendLogoutNotificationEmail(to: string, fullName: string, sessionSummary?: string) {
    const timestamp = new Date().toLocaleString();
    const fromAddress = process.env.SMTP_FROM || '"QualityPilot AI Security" <noreply@qualitypilot.io>';

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #06110C; color: #f8fafc; margin: 0; padding: 24px; }
            .container { max-width: 560px; margin: 0 auto; background: #171717; border: 1px solid #2a2a2a; border-radius: 16px; overflow: hidden; }
            .header { background: linear-gradient(135deg, #171717, #06110C); padding: 28px 24px; text-align: center; border-bottom: 1px solid #2a2a2a; }
            .title { font-size: 18px; font-weight: 800; color: #ffffff; margin-top: 8px; }
            .body { padding: 24px; }
            .badge { display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; background: #38bdf820; color: #38bdf8; border: 1px solid #38bdf840; margin-bottom: 16px; }
            .info-table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 12px; }
            .info-table td { padding: 8px 12px; border-bottom: 1px solid #2a2a2a; }
            .info-table td:first-child { color: #94a3b8; width: 35%; font-weight: 600; }
            .info-table td:last-child { color: #f8fafc; font-family: monospace; }
            .saved-card { margin-top: 16px; padding: 14px 16px; background: #06110C; border: 1px solid #A31C1840; border-radius: 8px; }
            .saved-title { font-size: 12px; font-weight: 700; color: #F87171; margin-bottom: 4px; }
            .saved-text { font-size: 11px; color: #cbd5e1; line-height: 1.5; }
            .footer { padding: 16px 24px; background: #06110C; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #2a2a2a; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div style="font-size: 32px;">🛡️</div>
              <div class="title">Session Ended: Successful Sign-Out</div>
            </div>
            <div class="body">
              <div class="badge">SIGNED OUT</div>
              <p style="font-size: 13px; line-height: 1.6; color: #cbd5e1; margin: 0 0 16px 0;">
                Hello <strong>${fullName}</strong>,<br/>
                You have successfully signed out of QualityPilot AI.
              </p>
              <table class="info-table">
                <tr><td>Account Email</td><td>${to}</td></tr>
                <tr><td>Logout Time</td><td>${timestamp}</td></tr>
                <tr><td>Workspace State</td><td style="color: #F87171;">Permanently Preserved</td></tr>
              </table>
              <div class="saved-card">
                <div class="saved-title">💾 Your Workspace is Safe</div>
                <div class="saved-text">
                  All your test runs, requirement matrix definitions, and AST scanning results are preserved. When you log back in with this email, your exact progress will be restored.
                </div>
              </div>
            </div>
            <div class="footer">
              Dispatched automatically by QualityPilot AI Autonomous Testing Platform.<br/>
              © ${new Date().getFullYear()} QualityPilot AI. All rights reserved.
            </div>
          </div>
        </body>
      </html>
    `;

    return this.dispatchEmailDirect({
      from: fromAddress,
      to,
      subject: `[QualityPilot] Session Signed Out — Workspace Preserved`,
      html: htmlContent,
    });
  }
}
