const Products = require("../models/product/productModel")
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv')

dotenv.config('../.env')

module.exports.verifyAdminResellerToken = async (req, res, next) => {
    const token = req.headers.token
    if (!token) {
        return res.status(409).json({ error: 'Please login first' })
    }
        try {
            const data = jwt.verify(token,  process.env.SECRET)
            if(data.role == "admin" || data.role == "reseller"){
                next()
            }
        } catch (error) {
            return res.status(409).json({ error })
        }
}
module.exports.verifyAdminSellerToken = async (req, res, next) => {
    const token = req.headers.token
    if (!token) {
        return res.status(409).json({ error: 'Please login first' })
    }
        try {
            const data = jwt.verify(token,  process.env.SECRET)
            if(data.role == "admin" || data.role == "seller"){
                next()
            }
            if(data.role == "reseller" || data.role == "customer"){
                return res.status(401).json({message: "not authorized"})
            }
        } catch (error) {
            return res.status(409).json({ error })
        }
}

module.exports.verifySellerToken = async (req, res, next) => {
    const token = req.headers.token

    if (!token) {
        return res.status(409).json({ error: 'Please login first' })
    }
    try {
        const data = await jwt.verify(token,  process.env.SECRET)
        if(data.role == "admin" || data.role == "seller"){
            next()
        }
        
        if(!data.role || data.role == "reseller" || data.role == "customer"){
            return res.status(401).json({message: "not authorized"})
        }
    } catch (err){
        console.log(err)
    }
}
module.exports.verifySellerProductToken = async (req, res, next) => {
    const token = req.headers.token
    const productId = req.params.productId
    if (!token) {
        return res.status(409).json({ error: 'Please login first' })
    }
        try {
            const data = await jwt.verify(token,  process.env.SECRET)
            if(data.role == "admin"){
                next()
            }
            if(data.role == "seller"){
                Products.findById(productId)
                .then(product => {
                  if (!product ||  product.uploadedBy != data.user ) {
                    return res.status(403).send('Unauthorized: You cannot modify this product');
                  }
                  next();
                })
                .catch(err => {
                  console.error(err);
                  res.status(500).send('Internal server error');
                });
            }
            if(!data.role || data.role == "reseller" || data.role == "customer"){
                return res.status(401).json({message: "not authorized"})
            }
        } catch (err){
            console.log(err)
        }
}

module.exports.verifyAdminToken = async (req, res, next) => {
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

module.exports.verifyAllToken = async (req, res, next) => {
    const token = req.headers.token
    if (!token) {
        return res.status(409).json({ error: 'Please login first' })
    }
        try {
            const data = jwt.verify(token,  process.env.SECRET)
            if(data){

                next()
            }
            
        } catch (error) {
            return res.status(409).json({ error })
        }
}