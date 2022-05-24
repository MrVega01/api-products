const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// GET JSON
let products = async ()=>{
    try {
        const data = fs.readFileSync('./products.json', 'utf8');
        return JSON.parse(data);
    }
    catch (err) {
        console.error(err);
    }
}

//SET JSON
let setProducts = (content)=>{
    fs.writeFile('./products.json', content, err => {
        if (err) {
          console.error(err);
        }
        // file written successfully
    });
}
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
app.get('/api/products', async (req, res)=>{
    res.json( await products());
});
//GET SELECTED NOTE
app.get('/api/products/:id', async (req, res)=>{
    const id = Number(req.params.id);
    const nowProducts = await products();
    console.log(nowProducts)
    const product = nowProducts.find(note => id === note.id);
    if(product){
        res.json(product);
    }
    else{
        res.status(404).end();
    }
});
//POST
app.post('/api/products', async (req, res) => {
    const product = req.body;
    if(!product || !product.name || !product.dollarPrice || typeof(product.dollarPrice) !== "number"){
        res.status(400).json({
            error: 'Missing data in POST or bad request'
        });
    }
    else{
        const nowProducts = await products();
        const ids = nowProducts.map(note => note.id);
        const maxId = Math.max(...ids);

        const newProduct = {
            id: maxId + 1,
            name: product.name,
            dollarPrice: product.dollarPrice,
            type: product.type,
            date: new Date().toISOString()
        }
        nowProducts.push(newProduct);
        setProducts(JSON.stringify(nowProducts));
        res.status(201).json(newProduct);
    }
});
//DELETE
app.delete('/api/products/:id', async (req, res) => {
    const id = Number(req.params.id);
    let nowProducts = await products();
    nowProducts = nowProducts.filter(note => id !== note.id);
    setProducts(JSON.stringify(nowProducts));
    res.status(204).end();
});
//PUT
app.put('/api/products/:id', async (req, res) => {
    const product = req.body;
    if(!product){
        res.status(400).json({
            error: 'Missing data on PUT'
        })
    }
    const id = Number(req.params.id);
    const nowProducts = await products();
    if(!nowProducts.find(n => n.id === id)) res.status(404).json( { error: 'Product not find' } )

    nowProducts.forEach(n => {
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
    setProducts(JSON.stringify(nowProducts));
    res.status(201).json(nowProducts.find(n => n.id === id));
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