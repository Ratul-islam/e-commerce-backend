const mongoose = require('mongoose')

exports.DatabaseConnection = () =>{
    const db = process.env.SERVER_URL
    mongoose.connect(db, {
        
    })
    .then(()=> console.log(`connected to database successfully`))
    .catch((err)=> console.log(`error connecting to database \n ${err}`))
}