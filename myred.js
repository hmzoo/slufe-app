
const Redis = require("ioredis");
const redis = new Redis({
    host: 'localhost',
    port: 6379,
});

const ttl = 360;
const rankey = () => { return "" + (100000 + Math.floor(Math.random() * 900000)); }


const myred = {
    new_key: (uid, n = 12) => {
        if (n < 0) { return 0 }
        const key = rankey();
        return redis.exists("uid_" + key).then(ans => {
            if (ans == 1) {
                return myred.newkey(uid, n - 1);
            } else {
                redis.del("flux_" + key);
                redis.del("flw_" + key);
                redis.sadd("fwl_" + key, key);
                return redis.set("uid_" + key, uid, 'ex', ttl).then(ans => { return key });
            }
        })
    },
    check_key: (key, uid)=>{
        return redis.get("uid_" + key).then(ans => ans == uid)
    },
    set_flux: (uid, key, val) => {
        return this.check_key(key, uid).then(ans => {
            if (ans) {  return redis.set("flux_" + key, val, 'ex', ttl); } else { return "" }
        })
    },
    get_flux: (uid, key, qkey) => {
        return this.check_key(key, uid).then(ans => {
            if (ans) {
                return redis.get("flux_" + key).then(flux => {
                    if (flux) {
                        redis.sadd("fwl_" + qkey, key);
                        return redis.sadd("fwl_" + key, qkey).then(r => { return flux; })
                    } else { return "" }
                })
            } else { return "" }
        })
    },
    all_flux: (uid, key) => {
        return this.check_key(key, uid).then(ans => {
            if (ans) { return redis.smembers("fwl_" + key); } else { return [] }
        })
    },
    json_flux: (uid, key) => {
        return myred.check_key(key, uid).then(ans => {
            if (ans) {
                let resp = { key: key, flux: [] };
                return redis.smembers("fwl_" + key).then(keys => {
                    if (keys && keys.length>0) {
                        console.log(keys)
                        return redis.mget(keys).then(flux => {
                            for (let i = 0; i < keys.lenght; i++) {
                                resp.flux.push({ k: key[i], f: flux[i] || "" })
                            }
                            return resp;
                        })
                    } else {
                        return { key: key, flux: []  };
                    }
                })
            } else {
                return { key: key, flux: []  };
            }

        })

    }
}







module.exports = myred;