const express = require('express')
const mongoose = require('mongoose')
const route = require('./routes/route')
const path = require('path')
mongoose.set('strictQuery', false)

const app = express()

const publicPath = path.join(__dirname, '../public')
const viewPath = path.join(__dirname, '../views')


app.use(express.static(publicPath))
app.set('view engine', 'hbs')
app.set('views', viewPath)

app.use(express.json())
app.use(express.urlencoded({ extended: false }))


mongoose.connect('mongodb+srv://arsh26:WZdIsZMdgBi1eOxE@cluster0.tytwkvw.mongodb.net/arshad',
{useNewUrlParser: true})

.then(() => console.log('MongoDB is connected'))
.catch(error => console.log(error))


app.use('/', route)


app.get('/signup', (req, res) => {
    res.render('signup')
})

app.get('/login', (req, res) => {
    res.render('login')
})

 
app.listen( 3000, function(){
    console.log('Express app running on PORT ' + 3000)
})