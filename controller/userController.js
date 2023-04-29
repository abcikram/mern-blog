const userModel = require('../models/userModel')
const bcrypt = require('bcrypt')


exports.registration = async (req, res) => {
    try {

        const { username, email, password } = req.body
        //validation
        if (!username || !email || !password) {
            return res.status(400).send({
                success: false,
                message: "please Fill all fields"
            })
        }

        //existing user
        const existingUser = await userModel.findOne({ email })
        if (existingUser) res.status(401).send({ success: false, message: "User already exist" })

        //password encription :-
        const hashPassword = await bcrypt.hash(password, 10)
        req.body.password = hashPassword

        //save new user
        const user = await userModel.create(req.body)
        return res.status(201).send({
            success: true,
            message: "New user Create",
            user
        })

    } catch (error) {
        return res.status(500).send({ success: false, message: error.message })
    }
}


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send({ 
                success: false,
                message: "please  provide email and password"
            })
        }

        const user = await userModel.findOne({email})
        if(!user){
            return res.status(400).send({
                success: false,
                message: "email is not register"
            })
        }

        //password:-
        const isMatchPass = await bcrypt.compare(password,user.password)
        if(!isMatchPass) {
            return res.status(401).send({
                success: false,
                message: "Invalid password"
            })
        }

        return res.status(200).send({success:true,message:" user successfully login",user})
         
    } catch (error) {
        return res.status(500).send({ success: false, message: error.message })
    }
}


exports.getAllUser = async (req, res) => {
    try {
        const users = await userModel.find({});
        return res.status(200).send({
            userCount: users.length,
            success: true,
            message: "all users data",
            users
        })

    } catch (error) {
        return res.status(500).send({ success: false, message: error.message })
    }
}