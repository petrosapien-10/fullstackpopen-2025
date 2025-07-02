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
    console.log('blog.user:', blog.user)
    console.log('userId:', userId)

    return blogUserId === userId
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <Togglable showButtonLabel='view' hideButtonLabel='hide'>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes}
            <button onClick={handleLikeClick}>like</button>
          </div>
          <div>{blog?.user?.name || 'unknown user'}</div>
          {isTheOwner(userId) && (<div>
            <button style={{ backgroundColor: 'yellow' }} onClick={handleRemoveClick}>remove</button>
          </div>)}
        </Togglable>
      </div>
    </div>
  )
}

export default Blog