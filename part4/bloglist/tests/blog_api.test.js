const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

describe('GET /api/blogs', () => {
  test('blogs are returned as json', async () => {
    await api.get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('unique identifier of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs')
    const allHaveId = response.body.every(blog => blog.id)
    const noneHave_Id = response.body.every(blog => blog._id === undefined)

    assert.strictEqual(allHaveId, true)
    assert.strictEqual(noneHave_Id, true)
  })
})

describe('POST /api/blogs', () => {
  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'Test blog 1',
      author: 'Long Nguyen',
      url: 'https://test.com/',
      likes: 7,
    }

    await api.post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(b => b.title)
    assert(titles.includes('Test blog 1'))
  })

  test('blog without title is NOT added', async () => {
    const blog = { author: 'No title', url: 'https://test.com/', likes: 99 }

    await api.post('/api/blogs')
      .send(blog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('blog without url is NOT added', async () => {
    const blog = { title: 'No URL', author: 'No URL', likes: 99 }

    await api.post('/api/blogs')
      .send(blog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('blog without title and url is NOT added', async () => {
    const blog = { author: 'No title or url', likes: 99 }

    await api.post('/api/blogs')
      .send(blog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('if likes property is missing, it defaults to 0', async () => {
    const blog = {
      title: 'No likes field',
      author: 'Long Nguyen',
      url: 'https://test.com/',
    }

    await api.post('/api/blogs')
      .send(blog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const addedBlog = blogsAtEnd.find(b => b.title === blog.title)

    assert.ok(addedBlog)
    assert.strictEqual(addedBlog.likes, 0)
  })
})

describe('GET /api/blogs/:id', () => {
  test('a specific blog can be viewed', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToView = blogsAtStart[0]

    const resultBlog = await api.get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.deepStrictEqual(resultBlog.body, blogToView)
  })
})

describe('DELETE /api/blogs/:id', () => {
  test('a blog with a valid nonExisting id can NOT be deleted', async () => {
    const validNonExstingId = await helper.nonExistingId()

    await api.delete(`/api/blogs/${validNonExstingId}`)
      .expect(404)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('a blog with a valid existing id can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api.delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
  })
})

describe('PUT /api/blogs/:id', () => {
  test('a blog with a valid nonexisting id can NOT be updated', async () => {
    const validNonExstingId = await helper.nonExistingId()
    const blogsAtStart = await helper.blogsInDb()

    await api.put(`/api/blogs/${validNonExstingId}`)
      .send({ likes: 999 })
      .expect(404)

    const blogsAtEnd = await helper.blogsInDb()
    assert.deepStrictEqual(blogsAtEnd, blogsAtStart)
  })

  test('a blog with a valid existing id can be updated', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    const updatedLikes = blogToUpdate.likes + 999

    await api.put(`/api/blogs/${blogToUpdate.id}`)
      .send({ likes: updatedLikes })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const updatedBlog = blogsAtEnd.find(b => b.id === blogToUpdate.id)

    assert.strictEqual(updatedBlog.likes, updatedLikes)
  })
})

after(async () => {
  await mongoose.connection.close()
})
