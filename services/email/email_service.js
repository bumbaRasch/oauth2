// services/email/email_service.js
import nodemailer from 'nodemailer';

export const email_service = {
    send_email: async (email, subject, text) => {
        // Generate test SMTP service account from ethereal.email
        let testAccount = await nodemailer.createTestAccount();

        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: testAccount.user,
                pass: testAccount.pass, 
            },
        });

        const mailOptions = {
            from: '"Vasy Pupok" <vasyp>', // sender address
            to: email, 
            subject: subject, 
            text: text, 
        };

        try {
            const info = await transporter.sendMail(mailOptions);
            console.log("Message sent: %s", info.messageId);
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        } 
        catch (error) {
            console.error(`Failed to send email: ${error}`);
            throw error;
        }
    },
};