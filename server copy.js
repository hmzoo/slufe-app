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


const check_session_key = (req) => {
  return new Promise((resolve, reject) => {

    if (!req.session.key_cpt) { req.session.key_cpt = 1; }

    if (!req.session.uid && req.session.key_cpt < 30) {
      req.session.key_cpt++;
      bddreq.key().then(bddrep => {
        if (bddrep.uid && bddrep.key) {
          req.session.uid = bddrep.uid;
          req.session.key = bddrep.key;
        }
        console.log(req.session.key_cpt, req.session.key)
        bddrep.nk=req.session.key_cpt < 30
        resolve(bddrep);
      })
    }
    else {
      if (req.session.key) {
        resolve({ key: req.session.key, msg: "old key",nk:req.session.key_cpt < 30 });
      } else {
        reject(new Error("session err"));
      }
    }
  })
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

  if (req.query.new) { req.session.uid = false }

  check_session_key(req).then(rep => {
    if (rep.uid) { delete rep.uid; }
    res.json(rep)
  }).catch(err => { return res.json({ msg: err }) });
})




app.get('/set', (req, res) => {
    if(req.session.uid && req.query.val){
    return bddreq.set(req.session.uid, req.session.key, req.query.val).then(bddrep => {
      res.json(bddrep);
    }).catch(err => { return res.json({ msg: err }) });
  }else{
      res.json({ msg: "no key !" });
  }
  
})




app.get('/get', (req, res) => {
  if (!req.session.get_cpt) { req.session.get_cpt = 1; }
  if(req.session.uid && req.query.key &&req.session.get_cpt<100){
    req.session.get_cpt++;
    return bddreq.get(req.session.uid, req.session.key,req.query.key).then(bddrep => {
      bddrep.cget = req.session.get_cpt<100
      res.json(bddrep);
    }).catch(err => { return res.json({ val:"°_°",cget:false,msg: err }) });
  }else{
    res.json({ val:"°_°",cget:false,msg: "no key !" });
}
  
})



const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening: http://localhost:${port}`);
});