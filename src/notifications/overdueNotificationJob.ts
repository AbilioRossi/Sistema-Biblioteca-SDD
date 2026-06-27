import cron from 'node-cron'
import { EmailService } from './EmailService'
import { NotifyOverdueLoansUseCase } from './NotifyOverdueLoansUseCase'

export function scheduleOverdueNotificationJob(): void {
  cron.schedule('0 8 * * *', async () => {
    console.log('[CRON] Verificando empréstimos em atraso...')
    const emailService = new EmailService()
    const useCase = new NotifyOverdueLoansUseCase(emailService)
    await useCase.execute()
    console.log('[CRON] Notificações enviadas.')
  })
}
