import nodemailer from "nodemailer"

export async function sendEmail({
    from = process.env.APP_EMAIL,
    to = "",
    subject = "Smart Football App",
    text = "",
    html = "",
    cc = "",
    bcc = "",
    attachments = []
} = {}) {

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.APP_EMAIL,
            pass: process.env.APP_PASSWORD,
        },
    });


    const info = await transporter.sendMail({
        from: `"Smart Football ⚽" <${from}>`,
        to, subject, text, cc, bcc, html, attachments
    });

}