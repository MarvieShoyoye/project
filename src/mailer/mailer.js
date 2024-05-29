const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "shoyoyemarvellous@gmail.com",
        pass: process.env.HASHPASSWORD,
    },
    tls:{
        rejectUnauthorized: false,
    },
});

async function SendEmail(to, subject, text, html) {
    const info = await transporter.sendMail({
        from: '"Citizen Times" <shoyoyemarvellous@gmail.com',
        to: to,
        subject: subject,
        text: text,
        html: html,
    });

    console.log("Message sent: %s", info.messageId);
}

module.exports = SendEmail;