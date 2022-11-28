const { v4: uuidv4 } = require('uuid');
const Redis = require("ioredis");

const redis = new Redis({
    host: 'localhost',
    port: 6379,
  });

const uid_prefix = "UID:";
const key_prefix = "KEY:";
const val_prefix = "VAL:";
const newuid = () => {return uuidv4()}

const bddreq = {

}

const rankey = () => { return "" + (100000+Math.floor(Math.random() * 900000)); }
//const rankey = () => { return "" + (1+Math.floor(Math.random() * 9)); }
const ttl = 360;

// Get a key with uid

bddreq.key = (n=12) => {
    
    if(n<0){
        return {
            key:"000000",
            msg: 'no free key !'
          };
    }
    const key = rankey()
    return redis.exists(key_prefix+key).then(ans=>{

      if(ans==1){
        return bddreq.key(n-1)
      }else{
        const uid=newuid();
            return redis.set(uid_prefix+uid,key,'ex', ttl).then(ans =>{ 
                redis.set(key_prefix+key,"°_°",'ex', ttl)
                return {key:key,uid:uid,msg:"new key"};
            })
      }
    })
}

// get value from key

bddreq.get = (k) => {
    return redis.get(key_prefix+k).then(ans =>{
        return {
            val: ans,
            msg: "ok"
          };
    }).catch(err=>{
        return {
        msg: err
      };
    })
}

// set value with key and uid

bddreq.set = (uid,k,v) => {

    return redis.get(uid_prefix+uid).then(ans =>{
        if(ans == k){
            return redis.set(key_prefix+k,v,'ex', ttl).then(ans =>{
                return redis.set(val_prefix+v,k,'ex', ttl).then(ans =>{
                    redis.set(uid_prefix+uid,k,'ex', ttl)
                return {
                    msg: "ok"
                  };
            })})
        }else{
            return {
                msg: "bad key !"
              };
        }


    })

   
}

//util 

bddreq.val_key = (v) => {
    return redis.get(val_prefix+v).then(ans =>{
        return {
            k: ans
          };
    }).catch(err=>{
        return {
        err: err
      };
    })
}

bddreq.mval_mkey = (values) => {
    for (let n=0;n<values.length;n++){
        values[n]=val_prefix+values[n];
    }
    return redis.mget(values).then(ans =>{
        return {
            mk: ans
          };
    }).catch(err=>{
        return {
        err: err
      };
    })
}

module.exports = bddreq;