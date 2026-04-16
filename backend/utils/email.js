import nodemailer from 'nodemailer';

export const sendInterviewEmail = async (studentEmail, applicantName, jobTitle, companyName, interviewDate, interviewLink) => {
    try {
        let transporter;
        if (process.env.SMTP_HOST && process.env.SMTP_USER) {
            transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT || 587,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS
                }
            });
        } else {
            console.log("No SMTP credentials found. Generating test Ethereal account...");
            const testAccount = await nodemailer.createTestAccount();
            transporter = nodemailer.createTransport({
                host: testAccount.smtp.host,
                port: testAccount.smtp.port,
                secure: testAccount.smtp.secure,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass
                }
            });
        }

        const formattedDate = new Date(interviewDate).toLocaleString('en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });

        const message = {
            from: `"JobPortal - ${companyName}" <no-reply@jobportal.com>`,
            to: studentEmail,
            subject: `Interview Invitation for ${jobTitle} at ${companyName}`,
            text: `Hi ${applicantName},\n\nCongratulations! You have been shortlisted for the ${jobTitle} position at ${companyName}.\n\nAn interview has been scheduled for you on ${formattedDate}.\n\nPlease join using the following link at the scheduled time:\n${interviewLink}\n\nBest regards,\nThe ${companyName} Team`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #4F46E5;">Congratulations, ${applicantName}!</h2>
                    <p>You have been shortlisted for the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong>.</p>
                    <div style="background-color: #F8FAFC; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 0;"><strong>Interview Date & Time:</strong></p>
                        <p style="font-size: 16px; color: #1E293B;">${formattedDate}</p>
                        <p style="margin: 20px 0 0 0;"><strong>Meeting Link:</strong></p>
                        <a href="${interviewLink}" style="display: inline-block; background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; margin-top: 10px;">Join Interview</a>
                    </div>
                    <p>If you have any questions or need to reschedule, please contact the recruiter directly through the portal.</p>
                    <p>Best regards,<br>The ${companyName} Team</p>
                </div>
            `
        };

        const info = await transporter.sendMail(message);
        console.log('Message sent: %s', info.messageId);
        
        // For ethereal email testing, this logs the preview URL
        if (!process.env.SMTP_HOST) {
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        }
        
        return true;
    } catch (error) {
        console.error("Error sending email: ", error);
        return false;
    }
};
