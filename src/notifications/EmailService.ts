import nodemailer from 'nodemailer'

export interface SendEmailOptions {
  to: string
  subject: string
  text: string
}

export class EmailService {
  async sendEmail(options: SendEmailOptions): Promise<void> {
    const testAccount = await nodemailer.createTestAccount()

    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    })

    const info = await transporter.sendMail({
      from: testAccount.user,
      to: options.to,
      subject: options.subject,
      text: options.text,
    })

    console.log('Preview URL:', nodemailer.getTestMessageUrl(info))
  }
}
