import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import { useNotificationDispatch } from './NotificationContext'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { showNotification } from './utils/notify'
import { useUserValue, useUserDispatch } from './UserContext'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginVisible, setLoginVisible] = useState(false)
  const blogFormRef = useRef()
  const notificationDispatch = useNotificationDispatch()

  const user = useUserValue()
  const userDispatch = useUserDispatch()

  useEffect(() => {
    const loggedInUserJSON = window.localStorage.getItem('loggedBlogappUser')
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

  const updateBlogMutation = useMutation({
    mutationFn: (updatedBlog) => blogService.update(updatedBlog.id, updatedBlog),
    onSuccess: (updatedBlog) => {
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(
        ['blogs'],
        blogs.map((blog) => (blog.id === updatedBlog.id ? updatedBlog : blog))
      )
      showNotification(notificationDispatch, 'Like action success!', 'success')
    },
    onError: (error) => {
      console.error(error)
      showNotification(notificationDispatch, 'Failed to like the blog. Please try again', 'error')
    }
  })
  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(['blogs'], blogs.concat(newBlog))
      showNotification(
        notificationDispatch,
        `a new blog ${newBlog.title} by ${newBlog.author} added`,
        'success'
      )
    },
    onError: (error) => {
      console.error(error)
      showNotification(notificationDispatch, 'Failed to add blog. Please try again.', 'error')
    }
  })
  const deleteBlogMutation = useMutation({
    mutationFn: (blog) => blogService.deleteBlog(blog.id),
    onSuccess: (_, blog) => {
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(
        ['blogs'],
        blogs.filter((b) => b.id !== blog.id)
      )
      showNotification(
        notificationDispatch,
        `Deleted blog: ${blog.title} by ${blog.author}`,
        'success'
      )
    },
    onError: (error) => {
      console.error(error)
      showNotification(notificationDispatch, 'Failed to delete blog. Please try again.', 'error')
    }
  })

  if (isLoadingBlogs) {
    return <div>loading data...</div>
  }

  if (isError) {
    return <span>blog service is not available due to problems in server</span>
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username,
        password
      })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)

      userDispatch({ type: 'LOGIN', payload: user })
      setUsername('')
      setPassword('')
      showNotification(
        notificationDispatch,
        `Welcome ${user.name}! You have successfully logged in.`,
        'success'
      )
    } catch (exception) {
      console.log('exception: ', exception)
      showNotification(notificationDispatch, 'Wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.clear()
    userDispatch({ type: 'LOGOUT' })
    setLoginVisible(false)
    showNotification(notificationDispatch, 'You have successfully logged out.', 'success')
  }

  const handleAddBlog = (newBlogObject) => {
    newBlogMutation.mutate(newBlogObject)
    blogFormRef.current.toggleVisibility()
  }

  const handleUpdateLikes = (blogToUpdate) => {
    updateBlogMutation.mutate({ ...blogToUpdate, likes: blogToUpdate.likes + 1 })
  }

  const handleDeleteBlog = async (blogToDelete) => {
    if (window.confirm(`Remove blog ${blogToDelete.title} by ${blogToDelete.author}`)) {
      deleteBlogMutation.mutate(blogToDelete)
    }
  }

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }
    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  console.log('blogs', blogs)
  console.log('user', user)
  return (
    <div>
      <h1>Blogs</h1>
      <Notification />

      {!user ? (
        <div>{loginForm()}</div>
      ) : (
        <div>
          <p>{user.name} logged-in</p>
          <button onClick={handleLogout}>logout</button>

          <Togglable showButtonLabel='create new blog' hideButtonLabel='cancel' ref={blogFormRef}>
            <BlogForm createBlog={handleAddBlog} />
          </Togglable>

          {blogs
            .sort((a, b) => b.likes - a.likes)
            .map((blog) => (
              <Blog
                key={blog.id}
                blog={blog}
                handleLikeClick={() => handleUpdateLikes(blog)}
                handleRemoveClick={() => handleDeleteBlog(blog)}
                userId={user?.id}
              />
            ))}
        </div>
      )}
    </div>
  )
}

export default App
