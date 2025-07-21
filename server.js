const express = require('express');
const res = require('express/lib/response');
const app = express();
const server = require('http').Server(app);
const {v4:uuidv4} = require('uuid');
const io = require('socket.io')(server);

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.redirect(`/${uuidv4()}`);
})

app.get('/:id', (req, res) => {
    res.render('index', {indexId:req.params.id});
})

io.on("connection", socket => {
    socket.on('join-room', (indexId, userId) => {
        console.log(indexId, userId);
    })
})

server.listen(3000);

