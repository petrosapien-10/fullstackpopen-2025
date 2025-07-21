import { Box, Typography, Paper, List, ListItem, ListItemText } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useMatch } from 'react-router-dom'
import userService from '../services/users'

const User = () => {
  const match = useMatch('/users/:id')
  const userId = match?.params?.id

  const {
    data: user = null,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => userService.getById(userId),
    enabled: !!userId
  })

  if (isLoading) return <Typography>Loading user...</Typography>
  if (isError) return <Typography color='error'>Error: {error.message}</Typography>

  return (
    <Paper sx={{ p: 3, mt: 4 }}>
      <Typography variant='h4' gutterBottom>
        {user.username}
      </Typography>

      <Typography variant='h6' gutterBottom>
        Added blogs
      </Typography>

      <List dense>
        {user.blogs.map((blog) => (
          <ListItem key={blog.id} sx={{ pl: 0 }}>
            <ListItemText primary={blog.title} />
          </ListItem>
        ))}
      </List>
    </Paper>
  )
}

export default User
