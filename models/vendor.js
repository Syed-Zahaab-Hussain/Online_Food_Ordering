const mongoose = require('mongoose')

const vendorSchema = new mongoose.Schema({
    vendorName:{
        type: String,
        required: true
    },
    description: String
})

const Vendor = mongoose.model('Vendor', vendorSchema)

module.exports = Vendor