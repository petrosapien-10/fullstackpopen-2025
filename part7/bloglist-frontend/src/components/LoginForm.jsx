import PropTypes from 'prop-types'
import { Box, Button, TextField, Typography, Paper } from '@mui/material'

const LoginForm = ({
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password
}) => {
  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant='h5' gutterBottom>
        Login
      </Typography>

      <Box component='form' onSubmit={handleSubmit} display='flex' flexDirection='column' gap={2}>
        <TextField
          data-testid='username'
          label='Username'
          type='text'
          value={username}
          onChange={handleUsernameChange}
          fullWidth
        />

        <TextField
          data-testid='password'
          label='Password'
          type='password'
          value={password}
          onChange={handlePasswordChange}
          fullWidth
        />

        <Button
          type='submit'
          variant='contained'
          color='primary'
          size='small'
          sx={{ alignSelf: 'flex-start' }}
        >
          Login
        </Button>
      </Box>
    </Paper>
  )
}

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired
}

export default LoginForm
