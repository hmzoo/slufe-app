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

//const rankey = () => { return "" + (100000+Math.floor(Math.random() * 900000)); }
const rankey = () => { return "" + (1+Math.floor(Math.random() * 9)); }
const ttl = 60;

bddreq.new_uid = () => {
    return {
        uid: newuid()
      };
}

bddreq.key = (n=12) => {
    
    if(n<0){
        return {
            msg: 'no free key !'
          };
    }
    const key = rankey()
    return bddreq.check_key_exists(key).then(ans=>{

      if(ans){
        return bddreq.key(n-1)
      }else{
        const uid=newuid();
            return redis.set(uid_prefix+uid,key,'ex', ttl).then(ans =>{ 
                redis.set(key_prefix+key,"°_°",'ex', ttl)
                return {key:key,uid:uid,msg:"key ok",tst:12-n};
            })
      }



    })



}

bddreq.get = (k) => {
    return redis.get(key_prefix+k).then(ans =>{
        return {
            val: ans,
            msg: ""
          };
    }).catch(err=>{
        return {
        msg: err
      };
    })
}

bddreq.set = (uid,k,v) => {

    return bddreq.check_uid_key(uid,k).then(ans =>{
        if(ans){
            return redis.set(key_prefix+k,v,'ex', ttl).then(ans =>{
                return redis.set(val_prefix+v,k,'ex', ttl).then(ans =>{
                return {
                    msg: "val changed"
                  };
            })})
        }else{
            return {
                msg: "bad key"
              };
        }


    })

   
}

bddreq.uid_key = (k) => {

    return bddreq.check_key_exists(k).then(ans=>{
        console.log(ans)
        if(!ans){
            const uid=newuid();
            return redis.set(uid_prefix+uid,k,'ex', ttl).then(ans =>{ 
                return {key:k,uid:uid,msg:"key ok"};
            })
        }else{
                return {msg :"key not free"};
        }

    })

}

bddreq.check_key_exists =(k)=> {
    return redis.exists(key_prefix+k).then(ans =>{
        console.log("KEY",k,"ANS",ans)
        return ans == 1
    })
}

bddreq.check_uid_key =(uid,k)=> {
    return redis.get(uid_prefix+uid).then(ans =>{
        return ans == k
    })
}

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