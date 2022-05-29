const {Schema, model} = require('mongoose');

const productsSchema = new Schema({
    name: String,
    dollarPrice: Number,
    type: String,
    date: Date
})

productsSchema.set('toJSON',{
    transform: (document, returnedObject) =>{
        returnedObject.id = returnedObject._id;
        delete returnedObject._id;
        delete returnedObject.__v;
    }
})

const Product = model('Product', productsSchema);

module.exports = Product;