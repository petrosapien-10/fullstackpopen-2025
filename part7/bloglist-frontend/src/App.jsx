import { useState, useEffect, useRef } from 'react'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'
import LoginForm from './components/LoginForm'
import { useNotificationDispatch } from './NotificationContext'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { showNotification } from './utils/notify'
import { useUserValue, useUserDispatch } from './UserContext'
import { Routes, Route, Link as RouterLink } from 'react-router-dom'
import Blog from './components/Blog'
import UserList from './components/UserList'
import User from './components/User'
import Menu from './components/Menu'
import Home from './components/Home'

import { Typography, Button, Box, Container, Link } from '@mui/material'
const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginVisible, setLoginVisible] = useState(false)
  const blogFormRef = useRef()
  const notificationDispatch = useNotificationDispatch()

  const user = useUserValue()
  const userDispatch = useUserDispatch()

  useEffect(() => {
    const loggedInUserJSON = window.localStorage.getItem('loggedInBlogappUser')
    if (loggedInUserJSON) {
      const user = JSON.parse(loggedInUserJSON)
      blogService.setToken(user.token)
      userDispatch({ type: 'LOGIN', payload: user })
    }
  }, [userDispatch])

  const queryClient = useQueryClient()
  const {
    isError,
    isLoading: isLoadingBlogs,
    data: blogs
  } = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
    refetchOnWindowFocus: false,
    retry: 1
  })

  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData(['blogs']) || []
      queryClient.setQueryData(['blogs'], blogs.concat(newBlog))
      showNotification(
        notificationDispatch,
        `A new blog "${newBlog.title}" by ${newBlog.author} added`,
        'success'
      )
    },
    onError: () => {
      showNotification(notificationDispatch, 'Failed to add blog. Please try again.', 'error')
    }
  })

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedInBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      userDispatch({ type: 'LOGIN', payload: user })
      setUsername('')
      setPassword('')
      showNotification(notificationDispatch, `Welcome ${user.name}!`, 'success')
    } catch {
      showNotification(notificationDispatch, 'Wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.clear()
    userDispatch({ type: 'LOGOUT' })
    setLoginVisible(false)
    showNotification(notificationDispatch, 'You have logged out.', 'success')
  }

  const handleAddBlog = (newBlogObject) => {
    newBlogMutation.mutate(newBlogObject)
    blogFormRef.current.toggleVisibility()
  }

  const loginForm = () => (
    <Box mt={2}>
      {!loginVisible ? (
        <Button variant='outlined' onClick={() => setLoginVisible(true)}>
          Log in
        </Button>
      ) : (
        <Box>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
          <Button variant='text' onClick={() => setLoginVisible(false)} sx={{ mt: 1 }}>
            Cancel
          </Button>
        </Box>
      )}
    </Box>
  )

  if (isLoadingBlogs) return <Typography>Loading data...</Typography>
  if (isError) return <Typography color='error'>Blog service is not available.</Typography>

  return (
    <Container>
      <Menu user={user} onLogout={handleLogout} />
      <Box mt={2}>
        <Notification />
        <Typography variant='h3' gutterBottom>
          Blog App
        </Typography>

        <Routes>
          <Route
            path='/'
            element={
              !user ? (
                loginForm()
              ) : (
                <Home
                  user={user}
                  blogs={blogs}
                  onLogout={handleLogout}
                  onAddBlog={handleAddBlog}
                  blogFormRef={blogFormRef}
                />
              )
            }
          />
          <Route path='/users' element={<UserList />} />
          <Route path='/users/:id' element={<User />} />
          <Route path='/blogs/:id' element={<Blog />} />
        </Routes>
      </Box>
    </Container>
  )
}

export default App
