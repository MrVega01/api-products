const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let notes = [
    {
        id: 1,
        title: 'This is a title!!!',
        content: 'This is a totally normal text',
        date: '2022-04-08T07:11:30.008Z'
    },
];
//Home
app.get('/', (req, res)=>{
    res.send(`<h1>API REST with Node.js</h1>
              <p>GET: localhost:3000/api/notes</p>
              <p>GET: localhost:3000/api/notes/:id</p>
              <p>POST: localhost:3000/api/notes</p>
              <p>PUT: localhost:3000/api/notes/:id</p>
              <p>DELETE: localhost:3000/api/notes/:id</p>`

    );
});
//GET ALL
app.get('/api/notes', (req, res)=>{
    res.json(notes);
});
//GET SELECTED NOTE
app.get('/api/notes/:id', (req, res)=>{
    const id = Number(req.params.id);
    const note = notes.find(note => id === note.id);
    if(note){
        res.json(note);
    }
    else{
        res.status(404).end();
    }
});
//POST
app.post('/api/notes', (req, res) => {
    const note = req.body;
    if(!note || !note.content){
        res.status(400).json({
            error: 'Missing data in POST'
        })
    }

    const ids = notes.map(note => note.id);
    const maxId = Math.max(...ids);

    const newNote = {
        id: maxId + 1,
        title: note.title,
        content: note.content,
        date: new Date().toISOString()
    }
    notes.push(newNote);
    res.status(201).json(newNote);
});
//DELETE
app.delete('/api/notes/:id', (req, res) => {
    const id = Number(req.params.id);
    notes = notes.filter(note => id !== note.id);
    res.status(204).end();
});
//PUT
app.put('/api/notes/:id', (req, res) => {
    const note = req.body;
    if(!note || !note.content){
        res.status(400).json({
            error: 'Missing data on PUT'
        })
    }
    const id = Number(req.params.id);
    if(!notes.find(n => n.id === id)) res.status(404).json( { error: 'Note not find' } )

    notes.forEach(n => {
        if(n.id === id){
            n.title = note.title
            n.content = note.content
        }
    });
    res.status(201).json(notes.find(n => n.id === id));
});
//404
app.use((req, res) => {
    res.status(404).json({
        error: 'Not found'
    })
})
//Server listener
const PORT = 3000;
app.listen(PORT, ()=>{
    console.log(`Server running in: localhost:${PORT}`);
})