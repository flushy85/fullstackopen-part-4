
const totalLikes = (posts) => {
    return posts.reduce((total, curr) => {
        return total + curr.likes
    }, 0)
}

const favoriteBlog = (blogs) => {
    const mostLikedBlog = blogs.reduce((prev, curr) =>
        (prev.likes >= curr.likes) 
        ? prev
        : curr
        , 0)

    return {
        author: mostLikedBlog.author,
        likes: mostLikedBlog.likes,
        title: mostLikedBlog.title
    }
}


const mostBlogs = (blogs) => {
    const blogTally = blogs.reduce((total, curr) => {
        total[curr.author] = (total[curr.author] || 0) + 1 
        return total
    }, {})

    let output = Object.keys(blogTally).map(key => {
        return {
          author: key,
          blogs: blogTally[key]
        }
    })
    return output.reduce((prev, curr) => 
        (prev.blogs >= curr.blogs) 
            ? prev
            : curr,
        0)
}


const mostLikes = (blogs) => {
    const likesTally = blogs.reduce((acc, curr) => {
        acc[curr.author] = (acc[curr.author] || 0) + curr.likes
        return acc
    }, {})
    
    let output = Object.keys(likesTally).map(key => {
        return {
            author: key,
            likes: likesTally[key]
        }
    })

    
    return output.reduce((prev, curr) => 
        (prev.likes >= curr.likes)
            ? prev
            : curr, 
        0)
} 

module.exports = {
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}