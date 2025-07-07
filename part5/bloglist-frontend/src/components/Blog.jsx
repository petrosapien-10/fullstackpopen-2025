import Togglable from './Togglable'

const Blog = ({ blog, userId, handleLikeClick, handleRemoveClick }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const isTheOwner = (userId) => {
    const blogUserId = blog?.user?.id || null
    return blogUserId === userId
  }

  return (
    <div className='blogElement' style={blogStyle}>
      <div className='blog-summary'>
        {blog.title} {blog.author}
      </div>

      <Togglable showButtonLabel='view' hideButtonLabel='hide'>
        <div>
          <div>{blog.url}</div>
          <div>
            <div className='likes'> likes {blog.likes}</div>
            <button onClick={handleLikeClick}>like</button>
          </div>
          <div>{blog?.user?.name || 'unknown user'}</div>
          {isTheOwner(userId) && (
            <div>
              <button style={{ backgroundColor: 'yellow' }} onClick={handleRemoveClick}>remove</button>
            </div>
          )}
        </div>
      </Togglable >
    </div >

  )
}

export default Blog