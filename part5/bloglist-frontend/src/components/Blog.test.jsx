import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { describe, vi } from 'vitest'

describe('<Blog />', () => {
  //5.13
  test('renders title and author, but not url or likes by default', () => {
    const blog = {
      title: '2.7 blog',
      author: 'long nguyen',
      url: 'test.com',
      likes: 0,
      user: {
        id: '685ff919b0f241070402f7d6',
        name: 'long nguyen',
        username: 'longnn',
      }
    }

    render(<Blog blog={blog} />)

    expect(screen.getByText('2.7 blog long nguyen')).toBeVisible()

    expect(screen.queryByText('test.com')).not.toBeVisible()
    expect(screen.queryByText('likes 0')).not.toBeVisible()

  })

  //5.14
  test('show url and likes when view button is clicked', async () => {
    const blog = {
      title: '2.7 blog',
      author: 'long nguyen',
      url: 'test.com',
      likes: 0,
      user: {
        id: '685ff919b0f241070402f7d6',
        name: 'long nguyen',
        username: 'longnn',
      }
    }

    render(<Blog blog={blog} />)

    const user = userEvent.setup()

    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    expect(screen.getByText('test.com')).toBeVisible()
    expect(screen.getByText('likes 0')).toBeVisible()
  })

  //5.15
  test('calls the like handler twice when like button is clicked twice', async () => {
    const blog = {
      title: '2.7 blog',
      author: 'long nguyen',
      url: 'test.com',
      likes: 0,
      user: {
        id: '685ff919b0f241070402f7d6',
        name: 'long nguyen',
        username: 'longnn',
      }
    }

    const mockLikeHandler = vi.fn()

    render(<Blog blog={blog} handleLikeClick={mockLikeHandler} />)

    const user = userEvent.setup()

    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockLikeHandler.mock.calls).toHaveLength(2)
  })

})

