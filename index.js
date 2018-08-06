import express from 'express'

const app = new express()

app.get('/', (requestAnimationFrame, res) => {
    return res.send('hello Jello')
})

app.get('/world', (req, res) => {
    return res.send('Getting World')
})

app.listen(process.env.PORT || 3000)
