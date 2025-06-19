import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

//creating a transporter object using the default SMTP transport
const owner= process.env.EMAIL_USER;
const Pswd= process.env.EMAIL_PASS;
//transporter transports the email using the SMTP protocol
const transporter=nodemailer.createTransport({
    service: 'gmail', // Using Gmail as the email service
    auth: {// Authentication details for the email account
        user: owner, // Your email address
        pass: Pswd  // Your email password or app password
    }
})

//function to send an email
interface emailDetails{
    to: string; // Recipient's email address
    subject: string; // Subject of the email
    html: string; // Plain text content of the email
}

export const sendEmail=async (emailDetails: emailDetails): Promise<void> => {
    try{
        const emailInfo= await transporter.sendMail({
            from: owner, // Sender's email address
            to: emailDetails.to, // Recipient's email address
            subject: emailDetails.subject, // Subject of the email
            html: emailDetails.html // Plain text content of the email
        });
        console.log('Email sent successfully:', emailInfo.response);
    }catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Email sending failed');
    }
}