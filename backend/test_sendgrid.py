import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY")

# Test email - CHANGE THIS to your email to receive test
TO_EMAIL = "terry@tisholdings.co.za"

message = Mail(
    from_email="terry@tisholdings.co.za",
    to_emails=TO_EMAIL,
    subject="✅ ESG Navigator - SendGrid Test",
    html_content="""
    <h2>SendGrid Integration Working!</h2>
    <p>Your ESG Navigator email outreach is ready.</p>
    <p><strong>Next:</strong> Launch campaign to 50 SME targets.</p>
    <p>- TIS Holdings AI Team</p>
    """
)

try:
    sg = SendGridAPIClient(SENDGRID_API_KEY)
    response = sg.send(message)
    print(f"✅ SUCCESS! Status: {response.status_code}")
    print(f"📧 Test email sent to: {TO_EMAIL}")
except Exception as e:
    print(f"❌ Error: {e}")
