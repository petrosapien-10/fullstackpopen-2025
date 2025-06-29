const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
]

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'willremovethissoon',
    author: 'test',
    url: 'test.com',
    likes: 10
  })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

const testUser = async () => {
  const user = new User({
    username: 'test',
    name: 'Test user',
    password: 'test'
  })

  const savedUser = await user.save()
  return savedUser
}

const getUserToken = async (user) => {
  const userForToken = {
    username: user.username,
    id: user._id
  }
  const token = jwt.sign(
    userForToken,
    process.env.SECRET,
    { expiresIn: 60 * 60 }
  )

  return token
}

const createBlogsForUser = async (user, blogs) => {
  const savedBlogs = []

  for (const blog of blogs) {
    const blogWithUser = new Blog({ ...blog, user: user._id })
    const savedBlog = await blogWithUser.save()
    savedBlogs.push(savedBlog)
  }

  user.blogs = savedBlogs.map(b => b._id)
  await user.save()

  return savedBlogs
}




module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb,
  testUser,
  getUserToken,
  createBlogsForUser
}
