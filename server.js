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


const check_session =(req)=>{
  return new Promise ((resolve,reject)=>{
    console.log(req.session.uid)
  if(!req.session.uid){
  bddreq.key().then( bddrep =>{
    if(bddrep.uid && bddrep.key ) {
      req.session.uid=bddrep.uid
      req.session.key=bddrep.key
      req.session.cpt=1
    }
    console.log(bddrep)
    console.log(req.session.uid,req.session.key)
    resolve(bddrep);
  })}
  else{
    if (req.session.cpt){
      req.session.cpt++
      resolve( {key:req.session.key,msg:"old key"} );
    }else{
      reject(new Error("session err"));
    }
    
  }
})}


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
  check_session(req).then(rep=>{
    res.sendFile(path.join(__dirname, '/index.html'));
  }).catch(err=>{return res.json({msg:err})});})
  
}
else{
  check_session(req).then(rep=>{
   app.use(express.static(path.join(__dirname, 'dist')));
}).catch(err=>{return res.json({msg:err})});
}

app.get('/key', (req, res) => {

  if(req.query.new){req.session.uid=false}
  
  check_session(req).then(rep=>{
    if(rep.uid){delete rep.uid;}
      res.json(rep)
    }).catch(err=>{return res.json({msg:err})});})
     



app.get('/set', (req, res) => {
  check_session(req).then(rep=>{
    return bddreq.set(req.session.uid,req.session.key,req.query.val).then( bddrep =>{
    res.json(bddrep);
    })}).catch(err=>{return res.json({msg:err})});})
 



app.get('/get', (req, res) => {
  check_session(req).then(rep=>{
  return bddreq.get(req.query.key).then( bddrep =>{
    res.json(bddrep);
  })}).catch(err=>{return res.json({msg:err})});})
 


const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening: http://localhost:${port}`);
});