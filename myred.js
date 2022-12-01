
const Redis = require("ioredis");
const redis = new Redis({
    host: 'localhost',
    port: 6379,
  });

const ttl = 360;
const rankey = () => { return "" + (100000 + Math.floor(Math.random() * 900000)); }


const myred = {
   newkey:(uid,n = 12)=>{
    if (n < 0) {return 0}
    const key = rankey();
    return redis.exists("uid_" + key).then(ans => {
        if (ans == 1) {
          return this.newkey(uid,n - 1);
        }else{
            return redis.set("uid_" + key, uid, 'ex', ttl).then(ans =>{return key});
        }
    })
   },
   checkkey: (key,uid){
     return redis.get("uid_" + key).then(ans => ans==uid )
   },
   set_flux:(key,val)=>{
      return redis.set("flux_" + key, val, 'ex', ttl);
   },
   get_flux:(key)=>{
    return redis.get("flux_" + key);
   },
   add_fwl:(key,qkey)=>{
    return redis.saad("fwl_" + key,qkey);
   },
   add_fwl:(key,qkey)=>{
    return redis.saad("flux_" + key,qkey);
   },
   del_fwl:(key,qkey)=>{
        return redis.srem("flux_" + key,qkey);
   },
   all_fwl:(key,qkey)=>{
    return redis.smembers("flux_" + key);
   },




}

module.exports = myred;