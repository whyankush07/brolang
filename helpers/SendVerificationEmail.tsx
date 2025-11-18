import { sendMail } from "@/lib/nodemailer";

export default async function sendVerificationEmail(
    userName: string,
    email: string,
    verificationCode: string
) {
    await sendMail({
        subject: "Verify Your NeuraHub Account",
        recipient: email,
        text: `Hello ${userName}, Your verification code is: ${verificationCode}. This code will expire in 10 minutes.`,
        html: `
        <div style="font-family: 'Helvetica', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; color: #333333;">
            <!-- Header with Logo -->
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #00B2FF; font-size: 32px; font-weight: bold; letter-spacing: 1px; margin: 0;">NeuraHub</h1>
                <p style="font-size: 14px; color: #666666; letter-spacing: 0.5px; margin-top: 8px;">Multi-Agent Automation Ecosystem</p>
            </div>
            
            <!-- Divider -->
            <div style="border-top: 2px solid #00B2FF; margin: 20px 0;"></div>
            
            <!-- Main Content -->
            <div style="margin-bottom: 30px;">
                <h2 style="color: #333333; font-size: 22px; margin-bottom: 15px;">Verify Your Account</h2>
                <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">Hello ${userName},</p>
                <p style="font-size: 16px; line-height: 1.6; margin-bottom: 25px;">Thank you for joining NeuraHub! To complete your registration and start automating with our intelligent agents, please use the verification code below:</p>
                
                <!-- Verification Code Box -->
                <div style="background: linear-gradient(135deg, #00B2FF 0%, #0091CC 100%); border-radius: 12px; padding: 30px; margin: 30px 0; text-align: center; box-shadow: 0 4px 6px rgba(0, 178, 255, 0.2);">
                    <p style="font-size: 14px; color: #ffffff; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px;">Your Verification Code</p>
                    <p style="font-size: 36px; font-weight: bold; color: #ffffff; letter-spacing: 8px; margin: 0; font-family: 'Courier New', monospace;">${verificationCode}</p>
                </div>
                
                <div style="background-color: #f8f9fa; border-left: 4px solid #00B2FF; border-radius: 4px; padding: 15px; margin: 25px 0;">
                    <p style="font-size: 14px; line-height: 1.5; margin: 0; color: #666666;">
                        ⏱️ <strong>Important:</strong> This verification code will expire in <strong>10 minutes</strong> for your security.
                    </p>
                </div>
                
                <p style="font-size: 16px; line-height: 1.6; margin-top: 25px;">Once verified, you'll have access to:</p>
                <ul style="font-size: 15px; line-height: 1.8; color: #555555; margin: 15px 0; padding-left: 20px;">
                    <li>Autonomous AI agent coordination</li>
                    <li>Multi-agent task automation</li>
                    <li>Real-time workflow management</li>
                    <li>Advanced automation analytics</li>
                </ul>
            </div>
            
            <!-- Security Notice -->
            <div style="background-color: #fff8e6; border-radius: 8px; padding: 18px; margin: 25px 0; border: 1px solid #ffe59e;">
                <p style="font-size: 14px; line-height: 1.5; margin: 0; color: #856404;">
                    🔒 <strong>Security Tip:</strong> Never share this code with anyone. NeuraHub will never ask for your verification code via email or phone.
                </p>
            </div>
            
            <!-- Support Section -->
            <div style="margin-bottom: 30px;">
                <h3 style="color: #333333; font-size: 18px; margin-bottom: 15px;">Need Help?</h3>
                <p style="font-size: 15px; line-height: 1.6;">If you didn't create a NeuraHub account or have any questions, please contact our support team at <a href="mailto:support@neurahub.dev" style="color: #00B2FF; text-decoration: none; font-weight: 500;">support@neurahub.dev</a></p>
            </div>
            
            <!-- Divider -->
            <div style="border-top: 1px solid #e9ecef; margin: 30px 0;"></div>
            
            <!-- Footer -->
            <div style="text-align: center; font-size: 13px; color: #888888; margin-top: 30px;">
                <p style="margin-bottom: 15px;">Built by <strong>Ankush Singh</strong></p>
                <p style="margin-bottom: 15px;">&copy; 2025 NeuraHub. All rights reserved.</p>
                <p style="margin-top: 15px;">
                    <a href="https://neurahub.whyankush.wtf/privacy" style="color: #00B2FF; text-decoration: none; margin: 0 10px;">Privacy Policy</a> | 
                    <a href="https://neurahub.whyankush.wtf/terms" style="color: #00B2FF; text-decoration: none; margin: 0 10px;">Terms of Service</a> | 
                    <a href="https://neurahub.whyankush.wtf/contact" style="color: #00B2FF; text-decoration: none; margin: 0 10px;">Contact Us</a>
                </p>
                <p style="margin-top: 15px; color: #aaaaaa; font-size: 12px;">
                    Follow us: <a href="https://twitter.com/whyankush07" style="color: #00B2FF; text-decoration: none;">@howankush07</a>
                </p>
            </div>
        </div>
        `
    });
}