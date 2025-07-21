const express = require('express');
const res = require('express/lib/response');
const app = express();
const server = require('http').Server(app);
const {v4:uuidv4} = require('uuid');

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.redirect(`/${uuidv4()}`);
})

app.get('/:id', (req, res) => {
    res.render('index', {indexId:req.params.id});
})

server.listen(3000);

