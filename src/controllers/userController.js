const userModel = require('../models/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')


const nameRegex = /^[a-zA-Z ]{2,30}$/
const emailRegex = /^\s*[a-zA-Z0-9]+([\.\-\_\+][a-zA-Z0-9]+)*@[a-zA-Z]+([\.\-\_][a-zA-Z]+)*(\.[a-zA-Z]{2,3})+\s*$/
const phoneRegex = /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/
const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,15}$/


const createUser = async function (req, res) {

    try {
        let data = req.body
        let { FirstName, LastName, Phone, Email, Password } = data

        if (Object.keys(data).length === 0) {
            return res.status(400).send({ status: false, message: 'please provide some details'})
        }
        if (!FirstName) return res.status(400).send({ status: false, message: "Please Provide FirstName"})
        if (FirstName.includes(" ")) return res.status(400).send({ status: false, message: "Space is not allowed"})
        if (!nameRegex.test(FirstName)) return res.status(400).send({ status: false, message: "Please Provide Valid FirstName"})

        if (!LastName) return res.status(400).send({ status: false, message: "Please Provide LastName"})
        if (LastName.includes(" ")) return res.status(400).send({ status: false, message: "Space is not allowed"})
        if (!nameRegex.test(LastName)) return res.status(400).send({ status: false, message: "Please Provide Valid LastName"})

        if (!Phone) return res.status(400).send({ status: false, message: "Please Provide Mobile Number"})
        if (!phoneRegex.test(Phone)) return res.status(400).send({ status: false, message: "Please Provide Valid Phone Number"})

        let duplicatePhone = await userModel.findOne({ Phone })
        if (duplicatePhone) return res.status(400).send({ status: false, message: "Phone is already registered!"})

        if (!Email) return res.status(400).send({ status: false, message: "Please Provide Email"})
        if (!emailRegex.test(Email)) return res.status(400).send({ status: false, message: "Please Provide Valid Email"})

        let duplicateEmail = await userModel.findOne({ Email })
        if (duplicateEmail) return res.status(400).send({ status: false, message: "Email is already registered!"})

        if (!Password) return res.status(400).send({ status: false, message: 'please provide Password'})
        if (!passwordRegex.test(Password)) return res.status(400).send({ status: false, message: 'please provide valid Password'})

        const newpass = await bcrypt.hash(Password, 10)
        data["Password"] = newpass

        const userData = await userModel.create(data)
        res.status(201).send({ status: true, message: 'user register successfully', data: userData })
    }
    catch (error) {
        res.status(500).send({ status: false, Error: error.message })
    }
}




const userLogin = async function (req, res) {
    
    try {
        let data = req.body
        const { Email, Password } = data

        if (Object.keys(data).length === 0) {
            return res.status(400).send({ status: false, message: 'please provide some data'})
        }

        if (!Email) return res.status(400).send({ status: false, message: 'Email is required'})

        if (!Password) return res.status(400).send({ status: false, message: 'Password is required'})

        let user = await userModel.findOne({ Email })
        if (!user) return res.status(400).send({ status: false, message: "Email or Password is incorrect"})

        let hashedPassword = await bcrypt.compare(Password, user.Password)
        if (!hashedPassword) return res.status(400).send({ status: false, message: "Email or Password is incorrect"})

        let token = jwt.sign({
            userId: user._id,

        }, 'my assignment for frequent research',
            { expiresIn: "24hr" })

        res.status(201).send({ status: true, message: 'token created successfully', data: token })

    }
    catch (error) {
        res.status(500).send({ status: false, Error: error.message })
    }
}



module.exports = { createUser, userLogin }