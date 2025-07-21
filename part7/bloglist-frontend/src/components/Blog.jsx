import { useState } from 'react'
import {
  Box,
  Typography,
  Button,
  Link as MuiLink,
  TextField,
  List,
  ListItem,
  Paper
} from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMatch, useNavigate } from 'react-router-dom'
import { useNotificationDispatch } from '../NotificationContext'
import blogService from '../services/blogs'
import { showNotification } from '../utils/notify'
import { useUserValue } from '../UserContext'

const Blog = () => {
  const [comment, setComment] = useState('')
  const queryClient = useQueryClient()
  const notificationDispatch = useNotificationDispatch()
  const match = useMatch('/blogs/:id')
  const blogId = match?.params?.id
  const user = useUserValue()
  const navigate = useNavigate()

  const {
    data: blog,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['blog', blogId],
    queryFn: () => blogService.getById(blogId),
    enabled: !!blogId
  })

  const updateBlogMutation = useMutation({
    mutationFn: (updatedBlog) => blogService.update(updatedBlog.id, updatedBlog),
    onSuccess: (updatedBlog) => {
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(
        ['blogs'],
        blogs.map((b) => (b.id === updatedBlog.id ? updatedBlog : b))
      )
      queryClient.setQueryData(['blog', updatedBlog.id], updatedBlog)
      showNotification(notificationDispatch, 'Like action success!', 'success')
    },
    onError: () => {
      showNotification(notificationDispatch, 'Failed to like the blog. Please try again.', 'error')
    }
  })

  const addCommentMutation = useMutation({
    mutationFn: ({ blogId, comment }) => blogService.addComment(blogId, { comment }),
    onSuccess: (updatedBlog) => {
      queryClient.setQueryData(['blog', updatedBlog.id], updatedBlog)

      const blogs = queryClient.getQueryData(['blogs'])
      if (blogs) {
        queryClient.setQueryData(
          ['blogs'],
          blogs.map((b) => (b.id === updatedBlog.id ? updatedBlog : b))
        )
      }

      showNotification(notificationDispatch, 'Comment added!', 'success')
      setComment('')
    },
    onError: () => {
      showNotification(notificationDispatch, 'Failed to add comment.', 'error')
    }
  })

  const deleteBlogMutation = useMutation({
    mutationFn: (blog) => blogService.deleteBlog(blog.id),
    onSuccess: (_, blog) => {
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(
        ['blogs'],
        blogs.filter((b) => b.id !== blog.id)
      )
      showNotification(
        notificationDispatch,
        `Deleted blog: ${blog.title} by ${blog.author}`,
        'success'
      )
      navigate('/')
    },
    onError: () => {
      showNotification(notificationDispatch, 'Failed to delete blog. Please try again.', 'error')
    }
  })

  const handleAddComment = (e) => {
    e.preventDefault()
    if (comment.trim()) {
      addCommentMutation.mutate({ blogId, comment })
    }
  }

  const handleRemoveClick = () => {
    const confirm = window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)
    if (confirm) {
      deleteBlogMutation.mutate(blog)
    }
  }

  if (isLoading) return <Typography>Loading blog...</Typography>
  if (isError) return <Typography color='error'>Error loading blog</Typography>

  const isOwner = blog?.user?.id === user?.id

  return (
    <Paper sx={{ p: 3, mt: 4 }}>
      <Typography variant='h4' gutterBottom>
        {blog.title} {blog.author}
      </Typography>

      <MuiLink href={blog.url} target='_blank' rel='noopener' sx={{ display: 'block', mb: 2 }}>
        {blog.url}
      </MuiLink>

      <Box display='flex' alignItems='center' gap={2} mb={2}>
        <Typography>{blog.likes} likes</Typography>
        <Button
          size='small'
          variant='contained'
          onClick={() => updateBlogMutation.mutate({ ...blog, likes: blog.likes + 1 })}
        >
          Like
        </Button>
      </Box>

      <Typography variant='body2' gutterBottom>
        Added by {blog.user?.name || 'unknown'}
      </Typography>

      {isOwner && (
        <Button variant='outlined' color='error' sx={{ mb: 2 }} onClick={handleRemoveClick}>
          Remove
        </Button>
      )}

      <Typography variant='h6' mt={4}>
        Comments
      </Typography>

      <Box component='form' onSubmit={handleAddComment} mt={2} mb={3}>
        <TextField
          fullWidth
          size='small'
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder='Write a comment'
        />
        <Button type='submit' variant='contained' sx={{ mt: 1 }}>
          Add Comment
        </Button>
      </Box>

      <List dense>
        {blog.comments.map((c, i) => (
          <ListItem key={i} sx={{ pl: 0 }}>
            {c}
          </ListItem>
        ))}
      </List>
    </Paper>
  )
}

export default Blog
