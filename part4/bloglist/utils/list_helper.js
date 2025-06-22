const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => {
    return sum + blog.likes
  }, 0)
}

const favoriteBlog = (blogs) => {
  let mostLikedBlog = blogs[0]

  for (let i = 1; i < blogs.length; i++) {
    if (blogs[i].likes > mostLikedBlog.likes) {
      mostLikedBlog = blogs[i]
    }
  }

  return mostLikedBlog
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return {}

  const authorBlogsMap = new Map()

  for (const blog of blogs) {
    const currentCount = authorBlogsMap.get(blog.author) || 0
    authorBlogsMap.set(blog.author, currentCount + 1)
  }

  let topAuthor = ''
  let topAuthorTotalBlogs = 0

  for (const entry of authorBlogsMap.entries()) {
    const author = entry[0]
    const blogs = entry[1]

    if (blogs > topAuthorTotalBlogs) {
      topAuthor = author
      topAuthorTotalBlogs = blogs
    }
  }

  return {
    author: topAuthor,
    blogs: topAuthorTotalBlogs
  }

}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return {}

  const authorLikesMap = new Map()

  for (const blog of blogs) {
    const currentLikes = authorLikesMap.get(blog.author) || 0
    authorLikesMap.set(blog.author, currentLikes + blog.likes)
  }

  let topAuthor = ''
  let topAuthorTotalLikes = 0

  for (const [author, likes] of authorLikesMap.entries()) {
    if (likes > topAuthorTotalLikes) {
      topAuthorTotalLikes = likes
      topAuthor = author
    }
  }

  return {
    author: topAuthor,
    likes: topAuthorTotalLikes
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}