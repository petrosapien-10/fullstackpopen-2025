import { Box, Paper, Link, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import BlogForm from './BlogForm'
import Togglable from './Togglable'

const Home = ({ blogs, onAddBlog, blogFormRef }) => (
  <Box mt={2}>
    <Togglable showButtonLabel='create new blog' hideButtonLabel='cancel' ref={blogFormRef}>
      <BlogForm createBlog={onAddBlog} />
    </Togglable>

    <Box mt={4} display='flex' flexDirection='column' gap={2}>
      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Paper
            key={blog.id}
            sx={{
              p: 2,
              borderRadius: 2,
              boxShadow: 2,
              transition: '0.2s ease',
              '&:hover': {
                boxShadow: 4,
                backgroundColor: 'grey.50'
              }
            }}
          >
            <Typography variant='h6'>
              <Link
                component={RouterLink}
                to={`/blogs/${blog.id}`}
                underline='hover'
                color='inherit'
              >
                {blog.title}
              </Link>
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Likes: {blog.likes}
            </Typography>
          </Paper>
        ))}
    </Box>
  </Box>
)

export default Home
