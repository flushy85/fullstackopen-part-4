const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (req, res, next) => {
    const users = await User
        .find({}).populate('posts')

    res.json(users.map(u => u.toJSON()))
})


usersRouter.post('/', async (req, res, next) => {
    try {
        const body = req.body
        const saltRounds = 10
        
        if(body.password.length < 3) {
            return res.status(400).json({ error: 'password must be at least 3 characters' })
        }
        const passwordHash = await bcrypt.hash(body.password, saltRounds)

        const user = new User({
            username: body.username,
            name: body.name,
            passwordHash,
        })

        const savedUser = await user.save()
        res.json(savedUser.toJSON())
    } catch(exception) {
        next(exception)
    }
})



module.exports = usersRouter