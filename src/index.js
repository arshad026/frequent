const express = require('express')
const mongoose = require('mongoose')
const route = require('./routes/route')
const path = require('path')
mongoose.set('strictQuery', false)

const app = express()

const publicPath = path.join(__dirname, '../public')
app.use(express.static(publicPath))

app.use(express.json())


mongoose.connect('mongodb+srv://arsh26:WZdIsZMdgBi1eOxE@cluster0.tytwkvw.mongodb.net/arshad',
{useNewUrlParser: true})

.then(() => console.log('MongoDB is connected'))
.catch(err => console.log(err))


app.use('/', route)

 
app.listen( 3000, function(){
    console.log('Express app running on PORT ' + 3000)
})