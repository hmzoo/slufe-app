const express = require('express');
const cookieParser = require('cookie-parser')
const session = require('express-session')
const cors = require('cors')

let RedisStore = require("connect-redis")(session)
const Redis = require("ioredis")
let redisClient = new Redis()

const path = require('path');
const bddreq = require('./bddreq.js')

const isProd = process.env.NODE_ENV === 'production'



const app = express();


app.use(express.json());

app.use(cookieParser());

app.use(session(
  {name : "slufe",
  store: new RedisStore({ client: redisClient }),
  saveUninitialized: false,
  resave: false,
  secret: "zQleLeWoJly1OSFF",
  cookie : {
    secure: false,
    maxAge: 86400000
  }
}));


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

app.get('/key', (req, res) => {

  if(req.session.uid && req.session.key && !req.query.new){
    res.json({
      key: req.session.key,
      uid: req.session.uid,
      msg:"old key",
      tst:0,
      cpt:0
    });
  }else{

  bddreq.key().then( rep =>{
    if(rep.uid && rep.key ) {
      req.session.uid=rep.uid
      req.session.key=rep.key
    }
    if (req.session.cpt){
      req.session.cpt++
    }else{
      req.session.cpt=1
    }
    rep.cpt=req.session.cpt
    console.log(req.session.cpt)
  
    res.json(rep);
  })
}
});


app.get('/set', (req, res) => {
  console.log(req.session.uid,req.query.uid )
  bddreq.set(req.session.uid,req.query.key,req.query.val).then( rep =>{
    res.json(rep);
  })
});



app.get('/get', (req, res) => {
  bddreq.get(req.query.key).then( rep =>{
    res.json(rep);
  })
});



const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening: http://localhost:${port}`);
});