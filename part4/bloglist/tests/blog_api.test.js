const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
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

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})


//4.8 --------------------------------------
test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})
//------------------------------------------
test('a specific blog is within the returned blogs', async () => {
  const response = await api.get('/api/blogs')

  const titles = response.body.map(b => b.title)
  assert(titles.includes('Go To Statement Considered Harmful'))
})

//4.10------------------------------------------
test('a valid blog can be added ', async () => {
  const newBlog = {
    title: 'Test blog 1',
    author: 'Long Nguyen',
    url: 'https://test.com/',
    likes: 7,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  const titles = blogsAtEnd.map(b => b.title)
  assert(titles.includes('Test blog 1'))
})
//------------------------------------------


//4.12
test('blog without title is NOT added', async () => {
  const blogWithoutTitle = {
    author: 'Author of blog without title',
    url: 'https://withouttitle.com/',
    likes: 7,
  }

  await api
    .post('/api/blogs')
    .send(blogWithoutTitle)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

//4.12
test('blog without url is NOT added', async () => {
  const blogWithoutUrl = {
    title: 'Blog without url',
    author: 'Author of blog without url',
    likes: 11,
  }

  await api
    .post('/api/blogs')
    .send(blogWithoutUrl)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

//4.12
test('blog without title and url is NOT added', async () => {
  const blogWithoutTitleAndUrl = {
    author: 'Author of blog without url',
    likes: 11,
  }

  await api
    .post('/api/blogs')
    .send(blogWithoutTitleAndUrl)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('a specific blog can be viewed', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToView = blogsAtStart[0]

  const resultBlog = await api
    .get(`/api/blogs/${blogToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.deepStrictEqual(resultBlog.body, blogToView)
})

//4.9---------------------------------------
test('unique identifier of the blog posts is named id', async () => {
  const response = await api.get('/api/blogs')

  const allHaveId = response.body.every(blog => blog.id)
  const noneHave_Id = response.body.every(blog => blog._id === undefined)

  assert.strictEqual(allHaveId, true)
  assert.strictEqual(noneHave_Id, true)
})
//------------------------------------------

//4.11---------------------------------------
test('if likes property is missing from the request, it will default to the value "0"', async () => {
  const newBlogWithoutLikes = {
    title: 'Test: blog without likes field',
    author: 'Long Nguyen',
    url: 'https://test3.com/',
  }

  await api
    .post('/api/blogs')
    .send(newBlogWithoutLikes)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  const addedBlog = blogsAtEnd.find(blog => blog.title === 'Test: blog without likes field')
  assert.ok(addedBlog)
  assert.strictEqual(addedBlog.likes, 0)

})
//--------------------------------------------

//4.13
test.only('a blog with an invalid id can NOT be deleted', async () => {
  await api
    .delete(`/api/blogs/${helper.nonExistingId()}`)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test.only('a blog with an valid id can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
})

after(async () => {
  await mongoose.connection.close()
})