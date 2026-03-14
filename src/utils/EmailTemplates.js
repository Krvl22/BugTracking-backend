const welcomeEmailTemplate = (user) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Welcome to BugTrack</title>
</head>
<body style="margin:0;padding:0;background-color:#0d0f14;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0d0f14;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="580" cellpadding="0" cellspacing="0" border="0"
          style="background-color:#13161e;border-radius:16px;overflow:hidden;border:1px solid #1f2433;box-shadow:0 0 40px rgba(0,0,0,0.6);">

          <tr><td style="background:linear-gradient(90deg,#1a6fd4,#2563eb,#1e40af);height:4px;"></td></tr>

          <tr>
            <td align="center" style="padding:36px 48px 24px;">
              <span style="font-size:26px;font-weight:700;letter-spacing:2px;color:#ffffff;">BUG<span style="color:#2563eb;">TRACK</span></span>
            </td>
          </tr>

          <tr>
            <td style="padding:0 48px;">
              <div style="height:1px;background:linear-gradient(90deg,transparent,#1f2a40,transparent);"></div>
            </td>
          </tr>

          <tr>
            <td style="padding:32px 48px 0;">
              <p style="margin:0 0 8px;font-size:13px;letter-spacing:3px;color:#2563eb;text-transform:uppercase;font-weight:600;">Welcome Aboard</p>
              <h1 style="margin:0 0 16px;font-size:26px;font-weight:700;color:#ffffff;line-height:1.3;">Hey ${user.firstName}, your<br/>account is ready to go &#128640;</h1>
              <p style="margin:0 0 24px;font-size:15px;color:#8a93a8;line-height:1.7;">
                You've successfully joined <strong style="color:#ffffff;">BugTrack</strong> — the platform built to help your team manage bugs, track tasks, and ship better software, faster.
              </p>
            </td>
          </tr>

          <!-- Account Details -->
          <tr>
            <td style="padding:0 48px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                style="background-color:#0d0f14;border-radius:12px;border:1px solid #1f2433;">
                <tr>
                  <td style="padding:16px 24px 8px;">
                    <p style="margin:0;font-size:11px;letter-spacing:2.5px;color:#2563eb;text-transform:uppercase;font-weight:700;">Your Account Details</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:4px 24px;">
                    <p style="margin:0;font-size:11px;color:#5a6278;text-transform:uppercase;letter-spacing:1px;">&#128100;&nbsp; Full Name</p>
                    <p style="margin:4px 0 12px;font-size:14px;font-weight:600;color:#dde1ea;">${user.firstName} ${user.lastName}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:4px 24px;">
                    <p style="margin:0;font-size:11px;color:#5a6278;text-transform:uppercase;letter-spacing:1px;">&#9993;&nbsp; Email Address</p>
                    <p style="margin:4px 0 12px;font-size:14px;font-weight:600;color:#dde1ea;">${user.email}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:4px 24px 18px;">
                    <p style="margin:0;font-size:11px;color:#5a6278;text-transform:uppercase;letter-spacing:1px;">&#128274;&nbsp; Your Role</p>
                    <p style="margin:6px 0 0;">
                      <span style="background:#1a2a4a;border:1px solid #2a3f6f;color:#2563eb;font-size:11px;font-weight:700;padding:3px 12px;border-radius:4px;letter-spacing:1px;text-transform:uppercase;">${user.role}</span>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- What You Can Do -->
          <tr>
            <td style="padding:0 48px 28px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                style="background-color:#0d0f14;border-radius:12px;border:1px solid #1f2433;">
                <tr>
                  <td style="padding:16px 24px 8px;">
                    <p style="margin:0;font-size:11px;letter-spacing:2.5px;color:#2563eb;text-transform:uppercase;font-weight:700;">What You Can Do</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:6px 24px;">
                    <p style="margin:0;font-size:13px;font-weight:600;color:#dde1ea;">&#128193;&nbsp; Create Projects &amp; Modules</p>
                    <p style="margin:3px 0 10px;font-size:12px;color:#5a6278;">Organize your work into structured projects with multiple modules</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:6px 24px;">
                    <p style="margin:0;font-size:13px;font-weight:600;color:#dde1ea;">&#128027;&nbsp; Track &amp; Manage Bugs</p>
                    <p style="margin:3px 0 10px;font-size:12px;color:#5a6278;">Assign tasks, log bugs, and monitor resolution in real-time</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:6px 24px 18px;">
                    <p style="margin:0;font-size:13px;font-weight:600;color:#dde1ea;">&#128202;&nbsp; Monitor Developer Performance</p>
                    <p style="margin:3px 0 0;font-size:12px;color:#5a6278;">View task timelines, bug counts, and appraisal metrics</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td align="center" style="padding:0 48px 36px;">
              <a href="http://localhost:5173/"
                style="display:inline-block;background:linear-gradient(135deg,#2563eb,#1a6fd4);color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;letter-spacing:1px;padding:14px 40px;border-radius:8px;text-transform:uppercase;">
                Go to Dashboard &#8594;
              </a>
            </td>
          </tr>

          <tr>
            <td style="padding:0 48px;">
              <div style="height:1px;background:linear-gradient(90deg,transparent,#1f2a40,transparent);"></div>
            </td>
          </tr>

          <tr>
            <td style="background-color:#0d0f14;padding:20px 48px;">
              <p style="margin:0 0 4px;font-size:12px;color:#3e4557;">&#169; 2026 BugTrack. All rights reserved.</p>
              <p style="margin:0;font-size:11px;color:#2e3447;">If you didn't create this account, you can safely ignore this email.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};


const resetPasswordTemplate = (resetLink) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Reset Your Password - BugTrack</title>
</head>
<body style="margin:0;padding:0;background-color:#0d0f14;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0d0f14;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="580" cellpadding="0" cellspacing="0" border="0"
          style="background-color:#13161e;border-radius:16px;overflow:hidden;border:1px solid #1f2433;box-shadow:0 0 40px rgba(0,0,0,0.6);">

          <!-- Amber accent bar for security email -->
          <tr><td style="background:linear-gradient(90deg,#b45309,#d97706,#f59e0b);height:4px;"></td></tr>

          <tr>
            <td align="center" style="padding:36px 48px 24px;">
              <span style="font-size:26px;font-weight:700;letter-spacing:2px;color:#ffffff;">BUG<span style="color:#2563eb;">TRACK</span></span>
            </td>
          </tr>

          <tr>
            <td style="padding:0 48px;">
              <div style="height:1px;background:linear-gradient(90deg,transparent,#1f2a40,transparent);"></div>
            </td>
          </tr>

          <tr>
            <td style="padding:32px 48px 0;">
              <p style="margin:0 0 8px;font-size:13px;letter-spacing:3px;color:#d97706;text-transform:uppercase;font-weight:600;">Security Alert</p>
              <h1 style="margin:0 0 16px;font-size:26px;font-weight:700;color:#ffffff;line-height:1.3;">Password Reset<br/>Request &#128272;</h1>
              <p style="margin:0 0 24px;font-size:15px;color:#8a93a8;line-height:1.7;">
                We received a request to reset your <strong style="color:#ffffff;">BugTrack</strong> account password. If this was you, click the button below to continue.
              </p>
            </td>
          </tr>

          <!-- Info Box -->
          <tr>
            <td style="padding:0 48px 28px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                style="background-color:#0d0f14;border-radius:12px;border:1px solid #1f2433;">
                <tr>
                  <td style="padding:16px 24px 8px;">
                    <p style="margin:0;font-size:11px;letter-spacing:2.5px;color:#d97706;text-transform:uppercase;font-weight:700;">Important Information</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:6px 24px;">
                    <p style="margin:0;font-size:13px;font-weight:600;color:#dde1ea;">&#8987;&nbsp; Link Expires In</p>
                    <p style="margin:3px 0 10px;font-size:12px;color:#5a6278;">This reset link is valid for <strong style="color:#d97706;">15 minutes</strong> only. After that you will need to request a new one.</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:6px 24px;">
                    <p style="margin:0;font-size:13px;font-weight:600;color:#dde1ea;">&#128279;&nbsp; One Time Use Only</p>
                    <p style="margin:3px 0 10px;font-size:12px;color:#5a6278;">This link can only be used once. Once your password is reset, the link will no longer work.</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:6px 24px 18px;">
                    <p style="margin:0;font-size:13px;font-weight:600;color:#dde1ea;">&#9888;&nbsp; Didn't Request This?</p>
                    <p style="margin:3px 0 0;font-size:12px;color:#5a6278;">If you did not request a password reset, ignore this email. Your password will remain unchanged.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td align="center" style="padding:0 48px 36px;">
              <a href="${resetLink}"
                style="display:inline-block;background:linear-gradient(135deg,#d97706,#b45309);color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;letter-spacing:1px;padding:14px 40px;border-radius:8px;text-transform:uppercase;">
                Reset My Password &#8594;
              </a>
            </td>
          </tr>

          <tr>
            <td style="padding:0 48px;">
              <div style="height:1px;background:linear-gradient(90deg,transparent,#1f2a40,transparent);"></div>
            </td>
          </tr>

          <tr>
            <td style="background-color:#0d0f14;padding:20px 48px;">
              <p style="margin:0 0 4px;font-size:12px;color:#3e4557;">&#169; 2026 BugTrack. All rights reserved.</p>
              <p style="margin:0;font-size:11px;color:#2e3447;">If you didn't request this reset, you can safely ignore this email.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

module.exports = {
  welcomeEmailTemplate,
  resetPasswordTemplate
};