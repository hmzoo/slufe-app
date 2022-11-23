const express = require('express');
const path = require('path');
const bddreq = require('./bddreq.js')

const isProd = process.env.NODE_ENV === 'production'
const app = express();
app.use(express.json());


if (!isProd){
require('vite').createServer({
  root:__dirname,
  logLevel: !isProd ? 'error' : 'info',
  server: {
    middlewareMode: true,
    watch: {
      usePolling: true,
      interval: 100,
    },
  },
}).then(vite =>{
  app.use(vite.middlewares) });

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
});}
else{
app.use(express.static(path.join(__dirname, 'dist')));
}

app.get('/set', (req, res) => {
  bddreq.set(req.query.uid,req.query.k,req.query.v).then( rep =>{
    res.json(rep);
  })
});



app.get('/get', (req, res) => {
  bddreq.get(req.query.k).then( rep =>{
    res.json(rep);
  })
});

app.get('/uid', (req, res) => {
  bddreq.uid_key(req.query.k).then( rep =>{
    res.json(rep);
  })
});

app.get('/val', (req, res) => {
  bddreq.val_key(req.query.v).then( rep =>{
    res.json(rep);
  })
});

app.get('/newuid', (req, res) => {
  res.json(bddreq.new_uid())
});







const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening: http://localhost:${port}`);
});