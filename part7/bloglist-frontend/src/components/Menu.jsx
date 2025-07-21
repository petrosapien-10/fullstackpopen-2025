import { AppBar, Toolbar, Button, Box, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import ArticleIcon from '@mui/icons-material/Article'
import PeopleIcon from '@mui/icons-material/People'

const Menu = ({ user, onLogout }) => (
  <AppBar position='static' sx={{ bgcolor: 'secondary.main' }}>
    <Toolbar>
      <Button
        color='inherit'
        component={RouterLink}
        to='/'
        startIcon={<ArticleIcon />}
        sx={{
          '&:hover': {
            backgroundColor: 'primary.main',
            color: 'white'
          }
        }}
      >
        Blogs
      </Button>
      <Button
        color='inherit'
        component={RouterLink}
        to='/users'
        startIcon={<PeopleIcon />}
        sx={{
          '&:hover': {
            backgroundColor: 'primary.main',
            color: 'white'
          }
        }}
      >
        Users
      </Button>
      {user && (
        <Box display='flex' alignItems='center' gap={2} ml='auto'>
          <Typography variant='body2' color='inherit'>
            {user.username} logged in
          </Typography>
          <Button
            variant='contained'
            sx={{
              backgroundColor: 'primary.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'primary.dark',
                color: 'white'
              }
            }}
            onClick={onLogout}
          >
            Logout
          </Button>
        </Box>
      )}
    </Toolbar>
  </AppBar>
)

export default Menu
