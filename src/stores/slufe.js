
import { defineStore } from 'pinia';
import Peer from 'peerjs';
import axios from 'axios';
axios.defaults.withCredentials = true;

const site_url = "https://slufe.com"
const site_title = "SLUFE"


let myPeer = null;
let peers =[]
let connections = [];
let calls = [];
let failed_peerid = [];



const fakestream=()=>{

    const canvas = Object.assign(document.createElement('canvas'), { width:320, height:200 });
    canvas.getContext('2d').fillRect(0, 0, 320, 200);
    const stream = canvas.captureStream();
    const vtrack = stream.getVideoTracks()[0];
    const videoTrack = Object.assign(vtrack, { enabled: false });
    return new MediaStream([videoTrack]);
}
let mystream= fakestream();

const new_peer = (id) => {
    var index = peers.map(function (e) { return e.id; }).indexOf(id);
    if (index < 0) {
        peers.push({ id: id, keynum: "000000", stream: fakestream(), message: "", connection:null, call:fakestream() })
    }
}



const remove_peer = (id) => {
    var index = peers.map(function (e) { return e.id; }).indexOf(id);
    if (index >= 0) {
    if(peers[index].connection && peers[index].connection.open){
        peers[index].connection.close()
    }
    console.log(index,peers[index],peers[index].call)

    if( peers[index].call != null ){
     //   peers[index].call.close()
    }
    useSlufeStore().messages.push({ keynum: peers[index].keynum, msg:"peer closed", cat:"info" })
    peers = peers.filter(function (obj) {
        return obj.id !== id;
    });
   }
}


const new_connection = (cxn) => {
    var index = peers.map(function (e) { return e.id; }).indexOf(cxn.peer);
    if(peers[index].connection && peers[index].connection.open){
        peers[index].connection.close()
    }
    peers[index].connection =cxn
    useSlufeStore().messages.push({ keynum: peers[index].keynum, msg:"connected", cat:"info" })
}


const new_call = (call,stream) => {
    var index = peers.map(function (e) { return e.id; }).indexOf(call.peer);
    if(peers[index].call && peers[index].call.open){
        peers[index].call.close()
    }
    peers[index].call =call
    peers[index].stream = stream
}





const init_mypeer = () => {
    myPeer = new Peer()
    myPeer.on('open', (id) => {
        useSlufeStore().set(id);
        failed_peerid.push(id);
        myPeer.on('connection', (cxn) => {
            var index = peers.map(function (e) { return e.id; }).indexOf(id);
            if ( index>=0 && !peers[index].connection && !peers[index].connection.open) {
                init_connection(cxn);
            }
        })
        myPeer.on('call', (call) => {  
            var index = peers.map(function (e) { return e.id; }).indexOf(id); 
            if ( index>=0 && !peers[index].call && !peers[index].call.open) { 
            init_call(call);    
            call.answer(mystream)
            }
        })
        myPeer.on('close', () => {
            remove_peer(id);
        })
        myPeer.on('error', (err) => {
            console.log(err)
            let serr = err.toString();
            if (serr.length > 34) {
                let err_msg = serr.substring(0, 32);
                if (err_msg == "Error: Could not connect to peer") {
                    let err_id = serr.substring(33);
                    failed_peerid.push(err_id);
                }
            }
            remove_peer(id);
        })
    })
}

const reset_mypeer = () => {
if (myPeer != null) {
    for (let i = 0; i < peers.length; i++) {
        if(peers[index].connection && peers[index].connection.open){
            peers[index].connection.close()
        }
        if(peers[index].call && peers[index].call.open){
            peers[index].call.close()
        }
    }
    peers.splice(0,  useSlufeStore().length)
    myPeer.destroy();
}
}

const init_connection = (cxn) => {
    
    new_peer(cxn.peer);
    cxn.on('open', () => {
        new_connection(cxn);
        cxn.send({ keynum: useSlufeStore().key });
    })
    cxn.on('data', (data) => {
        var index = peers.map(function (e) { return e.id; }).indexOf(cxn.peer);
        if (data.keynum) {   
            if (index >= 0) {
                peers[index].keynum = data.keynum
            } 
        }
        if (data.msg) {
            if (index >= 0) {
                peers[index].message = data.msg
            } 
            useSlufeStore().messages.push({ keynum: peers[index].keynum, msg:data.msg, cat:"peer" })
        }
        if (data.ask && data.ask == "callme") {
           
        }
    })
    cxn.on('close', () => {
        var index = peers.map(function (e) { return e.id; }).indexOf(cxn.peer);
        useSlufeStore().messages.push({ keynum: peers[index].keynum, msg:"connection closed", cat:"info" })
        remove_peer(cxn.peer);

    })
    cxn.on('error', (error) => {
        useSlufeStore().messages.push({ keynum: peers[index].keynum, msg:"connection closed", cat:"info" })
        remove_peer(cxn.peer);
    })
}

const init_call = (call) => {
    new_peer(call.peer);
    call.on('stream', (stream => {
        new_call(call,stream);

    }))
    call.on('close', () => {
        new_call(null,fakestream())
    })
    call.on('error', (err) => {
        new_call(null,fakestream())
    })

}

const synchro_fwl_peers = () => {
    let fwl = useSlufeStore().fwl
    
    let todelete = [];

    for (let i = 0; i < fwl.length; i++) {

            for (let j = 0; j < peers.length; j++) {
                if (peers[j].keynum == fwl[i].k && peers[j].id != fwl[i].d) {
                    todelete.push(peers[j].id)
                }
            }   
    }
    for (let i = 0; i < peers.length; i++) {
        var index = fwl.map(function (e) { return e.k; }).indexOf(peers[i].keynum);
        if (index < 0) {
            todelete.push(peers[i].id)
        }
    }
    
    for (let i = 0; i < todelete.length; i++) {
        remove_peer(todelete[i]);
    }
    for (let i = 0; i < fwl.length; i++) {
    let id = fwl[i].d
    if (id  && !failed_peerid.includes(id) ) { 
        var index = peers.map(function (e) { return e.id; }).indexOf(id);
        if (index<0 || !(peers[index].connection && peers[index].connection.open) ) {
            init_connection(myPeer.connect(id));
        }
        if (index<0 || !(peers[index].call && peers[index].call.open) ) {
            console.log("s",useSlufeStore().stream)
            init_call(myPeer.call(id, mystream))
        }
    }}
    useSlufeStore().update_flux(peers);

}



export const useSlufeStore = defineStore('slufe', {

    state: () => ({
        msg: "",
        key: "000000",
        fwl: [],
        site_url: site_url,
        site_title: site_title,
        flux: [],
        messages: []

    }),
    actions: {
        update_data(data) {
            this.updated = this.fwl.length != data.fwl.length
            this.msg = data.msg || "";
            this.key = data.key || "no key";
            this.fwl = data.fwl || [];
            
        },
        hb() {
            axios.get('/hb').then(res => {
                this.update_data(res.data);  
            })
        },
        renew() {
            axios.get('/new').then(res => {
                this.update_data(res.data);
            })
        },
        set(v) {
            axios.get('/set', { params: { val: v } }).then(res => {
                this.update_data(res.data);
            })
        },
        add(k) {
            axios.get('/add', { params: { key: k } }).then(res => {
                this.update_data(res.data);
            })
        },
        clean() {
            axios.get('/clean').then(res => {
                this.update_data(res.data);
            })
        },
        update_flux(p) {
            this.flux.splice(0, this.flux.length, ...p)
        },
        update_messages(m) {
            this.messages.splice(0, this.messages.length, ...m)
        },

        send_message(msg) {
            this.messages.push({ keynum: this.keynum, msg:msg, cat:"me" })
            for (let i = 0; i < peers.length; i++) {
                if(peers[i].connection && this.peers[i].connection.open){
                    peers[i].connection.send({ keynum: mykeynum, msg: msg })
                }
            }
        },
        stream(s) {
            console.log("STREAM",stream)
            mystream=s;
            for (let i = 0; i < peers.length; i++) {
                if(peers[i].call && peers[i].call.open){
                    //this.peers[index].call.close();
                    init_call(myPeer.call(peers[i].id, s))
                }
            }
        },
        init_peer() {
            reset_mypeer();
            init_mypeer();
        },
        reset_peer() {
            reset_mypeer();
        },
        synchro() {
            synchro_fwl_peers();
            
        }

    },
    getters: {
        keylink: (state) => { return state.site_url + "/" + state.key }
    }



});