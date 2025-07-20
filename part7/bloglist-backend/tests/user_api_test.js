const bcrypt = require('bcrypt')
const User = require('../models/user')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const helper = require('./test_helper')

const api = supertest(app)

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = {
      username: 'sofresh',
      name: 'Long Nguyen',
      password: 'blesk'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()

    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usersnames = usersAtEnd.map(u => u.username)
    assert(usersnames.includes(newUser.username))
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'alreadyCreated',
      password: 'alreadyCreatedPassword'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()

    assert(result.body.error.includes('username is taken'))
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  //4.16
  test('creation fails if username is shorter than 3 characters', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'lo',
      name: '2 chars username',
      password: 'dum'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()

    assert(result.body.error.includes('username and password must be at least three 3 characters or longer'))
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails if password is missing', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'anuser',
      name: 'No password'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const usersAtEnd = await helper.usersInDb()

    assert(result.body.error.includes('username and password are both required'))
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})
