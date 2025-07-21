import { Alert, Box } from '@mui/material'
import { useNotificationValue } from '../NotificationContext'

const Notification = () => {
  const { message, type } = useNotificationValue()

  if (!message) return null

  return (
    <Box my={2}>
      <Alert severity={type === 'error' ? 'error' : 'success'}>{message}</Alert>
    </Box>
  )
}

export default Notification
