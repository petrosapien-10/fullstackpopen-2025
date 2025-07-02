import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'
import { describe, vi } from 'vitest'

describe('<BlogForm />', () => {
  //5.16
  test('form calls the event handler it received as props with the right details when a new blog is created', async () => {
    const createBlog = vi.fn()
    const user = userEvent.setup()

    render(<BlogForm createBlog={createBlog} />)

    const titleInput = screen.getByPlaceholderText('enter title')
    const authorInput = screen.getByPlaceholderText('enter author')
    const urlInput = screen.getByPlaceholderText('enter url')

    const createButton = screen.getByText('create')

    await user.type(titleInput, 'test title input...')
    await user.type(authorInput, 'test author input...')
    await user.type(urlInput, 'test url input...')

    await user.click(createButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('test title input...')
    expect(createBlog.mock.calls[0][0].author).toBe('test author input...')
    expect(createBlog.mock.calls[0][0].url).toBe('test url input...')
  })
})

