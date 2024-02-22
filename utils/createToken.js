const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config('../.env')

module.exports.createToken = async (data) => {
    const token = await jwt.sign(data, process.env.SECRET, { expiresIn: '7d' })
    return token
}