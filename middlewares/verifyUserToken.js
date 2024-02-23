const User = require("../models/user/UserModel")
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv')

dotenv.config('../.env')



module.exports.userToken = async (req, res, next) => {
    const token = req.headers.token
    if (!token) {
        return res.status(409).json({ error: 'Please login first' })
    }
        try {
            const data = jwt.verify(token,  process.env.SECRET)
            next()
        } catch (error) {
            return res.status(409).json({ error })
        }
}