import express from 'express'
import parser from 'body-parser'

const app = new express()

app.use(parser.urlencoded({
    extended: false
}))

app.get('/', (requestAnimationFrame, res) => {
    return res.send('hello Jello')
})

app.get('/world', (req, res) => {
    return res.send('Getting World')
})

app.post('/', (req, res) => {
    return res.send(req.body)
})

app.listen(process.env.PORT || 3000)
