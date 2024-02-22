const Products = require("../models/product/productModel")
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv')

dotenv.config('../.env')



module.exports.adminOnlyToken = async (req, res, next) => {
    const token = req.headers.token
    if (!token) {
        return res.status(409).json({ error: 'Please login first' })
    }
        try {
            const data = jwt.verify(token,  process.env.SECRET)

            if(data.role == "admin" ){
              next()
            }
            if(data.role == "reseller" ){
              return res.status(401).json({message: "not authorized"})
            }
        } catch (error) {
            return res.status(409).json({ error })
        }
}