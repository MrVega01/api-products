const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let products = [
    {
        id: 1,
        name: 'This is a product!!!',
        dollarPrice: 5,
        type: "clean",
        date: '2022-04-08T07:11:30.008Z'
    },
];
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
    res.json(products);
});
//GET SELECTED NOTE
app.get('/api/products/:id', (req, res)=>{
    const id = Number(req.params.id);
    const product = products.find(note => id === note.id);
    if(product){
        res.json(product);
    }
    else{
        res.status(404).end();
    }
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
        const ids = products.map(note => note.id);
        const maxId = Math.max(...ids);

        const newProduct = {
            id: maxId + 1,
            name: product.name,
            dollarPrice: product.dollarPrice,
            type: product.type,
            date: new Date().toISOString()
        }
        products.push(newProduct);
        res.status(201).json(newProduct);
    }
});
//DELETE
app.delete('/api/products/:id', (req, res) => {
    const id = Number(req.params.id);
    products = products.filter(note => id !== note.id);
    res.status(204).end();
});
//PUT
app.put('/api/products/:id', (req, res) => {
    const product = req.body;
    if(!product){
        res.status(400).json({
            error: 'Missing data on PUT'
        })
    }
    const id = Number(req.params.id);
    if(!products.find(n => n.id === id)) res.status(404).json( { error: 'Product not find' } )

    products.forEach(n => {
        if(n.id === id){
            n.name = product.name
            ? product.name
            : n.name;

            n.dollarPrice = product.dollarPrice && typeof(product.dollarPrice) === "number"
            ? product.dollarPrice
            : n.dollarPrice;

            n.type = product.type
            ? product.type
            : n.type;
        }
    });
    res.status(201).json(products.find(n => n.id === id));
});
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