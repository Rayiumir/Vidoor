const express = require('express');
const res = require('express/lib/response');
const app = express();
const server = require('http').Server(app);

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index');
})

server.listen(3000);

