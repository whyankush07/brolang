import { sendMail } from "@/lib/nodemailer";

export default async function sendVerificationEmail(
    userName: string,
    email: string,
    verificationCode: string
) {
    await sendMail({
        subject: "Verify Your Brolang Account - Let's Code with Fun!",
        recipient: email,
        text: `Hello ${userName}, Your verification code is: ${verificationCode}. This code will expire in 10 minutes.`,
        html: `
        <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #FDFDF9; color: #3e3e3e; border-radius: 12px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
            <!-- Header with Logo -->
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #3e3e3e; font-size: 36px; font-weight: bold; letter-spacing: 2px; margin: 0; font-family: 'Courier New', monospace;">Brolang</h1>
                <p style="font-size: 16px; color: #666666; letter-spacing: 0.5px; margin-top: 8px; font-style: italic;">A fun programming language for all brothers! 🚀</p>
            </div>

            <!-- Divider -->
            <div style="border-top: 3px solid #3e3e3e; margin: 20px 0;"></div>

            <!-- Main Content -->
            <div style="margin-bottom: 30px;">
                <h2 style="color: #3e3e3e; font-size: 24px; margin-bottom: 15px; text-align: center;">Verify Your Brolang Account</h2>
                <p style="font-size: 18px; line-height: 1.6; margin-bottom: 20px;">Hey ${userName},</p>
                <p style="font-size: 16px; line-height: 1.6; margin-bottom: 25px;">Welcome to the world of Brolang! 🎉 To start coding with our fun programming language and access the online playground, please verify your account using the code below:</p>

                <!-- Verification Code Box -->
                <div style="background: linear-gradient(135deg, #3e3e3e 0%, #666666 100%); border-radius: 12px; padding: 30px; margin: 30px 0; text-align: center; box-shadow: 0 4px 6px rgba(62, 62, 62, 0.3);">
                    <p style="font-size: 14px; color: #FDFDF9; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px;">Your Verification Code</p>
                    <p style="font-size: 36px; font-weight: bold; color: #FDFDF9; letter-spacing: 8px; margin: 0; font-family: 'Courier New', monospace;">${verificationCode}</p>
                </div>

                <div style="background-color: #f0f0f0; border-left: 4px solid #3e3e3e; border-radius: 4px; padding: 15px; margin: 25px 0;">
                    <p style="font-size: 14px; line-height: 1.5; margin: 0; color: #3e3e3e;">
                        ⏱️ <strong>Important:</strong> This verification code will expire in <strong>10 minutes</strong> for your security. Let's get coding! 💻
                    </p>
                </div>

                <p style="font-size: 16px; line-height: 1.6; margin-top: 25px;">Once verified, you'll be able to:</p>
                <ul style="font-size: 15px; line-height: 1.8; color: #555555; margin: 15px 0; padding-left: 20px;">
                    <li>Write and run Brolang code in our online playground</li>
                    <li>Customize syntax and error messages</li>
                    <li>Learn programming in a fun, brotherly way</li>
                    <li>Share your code snippets with the community</li>
                </ul>
            </div>

            <!-- Fun Tip -->
            <div style="background-color: #e8f4fd; border-radius: 8px; padding: 18px; margin: 25px 0; border: 1px solid #3e3e3e;">
                <p style="font-size: 14px; line-height: 1.5; margin: 0; color: #3e3e3e;">
                    💡 <strong>Pro Tip:</strong> Brolang is all about having fun while learning! Start with simple loops and build your way up. Happy coding, brother! 👨‍💻
                </p>
            </div>

            <!-- Support Section -->
            <div style="margin-bottom: 30px;">
                <h3 style="color: #3e3e3e; font-size: 18px; margin-bottom: 15px;">Need Help?</h3>
                <p style="font-size: 15px; line-height: 1.6;">If you didn't sign up for Brolang or have questions, reach out to us at <a href="mailto:ankushsingh.dev@gmail.com" style="color: #3e3e3e; text-decoration: none; font-weight: 500;">ankushsingh.dev@gmail.com</a></p>
            </div>

            <!-- Divider -->
            <div style="border-top: 1px solid #cccccc; margin: 30px 0;"></div>

            <!-- Footer -->
            <div style="text-align: center; font-size: 13px; color: #888888; margin-top: 30px;">
                <p style="margin-bottom: 15px;">Built with ❤️ by <strong>Ankush Singh</strong></p>
                <p style="margin-bottom: 15px;">&copy; 2025 Brolang. All rights reserved.</p>
                <p style="margin-top: 15px;">
                    <a href="https://brolang.whyankush.wtf/privacy" style="color: #3e3e3e; text-decoration: none; margin: 0 10px;">Privacy Policy</a> |
                    <a href="https://brolang.whyankush.wtf/terms" style="color: #3e3e3e; text-decoration: none; margin: 0 10px;">Terms of Service</a> |
                    <a href="https://brolang.whyankush.wtf/contact" style="color: #3e3e3e; text-decoration: none; margin: 0 10px;">Contact Us</a>
                </p>
                <p style="margin-top: 15px; color: #aaaaaa; font-size: 12px;">
                    Follow us: <a href="https://twitter.com/whyankush07" style="color: #3e3e3e; text-decoration: none;">@whyankush07</a>
                </p>
            </div>
        </div>
        `
    });
}