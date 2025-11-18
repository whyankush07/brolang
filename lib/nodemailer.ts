
import nodemailer from 'nodemailer';

interface mailProp {
    text: string,
    subject: string,
    recipient: string,
    html: string
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

export async function sendMail({ text, subject, recipient, html }: mailProp) {
    await transporter.sendMail({
        from: process.env.EMAIL,
        to: recipient,
        subject,
        text,
        html
    })
}
