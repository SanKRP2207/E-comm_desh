const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    image:String,
    name:String,
    price:String,
    category:String,
    company:String,
    productId:String

});

module.exports = mongoose.model('products', productSchema);