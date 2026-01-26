import smtplib
from email.message import EmailMessage
from core.config import (
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USERNAME,
    SMTP_PASSWORD,
    EMAIL_FROM,
)

FRONTEND_URL = "http://localhost:5173"


def otp_email_template(otp: str) -> str:
    return f"""
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
        <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 20px; border-radius: 8px;">
          <h2 style="color: #333;">InstaMakaan Verification</h2>
          <p>Your verification code is:</p>
          <div style="font-size: 28px; font-weight: bold; letter-spacing: 6px; margin: 20px 0;">
            {otp}
          </div>
          <p>This OTP is valid for <b>2 minutes</b>.</p>
          <p style="color: #888; font-size: 12px;">
            If you did not request this, please ignore this email.
          </p>
        </div>
      </body>
    </html>
    """


def reset_password_email_template(reset_link: str) -> str:
    return f"""
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
        <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 20px; border-radius: 8px;">
          <h2 style="color: #333;">Reset Your InstaMakaan Password</h2>
          <p>We received a request to reset your password.</p>

          <a href="{reset_link}"
             style="
               display: inline-block;
               margin: 20px 0;
               padding: 12px 20px;
               background-color: #2563eb;
               color: #ffffff;
               text-decoration: none;
               border-radius: 6px;
               font-weight: bold;
             ">
            Reset Password
          </a>

          <p>This link will expire in <b>15 minutes</b>.</p>
          <p style="color: #888; font-size: 12px;">
            If you did not request this, you can safely ignore this email.
          </p>
        </div>
      </body>
    </html>
    """


async def send_email_otp(to_email: str, content: str):
    """
    content can be:
    - OTP (numbers)
    - Reset password link (URL)
    """

    if not SMTP_USERNAME or not SMTP_PASSWORD:
        raise RuntimeError("SMTP credentials are not configured")

    msg = EmailMessage()
    msg["From"] = EMAIL_FROM
    msg["To"] = to_email

    # template
    if content.startswith("http"):
        msg["Subject"] = "Reset your InstaMakaan password"
        html_body = reset_password_email_template(content)
    else:
        msg["Subject"] = "Your InstaMakaan verification code"
        html_body = otp_email_template(content)

    msg.set_content("Please use an email client that supports HTML.")
    msg.add_alternative(html_body, subtype="html")

    # SMTP SEND
    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
        server.starttls()
        server.login(SMTP_USERNAME, SMTP_PASSWORD)
        server.send_message(msg)
