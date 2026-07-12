import nodemailer from "nodemailer";

// Create transporter from env variables
const getTransporter = () => {
  const host = process.env.EMAIL_HOST;
  const port = parseInt(process.env.EMAIL_PORT || "587");
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465, false for other ports
      auth: { user, pass },
    });
  }
  
  // Return null if credentials are not provided (Sandbox mode)
  return null;
};

/**
 * Sends a welcome email to the subscriber
 * @param {string} email - Recipient email address
 */
export const sendWelcomeEmail = async (email) => {
  const transporter = getTransporter();
  const year = new Date().getFullYear();

  // Premium, trustable HTML Email template
  const emailHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Vortex Research</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          background-color: #f8fafc;
          color: #1e293b;
        }
        .wrapper {
          width: 100%;
          background-color: #f8fafc;
          padding: 40px 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border: 1px border #e2e8f0;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
        }
        .header {
          background-color: #0f172a;
          padding: 32px;
          text-align: center;
        }
        .logo {
          font-size: 20px;
          font-weight: 800;
          letter-spacing: 0.1em;
          color: #ffffff;
          margin: 0;
        }
        .logo span {
          color: #3b82f6;
          font-size: 11px;
          background-color: rgba(59, 130, 246, 0.15);
          padding: 2px 6px;
          border-radius: 4px;
          margin-left: 6px;
          font-family: monospace;
          vertical-align: middle;
        }
        .body-content {
          padding: 40px 32px;
        }
        .title {
          font-size: 22px;
          font-weight: 700;
          margin-top: 0;
          margin-bottom: 16px;
          color: #0f172a;
        }
        .description {
          font-size: 15px;
          line-height: 1.6;
          color: #475569;
          margin-bottom: 24px;
        }
        .features-list {
          margin: 24px 0;
          padding: 0;
          list-style: none;
        }
        .feature-item {
          padding: 12px 16px;
          background-color: #f1f5f9;
          border-radius: 10px;
          margin-bottom: 10px;
          font-size: 14px;
          font-weight: 500;
          color: #334155;
          display: flex;
          align-items: center;
        }
        .feature-icon {
          margin-right: 12px;
          color: #3b82f6;
          font-weight: bold;
        }
        .badge {
          display: inline-flex;
          align-items: center;
          background-color: #ecfdf5;
          border: 1px solid #a7f3d0;
          color: #047857;
          font-size: 12px;
          font-weight: 600;
          padding: 4px 12px;
          border-radius: 9999px;
          margin-bottom: 20px;
        }
        .badge-dot {
          height: 6px;
          width: 6px;
          background-color: #10b981;
          border-radius: 50%;
          margin-right: 6px;
        }
        .footer {
          background-color: #f1f5f9;
          padding: 24px 32px;
          text-align: center;
          font-size: 12px;
          color: #64748b;
          border-top: 1px solid #e2e8f0;
        }
        .footer a {
          color: #3b82f6;
          text-decoration: none;
        }
        .footer-note {
          margin-top: 12px;
          font-size: 11px;
          color: #94a3b8;
          line-height: 1.5;
        }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          <div class="header">
            <h1 class="logo">VORTEX <span>RESEARCH</span></h1>
          </div>
          <div class="body-content">
            <div class="badge">
              <span class="badge-dot"></span> Verified Subscription
            </div>
            <h2 class="title">You're officially on the list!</h2>
            <p className="description">
              Thank you for subscribing to the <strong>Vortex Weekly Digest</strong>. You will now receive high-quality, institutional-grade market insights directly in your inbox every Monday morning.
            </p>
            
            <p className="description" style="margin-bottom: 8px;"><strong>Here is what you will receive:</strong></p>
            <ul class="features-list">
              <li class="feature-item">
                <span class="feature-icon">✓</span> Detailed public company deep-dives & valuations
              </li>
              <li class="feature-item">
                <span class="feature-icon">✓</span> Quantitative risk assessment and margin analysis
              </li>
              <li class="feature-item">
                <span class="feature-icon">✓</span> High-signal news timeline aggregations
              </li>
            </ul>

            <p class="description" style="margin-top: 24px;">
              Our algorithms analyze filings, news feeds, and historical charts to generate objective summaries, so you can skip the noise and get straight to the facts.
            </p>
            <p class="description" style="margin-top: 16px; font-size: 13px; font-style: italic;">
              Best regards,<br>
              <strong>The Vortex Engineering Team</strong>
            </p>
          </div>
          <div class="footer">
            <p>© ${year} Vortex Research Terminal. All rights reserved.</p>
            <p>You received this because you subscribed to the Vortex Newsletter. If you wish to unsubscribe, you can <a href="#">unsubscribe here</a> at any time.</p>
            <p class="footer-note">For educational and research purposes only. This email does not constitute legal, tax, or investment advice.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  if (transporter) {
    // Real mode: Send using NodeMailer SMTP Transporter
    const mailOptions = {
      from: `"Vortex Research" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Welcome to Vortex Research Terminal",
      html: emailHtml,
    };
    await transporter.sendMail(mailOptions);
    console.log(`[Email Service] Success: Welcome email sent via SMTP to: ${email}`);
  } else {
    // Sandbox mode: Log welcome details to console
    console.log(`\n======================================================`);
    console.log(`[Email Service] SANDBOX MODE (No SMTP credentials configured)`);
    console.log(`[Recipient]: ${email}`);
    console.log(`[Subject]: Welcome to Vortex Research Terminal`);
    console.log(`[HTML Template]: (Simulating welcome receipt successfully)`);
    console.log(`======================================================\n`);
  }
};

/**
 * Sends a notification email to the admin when a new user subscribes
 * @param {string} subscriberEmail - The email address of the new subscriber
 */
export const sendAdminNotificationEmail = async (subscriberEmail) => {
  const transporter = getTransporter();
  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
  const year = new Date().getFullYear();

  if (!adminEmail) {
    console.warn("[Email Service] Skipping admin notification: Admin email is not configured.");
    return;
  }

  // Premium, trustable HTML Email template for admin notification
  const emailHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Newsletter Subscriber - Vortex Terminal</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          background-color: #f8fafc;
          color: #1e293b;
        }
        .wrapper {
          width: 100%;
          background-color: #f8fafc;
          padding: 40px 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
        }
        .header {
          background-color: #0f172a;
          padding: 32px;
          text-align: center;
        }
        .logo {
          font-size: 20px;
          font-weight: 800;
          letter-spacing: 0.1em;
          color: #ffffff;
          margin: 0;
        }
        .logo span {
          color: #3b82f6;
          font-size: 11px;
          background-color: rgba(59, 130, 246, 0.15);
          padding: 2px 6px;
          border-radius: 4px;
          margin-left: 6px;
          font-family: monospace;
          vertical-align: middle;
        }
        .body-content {
          padding: 40px 32px;
        }
        .title {
          font-size: 22px;
          font-weight: 700;
          margin-top: 0;
          margin-bottom: 16px;
          color: #0f172a;
        }
        .description {
          font-size: 15px;
          line-height: 1.6;
          color: #475569;
          margin-bottom: 24px;
        }
        .details-box {
          padding: 16px 20px;
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          margin: 24px 0;
        }
        .detail-row {
          margin-bottom: 8px;
          font-size: 14px;
        }
        .detail-row:last-child {
          margin-bottom: 0;
        }
        .label {
          font-weight: 600;
          color: #64748b;
          display: inline-block;
          width: 120px;
        }
        .value {
          color: #0f172a;
          font-weight: 500;
        }
        .badge {
          display: inline-flex;
          align-items: center;
          background-color: #eff6ff;
          border: 1px solid #bfdbfe;
          color: #1d4ed8;
          font-size: 12px;
          font-weight: 600;
          padding: 4px 12px;
          border-radius: 9999px;
          margin-bottom: 20px;
        }
        .badge-dot {
          height: 6px;
          width: 6px;
          background-color: #3b82f6;
          border-radius: 50%;
          margin-right: 6px;
        }
        .footer {
          background-color: #f1f5f9;
          padding: 24px 32px;
          text-align: center;
          font-size: 12px;
          color: #64748b;
          border-top: 1px solid #e2e8f0;
        }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          <div class="header">
            <h1 class="logo">VORTEX <span>SYSTEMS</span></h1>
          </div>
          <div class="body-content">
            <div class="badge">
              <span class="badge-dot"></span> Admin Notification
            </div>
            <h2 class="title">New Newsletter Subscriber</h2>
            <p class="description">
              Hello Admin,
            </p>
            <p class="description">
              This is to notify you that a new user has successfully subscribed to the <strong>Vortex Weekly Digest</strong> newsletter.
            </p>
            
            <div class="details-box">
              <div class="detail-row">
                <span class="label">User Email:</span>
                <span class="value" style="color: #3b82f6; font-weight: 600;">${subscriberEmail}</span>
              </div>
              <div class="detail-row">
                <span class="label">Date/Time:</span>
                <span class="value">${new Date().toLocaleString("en-US", { timeZoneName: "short" })}</span>
              </div>
              <div class="detail-row">
                <span class="label">Status:</span>
                <span class="value" style="color: #10b981; font-weight: 600;">Active</span>
              </div>
            </div>

            <p class="description" style="margin-top: 24px;">
              The subscriber has already been sent a formal welcome email, and their profile is now saved inside the MongoDB database.
            </p>
            <p class="description" style="margin-top: 16px; font-size: 13px; font-style: italic;">
              Best regards,<br>
              <strong>Vortex Notification Service</strong>
            </p>
          </div>
          <div class="footer">
            <p>© ${year} Vortex Research Terminal. System Administration.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  if (transporter) {
    // Real mode: Send using NodeMailer SMTP Transporter
    const mailOptions = {
      from: `"Vortex Systems" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: `[Admin Alert] New Subscriber: ${subscriberEmail}`,
      html: emailHtml,
    };
    await transporter.sendMail(mailOptions);
    console.log(`[Email Service] Success: Admin notification email sent via SMTP to: ${adminEmail}`);
  } else {
    // Sandbox mode: Log welcome details to console
    console.log(`\n======================================================`);
    console.log(`[Email Service] SANDBOX MODE (No SMTP credentials configured)`);
    console.log(`[Admin Recipient]: ${adminEmail}`);
    console.log(`[Subject]: [Admin Alert] New Subscriber: ${subscriberEmail}`);
    console.log(`[HTML Template]: (Simulating admin notification successfully)`);
    console.log(`======================================================\n`);
  }
};
