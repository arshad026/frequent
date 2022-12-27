const express = require('express')
const router = express.Router()
const { createUser, userLogin } = require('../controllers/userController')
// const { authentication, authorisation } = require('../MiddleWares/auth')

router.get('/test-me',function(req,res){
    res.send('my first API!')
})

router.post('/register', createUser)
router.post('/login', userLogin)


module.exports = router