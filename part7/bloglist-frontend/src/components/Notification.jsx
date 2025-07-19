import { useNotificationValue } from '../NotificationContext'

const Notification = () => {
  const { message, type } = useNotificationValue()
  if (!message) return null
  return <div className={type}>{message}</div>
}

export default Notification
