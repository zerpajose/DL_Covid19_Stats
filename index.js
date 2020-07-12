const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const app = express()

const options = {
    inflate: true,
    limit: 1000,
    type: ['text/plain','application/json']
}
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json(options))

const {authApi} = require('./routes/auth')
const {userPostApi} = require('./routes/posts')
const jwtVerify = require('./middleware/jwtVerify')

authApi(app)
userPostApi(app)

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname+'/public/index.html'))
});

app.listen(3000,() => {
    console.log(`Listening server in http://localhost:3000`)
})
