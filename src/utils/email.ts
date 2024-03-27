import nodemailer, { TransportOptions } from 'nodemailer'

interface EmailOptions extends TransportOptions {
    email: string
    subject: string
    message: string
}

const sendEmail = async (options: EmailOptions): Promise<void> => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT || '465'),
            secure: false,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        })

        const mailOptions = {
            from: 'Todo App <mugishajoseph20021@gmail.com>',
            to: options.email,
            subject: options.subject,
            text: options.message,
        }

        await transporter.sendMail(mailOptions)
        console.log('Email sent successfully.')
    } catch (error) {
    }
}

export default sendEmail
