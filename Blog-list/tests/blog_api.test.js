const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('../tests/test_helper')

const api = supertest(app)
const Blog = require('../models/blog')



beforeEach(async () => {
    await Blog.deleteMany({})

    let blogObject = new Blog(helper.initialBlogs[0])
    await blogObject.save()

    blogObject = new Blog(helper.initialBlogs[1])
    await blogObject.save()

    blogObject = new Blog(helper.initialBlogs[2])
    await blogObject.save()
})

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

afterAll(() => {
    mongoose.connection.close()
})

test('all blogs are returned', async () => {
    const res = await api.get('/api/blogs')

    expect(res.body.length).toBe(helper.initialBlogs.length)
})

test('a blog can be added', async () => {
    const newBlog = {
        title: "test title",
        author: "Joe Blogs",
        url: "www.madeupURL.com",
        likes: 200
    }
    
    await api.post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
    const response = await api.get('/api/blogs')
    
    const title = response.body.map(r => r.title)

    expect(response.body.length).toBe(helper.initialBlogs.length + 1)
    expect(title).toContain('test title')

})

test('blog contains "id" property', async () => {
    const res = await api.get('/api/blogs')

    expect(res.body[0].id).toBeDefined()

})

test('if likes property missing defaults to 0', async () => {
    const newBlog = {
        title: "my blog post",
        author: "sum fun guy",
        url: "http://www.test.com"
    }

    const res = await api.post('/api/blogs').send(newBlog)
    
    expect(res.body.likes).toBe(0)
})

test('respond with statuscode 400 if title is missing', async () => {
    const newBlogPost = {
        title: "",
        author: "GregyBoy",
        url: "www.hihihi.com",
        likes: 21
    }

    await api.post('/api/blogs')
        .send(newBlogPost)
        .expect(400)
})

test('respond with statuscode 400 if url is missing', async () => {
    const newBlogPost = {
        title: "this is my blog post",
        author: "GregyBoy",
        url: "",
        likes: 21
    }

    await api.post('/api/blogs')
        .send(newBlogPost)
        .expect(400)
})

test('blog is deleted from database', async () => {
    const blogsAtStart = await helper.blogsInDd()
    const blogToDelete = blogsAtStart[0]
    
    await api.delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

    const blogsAtEnd = await helper.blogsInDd()

    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length - 1)

    const titles = blogsAtEnd.map(r => r.title)

    expect(titles).not.toContain(blogToDelete.title)

})