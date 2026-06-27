import { EmailService } from '../EmailService'

jest.mock('nodemailer', () => ({
  createTestAccount: jest.fn().mockResolvedValue({ user: 'test@test.com', pass: 'pass' }),
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue({ messageId: 'test-id' }),
  }),
  getTestMessageUrl: jest.fn().mockReturnValue('http://preview.test'),
}))

import nodemailer from 'nodemailer'

describe('EmailService', () => {
  let emailService: EmailService

  beforeEach(() => {
    emailService = new EmailService()
  })

  it('deve chamar sendMail com os parâmetros corretos', async () => {
    const options = {
      to: 'destinatario@example.com',
      subject: 'Assunto de teste',
      text: 'Corpo do e-mail de teste',
    }

    await emailService.sendEmail(options)

    const mockCreateTransport = nodemailer.createTransport as jest.Mock
    const mockTransporter = mockCreateTransport.mock.results[0].value
    const mockSendMail = mockTransporter.sendMail as jest.Mock

    expect(mockSendMail).toHaveBeenCalledTimes(1)
    expect(mockSendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: options.to,
        subject: options.subject,
        text: options.text,
      })
    )
  })

  it('deve criar uma conta de teste no Ethereal', async () => {
    await emailService.sendEmail({
      to: 'user@test.com',
      subject: 'Test',
      text: 'Hello',
    })

    expect(nodemailer.createTestAccount).toHaveBeenCalledTimes(1)
  })

  it('deve criar um transporter com as credenciais da conta de teste', async () => {
    await emailService.sendEmail({
      to: 'user@test.com',
      subject: 'Test',
      text: 'Hello',
    })

    expect(nodemailer.createTransport).toHaveBeenCalledWith(
      expect.objectContaining({
        auth: expect.objectContaining({
          user: 'test@test.com',
          pass: 'pass',
        }),
      })
    )
  })
})
