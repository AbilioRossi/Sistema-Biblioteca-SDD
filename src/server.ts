import app from './app'
import { scheduleOverdueNotificationJob } from './notifications/overdueNotificationJob'

scheduleOverdueNotificationJob()

app.listen(3000, () => {
  console.log('Server running on port 3000')
})
