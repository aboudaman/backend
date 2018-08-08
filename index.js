import express from 'express'
import parser from 'body-parser'
import mongoose, {Schema} from 'mongoose'
import bcrypt from 'bcrypt'

mongoose.connect(`
mongodb://abou:abou123456@ds113942.mlab.com:13942/backendnode
`, {useNewUrlParser: true})

// Create the schema for the user

const userSchema = new Schema({
    username: {type: String, required: true, index:{unique: true}},
    password: {type: String, required: true}
})

const User = mongoose.model('User', userSchema)

// Method to create password, user is passed as an object with {username, password}

const createPassword = (user, next) => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(user.password, salt, (err, hash) => {
            user.password = hash
            next()
        })
    })
}

// Method to compare password entered

userSchema.methods.comparePassword = function (password, next) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
        if (err) return next(err)
        return next(null, isMatch)
    })
}

// Define when to call the function, i.e. before save

userSchema.pre('save', function(next) {
    createPassword(this, next)
})



const app = new express()

app.use(parser.urlencoded({
    extended: false
}))

app.get('/users', (req, res) => {
    User.find({}, (err, users) => res.send(users))
})

app.get('/gettingworld', (req, res) => {
    return res.send('Getting World')
})

app.post('/check', (req, res) => {
    const {username, password} = req.body

    if (!username || !password) {
        return res.status(400).send({err: 'No username or password entered!!!'})
    }

    User.findOne({username: username}, function(err, userModel) {
        if(err) return res.status(400).send(err)

        if (!User) return res.status(400).send({err: 'Cannot find user'})

        return userModel.comparePassword(password, function(err, isMatch) {
            if (err) return res.status(400).send(err)

            return res.send({correct: isMatch})
        })
    })
})

app.post('/', (req, res) => {
    const {username, password} = req.body

    if (!username || !password) {
        return res.status(400).send({err: 'No username or password entered!!!'})
    }

    const newUser = new User({
        username: username,
        password: password
    })

    return newUser.save(function(err, model) {
        if (err) {
            return res.status(400).send({err:err})
        }
        return res.status(201).send(model)
    })
})

app.listen(process.env.PORT || 3000)