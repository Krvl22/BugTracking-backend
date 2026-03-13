const welcomeEmailTemplate = (user) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8"/>
    <title>Welcome to BugTrack</title>
  </head>
  <body style="font-family:Arial;background:#0d0f14;color:white;padding:30px;">
      <h2>Welcome ${user.firstName} ${user.lastName} 🚀</h2>
      <p>Your BugTrack account has been created successfully.</p>

      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Role:</strong> ${user.role}</p>

      <br/>
      <a href="http://localhost:5173/" 
         style="padding:10px 20px;background:#2563eb;color:white;text-decoration:none;border-radius:5px;">
         Login to BugTrack
      </a>

      <p style="margin-top:20px;font-size:12px;color:#aaa;">
        If you didn't create this account, ignore this email.
      </p>
  </body>
  </html>
  `;
};

module.exports = { welcomeEmailTemplate };