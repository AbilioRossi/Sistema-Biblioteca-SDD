import prisma from '../lib/prisma'
import { EmailService } from './EmailService'

// LIMITAÇÃO: O modelo User no schema Prisma não possui campo `email`.
// Como contorno, o endereço de e-mail é derivado do campo `user.name`
// usando o padrão: primeironome.sobrenome@biblioteca.local.
// Para produção, adicionar o campo `email` ao modelo User no schema.prisma.
function buildEmailFromName(name: string): string {
  return `${name.toLowerCase().replace(/\s+/g, '.')}@biblioteca.local`
}

export class NotifyOverdueLoansUseCase {
  constructor(private readonly emailService: EmailService) {}

  async execute(): Promise<void> {
    const overdueThreshold = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

    const overdueLoans = await prisma.loan.findMany({
      where: {
        returnedAt: null,
        borrowedAt: { lt: overdueThreshold },
      },
      include: {
        user: true,
        book: true,
      },
    })

    for (const loan of overdueLoans) {
      const daysLate =
        Math.floor((Date.now() - loan.borrowedAt.getTime()) / (1000 * 60 * 60 * 24)) - 7

      const penaltyFee = daysLate * 2.0

      const message =
        `Aviso: O livro ${loan.book.title} está com devolução atrasada. ` +
        `Multa atual: R$ ${penaltyFee.toFixed(2)}.`

      await this.emailService.sendEmail({
        to: buildEmailFromName(loan.user.name),
        subject: 'Aviso de Atraso',
        text: message,
      })
    }
  }
}
