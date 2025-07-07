const { test, expect, describe, beforeEach } = require('@playwright/test')
const { loginWith, createBlog, likeBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Long Nguyen',
        username: 'longnn',
        password: 'longnnpass'
      }
    })
    await page.goto('http://localhost:5173')
  })

  //5.17
  describe('before login', () => {
    test('front page can be opened', async ({ page }) => {
      const locator = await page.getByText('Blogs')
      await expect(locator).toBeVisible()
    })

    test('login form is shown (after clicking login button)', async ({ page }) => {
      await page.getByRole('button', { name: 'log in' }).click()
      await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible()
      await expect(page.getByTestId('username')).toBeVisible()
      await expect(page.getByTestId('password')).toBeVisible()
      await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
    })
  })

  describe('Login', () => {
    //5.18
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'longnn', 'longnnpass')
      await expect(page.getByText('Long Nguyen logged-in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'inCorrectUsername', 'inCorrectpass')
      await expect(page.getByText('Wrong username or password')).toBeVisible()
    })

  })

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'longnn', 'longnnpass')
    })

    //5.19
    test('a new blog can be created', async ({ page }) => {
      const title = 'a blog created from playwright'
      const author = 'playwright'
      const url = 'playwright.com'

      await createBlog(page, title, author, url)

      const blogTitle = page.locator('.blog-summary', { hasText: title })
      const blogAuthor = page.locator('.blog-summary', { hasText: author })

      expect(blogTitle).toBeVisible()
      expect(blogAuthor).toBeVisible()

      await page.getByRole('button', { name: 'view' }).click()
      await expect(page.getByText(url)).toBeVisible()
      await expect(page.getByText('likes 0')).toBeVisible()
    })

    //5.20
    test('a blog can be liked', async ({ page }) => {
      const title = 'like this blog'
      const author = 'liker'
      const url = 'like.com'

      await createBlog(page, title, author, url)

      await page.getByRole('button', { name: 'view' }).click()

      await expect(page.getByText('likes 0')).toBeVisible()

      await page.getByRole('button', { name: 'like' }).click()

      await expect(page.getByText('likes 1')).toBeVisible()
    })

    //5.21
    test('a blog can be deleted by the user who created it', async ({ page }) => {
      const title = 'deletion'
      const author = 'deleter'
      const url = 'delete.com'

      await createBlog(page, title, author, url)

      await page.getByRole('button', { name: 'view' }).click()

      page.once('dialog', async dialog => {
        expect(dialog.message()).toContain('Remove blog deletion by deleter')
        await dialog.accept()
      })

      await page.getByRole('button', { name: 'remove' }).click()

      await expect(page.locator('.blog-summary', { hasText: title })).toHaveCount(0)
      await expect(page.locator('.blog-summary', { hasText: author })).toHaveCount(0)
    })

    //5.22
    test('only the user who added the blog sees the blog\' delete button', async ({ page, request }) => {
      //create one more user (since Long Nguyen is created at the start)
      await request.post('http://localhost:3003/api/users', {
        data: {
          name: 'another user',
          username: 'another',
          password: 'anotherpass'
        }
      })

      const title = 'owndership test'
      const author = 'longnn is the owner'
      const url = 'longnn.com'

      await createBlog(page, title, author, url)
      await page.getByRole('button', { name: 'view' }).click()
      await expect(page.getByRole('button', { name: 'remove' })).toHaveCount(1)
      await expect(page.getByRole('button', { name: 'remove' })).toBeVisible()

      await page.getByRole('button', { name: 'logout' }).click()
      await loginWith(page, 'another', 'anotherpass')
      await page.getByRole('button', { name: 'view' }).click()

      await expect(page.getByRole('button', { name: 'remove' })).toHaveCount(0)
      await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
    })


  })

  //5.23
  describe('blogs order', () => {
    beforeEach(async ({ page }) => {
      const blogA = {
        title: 'Blog A from Playwright',
        author: 'Author A',
        url: 'a.com'
      }

      const blogB = {
        title: 'Blog B from Playwright',
        author: 'Author B',
        url: 'b.com',
      }

      const blogC = {
        title: 'Blog C from Playwright',
        author: 'Author C',
        url: 'c.com'
      }

      await loginWith(page, 'longnn', 'longnnpass')

      await createBlog(page, blogA.title, blogA.author, blogA.url)
      await createBlog(page, blogB.title, blogB.author, blogB.url)
      await createBlog(page, blogC.title, blogC.author, blogC.url)
    })

    test.only('arranged in the order according to likes, the most likes first', async ({ page }) => {
      const count = await page.locator('.blogElement').count()

      for (let i = 0; i < count; i++) {
        const blog = page.locator('.blogElement').nth(i)
        const viewBtn = blog.getByRole('button', { name: 'view' })
        await viewBtn.click()
      }

      const likeBlog = async (title, times) => {
        const blogLocator = page.locator('.blogElement', { hasText: title })
        const likeButton = blogLocator.getByRole('button', { name: 'like' })

        for (let i = 0; i < times; i++) {
          await likeButton.click()
          await page.waitForTimeout(200)
        }
      }

      await likeBlog('Blog A from Playwright', 1)
      await likeBlog('Blog B from Playwright', 10)
      await likeBlog('Blog C from Playwright', 4)

      await page.waitForTimeout(500)

      const blogElements = await page.locator('.blogElement').all()
      const likesText = await Promise.all(
        blogElements.map(async (el) => {
          const text = await el.locator('.likes').innerText()
          return parseInt(text.replace('likes ', ''), 10)
        })
      )

      console.log('\nBlog contents after liking:')
      for (let i = 0; i < blogElements.length; i++) {
        const text = await blogElements[i].innerText()
        console.log(`Blog #${i + 1}:\n${text}\n`)
      }

      const sortedLikes = [...likesText].sort((a, b) => b - a)
      expect(likesText).toEqual(sortedLikes)
    })

  })
})