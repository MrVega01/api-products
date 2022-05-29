require('./mongo');

const express = require('express');
const cors = require('cors');
const app = express();
const Product = require('./models/Product');

app.use(cors());
app.use(express.json());

//Home
app.get('/', (req, res)=>{
    res.send(`<h1>API REST with Node.js</h1>
              <p>GET: localhost:3000/api/products</p>
              <p>GET: localhost:3000/api/products/:id</p>
              <p>POST: localhost:3000/api/products</p>
              <p>PUT: localhost:3000/api/products/:id</p>
              <p>DELETE: localhost:3000/api/products/:id</p>`

    );
});
//GET ALL
app.get('/api/products', (req, res)=>{
    Product.find().then((products)=>{
        res.json(products);
    })
});
//GET SELECTED NOTE
app.get('/api/products/:id', (req, res, next)=>{
    const id = req.params.id;
    Product.findById(id).then((product)=>{
        if(product){
            res.json(product);
        }
        else{
            res.status(404).end();
        }
    }).catch((err)=>{
        next(err);
    })
});
//POST
app.post('/api/products', (req, res) => {
    const product = req.body;
    if(!product || !product.name || !product.dollarPrice || typeof(product.dollarPrice) !== "number"){
        res.status(400).json({
            error: 'Missing data in POST or bad request'
        });
    }
    else{
        const newProduct = new Product({
            name: product.name,
            dollarPrice: product.dollarPrice,
            type: product.type,
            date: new Date()
        });
        newProduct.save().then((savedProduct)=>{
            res.status(201).json(savedProduct);
        })
    }
});
//DELETE
app.delete('/api/products/:id', (req, res, next) => {
    const id = req.params.id;
    Product.findByIdAndRemove(id).then(()=>{
        res.status(204).end();
    }).catch((err)=>{
        next(err);
    });
});
//PUT
app.put('/api/products/:id', (req, res, next) => {
    const product = req.body;
    if(!product){
        res.status(400).json({
            error: 'Missing data on PUT'
        })
    }
    const id = req.params.id;

    const newProductInfo = new Product({
        name: product.name,
        dollarPrice: product.dollarPrice,
        type: product.type,
    });

    Product.findByIdAndUpdate(id, newProductInfo, {new: true}).then((result)=>{
        res.status(201).json(result);
    }).catch((err)=>{
        next(err);
    })
});
//Other errors
app.use((err, req, res)=>{
    console.error(err);
    if(err.name === 'CastError'){
        res.status(400).send({error: 'id used is malformed'})
    }
    else{
        res.status(500).end()
    }
})
//404
app.use((req, res) => {
    res.status(404).json({
        error: 'Not found'
    })
})
//Server listener
const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log(`Server running in: localhost:${PORT}`);
})