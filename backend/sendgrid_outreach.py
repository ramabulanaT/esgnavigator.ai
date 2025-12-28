"""
TIS-IntelliMat ESG Navigator - SendGrid Email Outreach
Target: 50 SMEs (excluding 14 laggards)
"""
import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Email, To
from typing import List, Dict

SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY")
FROM_EMAIL = "terry@tisholdings.co.za"
FROM_NAME = "Dr. Terry Ramabulana | TIS Holdings"

class ESGOutreach:
    def __init__(self):
        self.client = SendGridAPIClient(SENDGRID_API_KEY)
    
    def send(self, to_email: str, to_name: str, subject: str, html: str) -> Dict:
        message = Mail(
            from_email=Email(FROM_EMAIL, FROM_NAME),
            to_emails=To(to_email, to_name),
            subject=subject,
            html_content=html
        )
        try:
            response = self.client.send(message)
            return {"success": True, "status": response.status_code, "to": to_email}
        except Exception as e:
            return {"success": False, "error": str(e), "to": to_email}
    
    def assessment_email(self, company: Dict) -> Dict:
        score = company.get('esg_score', 0)
        color = "#38a169" if score >= 75 else "#d69e2e" if score >= 50 else "#e53e3e"
        
        subject = f"{company['name']} - Free ESG Assessment Invitation"
        html = f"""
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #1a365d 0%, #2c5282 100%); padding: 30px; text-align: center;">
                <h1 style="color: white; margin: 0;">ESG Navigator</h1>
                <p style="color: #bee3f8; margin: 5px 0 0 0;">AI-Powered ESG Intelligence</p>
            </div>
            <div style="padding: 30px; background: #f7fafc;">
                <p>Dear {company.get('contact_name', 'ESG Team')},</p>
                <p>Our AI-powered ESG Navigator has analyzed <strong>{company['name']}</strong>'s sustainability data.</p>
                <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid {color};">
                    <h3 style="margin-top: 0;">Preliminary Analysis</h3>
                    <p><strong>ESG Score:</strong> <span style="color: {color}; font-size: 24px; font-weight: bold;">{score}/100</span></p>
                    <p><strong>Sector:</strong> {company.get('sector', 'N/A')}</p>
                </div>
                <h3>Your Complimentary Assessment Includes:</h3>
                <ul>
                    <li>✅ Full ESG gap analysis (GRI, SASB, JSE)</li>
                    <li>✅ ISO 14001/45001/50001 compliance check</li>
                    <li>✅ ISSB Climate Disclosure readiness</li>
                    <li>✅ Training needs assessment</li>
                </ul>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="https://app.esgnavigator.ai/assessment/request" 
                       style="background: #2c5282; color: white; padding: 14px 28px; 
                              text-decoration: none; border-radius: 6px; font-weight: bold;">
                        Request Free Assessment
                    </a>
                </div>
                <p><strong>Dr. Terry Ramabulana</strong><br>
                <span style="color: #718096;">CEO, TIS Holdings | Professor, University of Johannesburg</span></p>
            </div>
        </body>
        </html>
        """
        return {"subject": subject, "html": html}
    
    def training_email(self, company: Dict) -> Dict:
        subject = f"ESG Training Programs for {company['name']}"
        html = f"""
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #276749 0%, #38a169 100%); padding: 30px; text-align: center;">
                <h1 style="color: white; margin: 0;">ESG Training Academy</h1>
            </div>
            <div style="padding: 30px; background: #f7fafc;">
                <p>Dear {company.get('contact_name', 'Training Manager')},</p>
                <p>Based on our analysis of {company['name']}, we recommend these training modules:</p>
                <div style="background: white; border-radius: 8px; padding: 15px; margin: 10px 0;">
                    <strong>🎓 ESG Fundamentals</strong> - GRI, SASB, TCFD | 8 hours
                </div>
                <div style="background: white; border-radius: 8px; padding: 15px; margin: 10px 0;">
                    <strong>🎓 ISSB Climate Disclosure</strong> - IFRS S1 & S2 | 6 hours
                </div>
                <div style="background: white; border-radius: 8px; padding: 15px; margin: 10px 0;">
                    <strong>🎓 ISO Management Systems</strong> - 14001, 45001, 50001 | 12 hours
                </div>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="https://app.esgnavigator.ai/training" 
                       style="background: #276749; color: white; padding: 14px 28px; 
                              text-decoration: none; border-radius: 6px; font-weight: bold;">
                        View Training Programs
                    </a>
                </div>
                <p><strong>Dr. Terry Ramabulana</strong><br>TIS Holdings</p>
            </div>
        </body>
        </html>
        """
        return {"subject": subject, "html": html}
    
    def send_campaign(self, companies: List[Dict], email_type: str = "assessment") -> List[Dict]:
        results = []
        for company in companies:
            if not company.get('contact_email'):
                print(f"⚠️ {company['name']} - No email, skipped")
                continue
            
            if email_type == "training":
                email = self.training_email(company)
            else:
                email = self.assessment_email(company)
            
            result = self.send(
                to_email=company['contact_email'],
                to_name=company.get('contact_name', 'ESG Team'),
                subject=email['subject'],
                html=email['html']
            )
            results.append(result)
            status = "✅" if result['success'] else "❌"
            print(f"{status} {company['name']}")
        
        success = sum(1 for r in results if r['success'])
        print(f"\n📧 Sent: {success}/{len(results)}")
        return results


if __name__ == "__main__":
    print("ESG Navigator - SendGrid Ready")
    print(f"API Key: {'✅ Set' if SENDGRID_API_KEY else '❌ Missing'}")
