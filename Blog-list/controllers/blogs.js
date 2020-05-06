const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


blogsRouter.get('/', async (request, response) => {
	const blogs = await Blog
		.find({})
		.populate('user', { name: 1, username: 1 })
	response.json(blogs.map(blog => blog.toJSON()))
})
  
blogsRouter.post('/', async (request, response, next) => {
	const body = request.body
	

	try {
		const decodedToken = jwt.verify(request.token, process.env.SECRET)
		if	(!request.token || !decodedToken.id) {
			return response.status(401).json({ error: 'token missing or invalid' })
		}

		const user = await User.findById(decodedToken.id)
	
		const blog = new Blog({
			title: body.title,
			author: body.author,
			url: body.url,
			likes: body.likes === undefined ? 0 : body.likes,
			user: user._id
	})
		const savedBlog = await blog.save()
		user.posts = user.posts.concat(savedBlog._id)
		await user.save()
		response.json(savedBlog.toJSON()) 
	} catch(exception) {
		next(exception)
	}
})

blogsRouter.delete('/:id', async (req, res, next) => {
	const blogId = req.params.id
	try {
		const decodedToken = jwt.verify(req.token, process.env.SECRET)
		if (!req.token || !decodedToken.id) {
			return res.status(401).json({ error: 'token missing or invalid' })
		}
		
		const user = await User.findById(decodedToken.id)
		const blog = await Blog.findById(blogId)
		
		if(user.id.toString() !== blog.user.toString()) {
			return res.status(401).json({ error: 'only authors can delete their posts'})
		}
		blog.delete()
		res.status(204).end()
		
	} catch(exception) {
		next(exception)
	}
})

blogsRouter.put('/:id', async (req, res, next) => {
	const blog = req.body
	
	try{
		const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, { likes: blog.likes })
		savedBlog = await updatedBlog.save()
		res.status(201)
		res.json(savedBlog.toJSON())
	} catch(exception) {
		next(exception)
	}
})


	
module.exports = blogsRouter