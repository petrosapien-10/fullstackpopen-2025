import { useState } from 'react'
import { Box, TextField, Button, Typography, Paper } from '@mui/material'

const BlogForm = ({ createBlog }) => {
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogUrl, setNewBlogUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()

    const newBlogObject = {
      title: newBlogTitle,
      author: newBlogAuthor,
      url: newBlogUrl
    }

    createBlog(newBlogObject)

    setNewBlogTitle('')
    setNewBlogAuthor('')
    setNewBlogUrl('')
  }

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant='h5' gutterBottom>
        Create new blog
      </Typography>

      <Box component='form' onSubmit={addBlog} display='flex' flexDirection='column' gap={2}>
        <TextField
          data-testid='title'
          label='Title'
          value={newBlogTitle}
          onChange={({ target }) => setNewBlogTitle(target.value)}
          placeholder='Enter blog title'
          fullWidth
        />

        <TextField
          data-testid='author'
          label='Author'
          value={newBlogAuthor}
          onChange={({ target }) => setNewBlogAuthor(target.value)}
          placeholder='Enter blog author'
          fullWidth
        />

        <TextField
          data-testid='url'
          label='URL'
          value={newBlogUrl}
          onChange={({ target }) => setNewBlogUrl(target.value)}
          placeholder='Enter blog URL'
          fullWidth
        />

        <Button
          type='submit'
          variant='contained'
          color='primary'
          size='small'
          sx={{ alignSelf: 'flex-start' }}
        >
          Create
        </Button>
      </Box>
    </Paper>
  )
}

export default BlogForm
