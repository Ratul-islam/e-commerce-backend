const app = require('./app')
const DatabaseConnection = require('./db/database')
const dotenv = require('dotenv')
//getting env file
dotenv.config('./.env')
const port = process.env.SERVER_PORT || 5000

// connecting to database 
DatabaseConnection.DatabaseConnection()






app.listen(port, ()=> console.log(`server started on port ${port}`))