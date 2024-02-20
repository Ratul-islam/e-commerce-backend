const mongoose = require('mongoose')

const referBonus = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vendor",
        required: [true, "A transaction must have a user"]
    },
    creditAmount:{
        type: Number,
        required: [true, "A transaction must have credit amount"],
    },
    parent1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reseller",
    },
    parent1Credit:{
        type: Number,
    },
    parent2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reseller",
    },
    parent2Credit:{
        type: Number,
    },
    parent3: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reseller",
    },
    parent3Credit:{
        type: Number,
    },
    parent4: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reseller",
    },
    parent4Credit:{
        type: Number,
    },
})


const ReferBonus = mongoose.model("ReferBonus" , referBonus)
module.exports = ReferBonus;