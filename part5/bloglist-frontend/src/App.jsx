import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])

  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [loginVisible, setLoginVisible] = useState(false)
  const blogFormRef = useRef()

  console.log('user: ', user)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)

      setUser(user)
      setUsername('')
      setPassword('')
      showMessage(`Welcome ${user.name}! You have successfully logged in.`, 'success')
    } catch (exception) {
      console.log('exception: ', exception)
      showMessage('Wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.clear()
    setUser(null)
    showMessage('You have successfully logged out.', 'success')
  }

  const showMessage = (message, type, duration = 3000) => {
    setMessage(message)
    setMessageType(type)
    setTimeout(() => {
      setMessage(null)
      setMessageType('')
    }, duration)
  }


  const handleAddBlog = async (newBlogObject) => {
    try {
      const returnedBlog = await blogService.create(newBlogObject)
      setBlogs(blogs.concat(returnedBlog))
      blogFormRef.current.toggleVisibility()

      showMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`, 'success')
    } catch (error) {
      console.error('failed to create blog', error)
      showMessage('Failed to add blog. Please try again.', 'error')
    }
  }

  const handleUpdateLikes = async (blogToUpdate) => {
    try {
      const updatedBlog = {
        ...blogToUpdate,
        likes: blogToUpdate.likes + 1,
        user: blogToUpdate?.user?.id || ''
      }

      const returnedBlog = await blogService.update(blogToUpdate.id, updatedBlog)

      setBlogs(blogs.map(blog =>
        blog.id === blogToUpdate.id ? returnedBlog : blog
      ))

      showMessage('Like action success!', 'success')
    } catch (error) {
      console.error('Failed to update blog\'s likes')
      showMessage('Failed to like the blog. Please try again', 'error')
    }
  }

  const handleDeleteBlog = async (blogToDelete) => {
    if (window.confirm(`Remove blog ${blogToDelete.title} by ${blogToDelete.author}`)) {
      try {
        await blogService.deleteBlog(blogToDelete.id)
        setBlogs(blogs.filter(blog => blog.id !== blogToDelete.id))
        showMessage(`Deleted blog: ${blogToDelete.title} by ${blogToDelete.author}`, 'success')
      } catch (error) {
        console.error('Failed to delete blog', error)
        showMessage('Failed to delete blog. Please try again.', 'error')
      }
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

  return (
    <div>
      <h1>Blogs</h1>
      <Notification message={message} type={messageType} />

      {!user ?
        <div>
          {loginForm()}
        </div> :

        <div>
          <p>{user.name} logged-in</p>
          <button onClick={handleLogout}>logout</button>

          <Togglable showButtonLabel='create new blog' hideButtonLabel='cancel' ref={blogFormRef}>
            <BlogForm createBLog={handleAddBlog} />
          </Togglable>

          {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
            <Blog key={blog.id} blog={blog} handleLikeClick={() => handleUpdateLikes(blog)} handleRemoveClick={() => handleDeleteBlog(blog)} userId={user?.id} />
          )}
        </div>

      }
    </div>
  )
}

export default App