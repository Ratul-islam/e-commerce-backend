const express = require('express')
const cors = require('cors')

app = express()

// to allow cross-origin requests from other servers
app.use(cors())
//to see data on console in json payload
app.use(express.json())
//to parse url encoded data
app.use(express.urlencoded({extended: true}))

// routes import 
const ResellerRoutes = require("./routes/resellerRoutes")
const productRoutes = require("./routes/product/productRoute")
const adminRoutes = require("./routes/admin/adminRoutes")
const sellerRoutes = require("./routes/seller/sellerRoutes")


// use routes 
// app.use("api/reseller", ResellerRoutes)
app.use("/api/reseller", ResellerRoutes)
app.use("/api/product", productRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/seller", sellerRoutes)



module.exports = app

