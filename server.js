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

app.get('/hb', (req, res) => {
  
  if (!req.session.uid || req.query.new) { 
    
    if(!req.session.key_cpt){req.session.key_cpt = 0}
    if(req.session.key_cpt<24){
      req.session.uid = uuidv4()
    myred.new_key(req.session.uid).then(rep =>{
        if(rep.key){
        req.session.key = rep.key;
        req.session.key_cpt = req.session.key_cpt+1;
        res.json(rep);
        }else{
          delete req.session.uid;
          res.json(rep);
        }
      });
    }else{
      res.json(myred.json_err);
    }
     
      }else{
        myred.check_key(req.session.key, req.session.uid).then(ans =>{
          if(ans){
            myred.json_flux(req.session.key,"").then(rep=>{res.json(rep);})
          }else{
            delete req.session.uid;
            delete req.session.key;
            delete req.session.key_cpt;
            res.json(myred.json_err);

          }
      })
      }
    });
    
    app.get('/set', (req, res) => {
    if(req.session.uid&&req.session.key){
      myred.check_key(req.session.key, req.session.uid).then(ans =>{
        if(ans){
          myred.set_flux(req.session.key,req.query.val).then(rep=>{
            res.json(rep);
          })
        }else{
          
          delete req.session.uid;
          delete req.session.key;
          res.json(myred.json_err);
        }

      })
    } else{
      res.json(myred.json_err);
    }

    });

    app.get('/add', (req, res) => {
      if(req.session.uid&&req.session.key&&req.query.key){
        myred.check_key(req.session.key, req.session.uid).then(ans =>{
          if(req.session.last_add&&(Date.now()-req.session.last_add<5000)){
            req.session.last_add=Date.now();
            res.json(myred.json_err);
          }else{
          if(ans){
            req.session.last_add=Date.now();
            myred.add_flux(req.session.key,req.query.key).then(rep=>{
              res.json(rep);
            })
          }else{
            delete req.session.uid;
            delete req.session.key;
            res.json(myred.json_err);
          }
        }
  
        })
      } else{
        res.json(myred.json_err);
      }
  
      });

      app.get( '^/:qkey([0-9]{6})', function( req, res ) {
        if (!req.session.uid ) { 
          req.session.uid = uuidv4()
          myred.new_key(req.session.uid).then(rep =>{
              if(rep.key){
              req.session.key = rep.key;
              req.session.last_add=Date.now();
              myred.add_flux(req.session.key,req.params.qkey).then(rep=>{
                res.json(rep);
              })
            }else{
                delete req.session.uid;
                res.json(rep);
              }
            })
          }else{
            myred.check_key(req.session.key, req.session.uid).then(ans =>{
              if(req.session.last_add&&(Date.now()-req.session.last_add<5000)){
                req.session.last_add=Date.now();
                res.json(myred.json_err);
              }else{
              if(ans){
                req.session.last_add=Date.now();
                myred.add_flux(req.session.key,req.params.qkey).then(rep=>{
                  res.json(rep);
                })
              }else{
                delete req.session.uid;
                delete req.session.key;
                res.json(myred.json_err);
              }
            }
      
            })

          }
    } );




const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening: http://localhost:${port}`);
});