// services/email/email_service.js
import nodemailer from 'nodemailer';

export const email_service = {
    send_email: async (email, subject, html_content) => {
        nodemailer.createTestAccount(async (err, account) => {
            if (err) {
                console.error('Failed to create a testing account. ' + err.message);
                return process.exit(1);
            }
            
            let transporter = nodemailer.createTransport({
                host: account.smtp.host,
                port: account.smtp.port,
                secure: account.smtp.secure,
                auth: {
                    user: account.user,
                    pass: account.pass
                }
            });
            console.log(transporter.options.auth.user, transporter.options.auth.pass)

            let message = {
                from: 'Sender Name <sender@example.com>',
                to: email,
                subject: subject,
                html: html_content
            };
        
            transporter.sendMail(message, async (err, info) => {
                if (err) {
                    console.log('Error occurred. ' + err.message);
                    return process.exit(1);
                }
        
                console.log('Message sent: %s', info.messageId);
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            });
        });
    },
};