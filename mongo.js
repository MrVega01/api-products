const moongose = require('mongoose');

const password = process.env.PASSWORD;
const connectionString = `mongodb+srv://mrvega01:${password}@cluster0.nxuec.mongodb.net/?retryWrites=true&w=majority`;

moongose.connect(connectionString)
    .then(()=>{
        console.log('TODO BIEN ;)')
    })
    .catch((err)=>{
        console.error(err);
    })

/*

Product.find().then((res)=>{
    console.log(res);
    mongoose.connection.close();
}).catch((err)=>{
    console.error(err);

})

///////

const product = new Product({
    name: 'MongoDB es increíble',
    dollarPrice: 1,
    type: 'Clean',
    date: new Date()
});
product.save()
    .then((res)=>{
        console.log(res);
        mongoose.connection.close();
    })
    .catch((err)=>{
        console.error(err);
    });
*/