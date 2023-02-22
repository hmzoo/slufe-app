
const Redis = require("ioredis");
const redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
});

redis.flushall();

const ttl = 60*60*24;
const rankey = () => { return "" + (100000 + Math.floor(Math.random() * 900000)); }


const myred = {
    new_key: (uid, n = 12) => {
        
        if (n < 0) { return { key: "", data: [] ,msg: "No free key !!" }; }
        const key = rankey();
        
        return redis.exists("uid_" + key).then(ans => {    
            
            if (ans == 1) {
                return myred.new_key(uid, n - 1);
            } else {
                redis.del("data_" + key);
                redis.del("flw_" + key);
                let msg="Your key is "+key;
                return redis.set("uid_" + key, uid, 'ex', ttl).then(ans => { return myred.json_data(key,msg) });

                /*
                return redis.sadd("fwl_" + key, key).then(rep=>{
                    let msg="Your key is "+key;
                    return redis.set("uid_" + key, uid, 'ex', ttl).then(ans => { return myred.json_data(key,msg) });
                }) 
                */
            }
        })
    },
    check_key: (key, uid)=>{
        if(key && uid) {
        return redis.get("uid_" + key).then(ans => ans == uid)
        }else{
            return Promise.resolve(false);
        }
    },
    reset_key: (key)=>{
        redis.del("uid_" + key);
        redis.del("data_" + key);
        redis.del("flw_" + key);
    },
    set_data: (key, val) => {
         let msg ="";
         if (val){msg="Sharing";}else{msg="Not sharing"}
         return redis.set("data_" + key, val, 'ex', ttl).then(r => { return myred.json_data(key,msg) }); 
    },
    add_key: (key, qkey) => {
        if (key == qkey) {return myred.json_data(key,"you are "+key ) }
        return redis.exists("uid_" + qkey).then(ans => {
            
            let msg ="";
            if(ans){
                msg=qkey+ " added";
                        redis.sadd("fwl_" + qkey, key);
                        return redis.sadd("fwl_" + key, qkey).then(r => { return myred.json_data(key,msg) })
            }else{
                msg="nobody at "+qkey +" !!";
                return myred.json_data(key,msg) 
            }
     })},
     clean_keys: (key)=>{
        return redis.smembers("fwl_" + key).then(keys => {
            for (let i = 0; i < keys.length; i++) {
                let k = keys[i]
                redis.exists("uid_" + k ).then(ans => {
                    if(ans != 1 ){
                        redis.srem("fwl_" + key,k);
                    }
                })

            }
            return myred.json_data(key,"")
        })

     },
     json_err: { key: "", fwl: [] ,msg:"ERR" },
    json_data: ( key,msg) => {
                let resp = { key: key, fwl: [],msg:msg };
                return redis.exists("fwl_" + key).then(ans => {    
                    if (ans == 1) {
                
                return redis.smembers("fwl_" + key).then(keys => {
                    
                    if (keys && keys.length>0) {
                        const fwl_keys = keys.map(element => {
                            return "data_"+element;
                          });
                          
                        return redis.mget(fwl_keys).then(data => {
                            
                            for (let i = 0; i < keys.length; i++) {
                                resp.fwl.push({ k: keys[i], d: data[i] || "" })
                            }
                            return resp;
                        })
                    } else {
                        return resp;
                    }
                })

            }else{
                return resp;
            }
        })
  
        }

    
}







module.exports = myred;