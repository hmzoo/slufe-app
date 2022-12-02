const express = require('express');
const cookieParser = require('cookie-parser')
const session = require('express-session')
const cors = require('cors')
const { v4: uuidv4 } = require('uuid');

let RedisStore = require("connect-redis")(session)
const Redis = require("ioredis")
let redisClient = new Redis()

const path = require('path');

const myred = require('./myred.js');

const isProd = process.env.NODE_ENV === 'production'



const app = express();


app.use(express.json());
app.use(cookieParser());

app.use(session(
  {
    name: "slufe",
    store: new RedisStore({ client: redisClient }),
    saveUninitialized: false,
    resave: false,
    secret: "zQleLeWoJly1OSFF",
    cookie: {
      secure: false,
      maxAge: 86400000
    }
  }));

const ctrl_session_rate = (n, t) => {

}





if (!isProd) {

  require('vite').createServer({
    root: __dirname,
    logLevel: !isProd ? 'error' : 'info',
    server: {
      middlewareMode: true,
      watch: {
        usePolling: true,
        interval: 100,
      },
    },
  }).then(vite => {
    app.use(vite.middlewares)
  });
  app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
  })
} else {
  app.use(express.static(path.join(__dirname, 'dist')));
}

app.get('/key', (req, res) => {
  console.log(req.session.uid ,req.query.new)
  if (!req.session.uid || req.query.new) { 
    req.session.uid = uuidv4()
    myred.new_key(req.session.uid).then(key =>{
      console.log("newkey",key)
      if(key){
        req.session.key = key;
        myred.json_flux(req.session.uid,req.session.key).then(rep=>{
          res.json(rep);
        })}else{
          res.json({k:"000000",f:[]});
        }
    })
  
  }else{
    myred.json_flux(req.session.uid,req.session.key).then(rep=>{
      res.json(rep);
    })
  }

 
});







const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening: http://localhost:${port}`);
});