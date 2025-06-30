import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import "./index.css";


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogUrl, setNewBlogUrl] = useState('')

  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

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

  const addBlog = async (event) => {
    event.preventDefault()

    try {
      const newBlogObject = {
        title: newBlogTitle,
        author: newBlogAuthor,
        url: newBlogUrl
      }


      const returnedBlog = await blogService.create(newBlogObject)
      setBlogs(blogs.concat(returnedBlog))

      showMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`, "success")

      setNewBlogTitle('')
      setNewBlogAuthor('')
      setNewBlogUrl('')

    } catch (error) {
      console.error('failed to create blog', error)
      showMessage("Failed to add blog. Please try again.", "error")
    }
  }

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

      showMessage(`Welcome ${user.name}! You have successfully logged in.`, "success")
    } catch (exception) {
      console.log('exception: ', exception)
      showMessage("Wrong username or password", "error")
    }
  }

  const handleLogout = () => {
    window.localStorage.clear()
    setUser(null)

    showMessage("You have successfully logged out.", "success")
  }

  const showMessage = (message, type, duration = 3000) => {
    setMessage(message)
    setMessageType(type)

    setTimeout(() => {
      setMessage(null)
    }, duration)
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type='text'
          value={username}
          name='Username'
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type='password'
          value={password}
          name='Password'
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type='submit'>login</button>
    </form>
  )

  const blogForm = () => (
    <>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            type="text"
            value={newBlogTitle}
            onChange={({ target }) => setNewBlogTitle(target.value)}
          />
        </div>
        <div>
          author:
          <input
            type="text"
            value={newBlogAuthor}
            onChange={({ target }) => setNewBlogAuthor(target.value)}
          />
        </div>
        <div>
          url:
          <input
            type="text"
            value={newBlogUrl}
            onChange={({ target }) => setNewBlogUrl(target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </>
  )


  return (
    <div>
      <Notification message={message} type={messageType} />
      {user === null ?
        <div>
          <h2>log in to application</h2>
          {loginForm()}
        </div> :
        <div>
          <h2>blogs</h2>
          <p>{user.name} logged-in</p>
          <button onClick={handleLogout}>logout</button>

          {blogForm()}

          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
          )}

        </div>
      }

    </div>
  )
}

export default App