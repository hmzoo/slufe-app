import { defineStore } from 'pinia';
import Peer from 'peerjs';
import axios from 'axios';
axios.defaults.withCredentials = true;

const site_host = import.meta.env.VITE_SITE_HOST || "slufe.com"
const site_title = import.meta.env.VITE_SITE_TITLE || "SLUFE"
const env_test = import.meta.env.VITE_ENV_TEST || "ENV_TEST"

let myPeer = null;
let peers = []
let failed_peerid = [];
let mymessage = "";



const createfakestream = () => {
    let color1 = "#24A8AC", color2 = "#0087CB";
    let numberOfStripes = 30;
    let w = 640
    let h = 400;
    const canvas = Object.assign(document.createElement('canvas'), { width: w, height: h });
    const cxt = canvas.getContext('2d');
    //cxt.fillStyle = 'grey';
    //cxt.fillRect(0, 0, 320, 200);
    for (var i = 0; i < numberOfStripes; i++) {
        var thickness = h / numberOfStripes;
        cxt.beginPath();
        cxt.strokeStyle = i % 2 ? color1 : color2;
        cxt.lineWidth = thickness;

        cxt.moveTo(0, i * thickness + thickness / 2);
        cxt.lineTo(w, i * thickness + thickness / 2);
        cxt.stroke();
    }
    const stream = canvas.captureStream(25);
    const vtrack = stream.getVideoTracks()[0];
    const videoTrack = Object.assign(vtrack, { enabled: true });
    return new MediaStream([videoTrack]);

    
  
}


let mystream = null;
let mystreammuted = null;
let fakestream = createfakestream()

const new_peer = (id) => {
    var index = peers.map(function (e) { return e.id; }).indexOf(id);
    if (index < 0) {
        let keynum = "000000"
        let fwl = useSlufeStore().fwl
        let ifwl = fwl.map(function (e) { return e.d; }).indexOf(id);
        if (ifwl >= 0) { keynum = fwl[ifwl].k }
        index = peers.push({ id: id, keynum: keynum, stream: null, message: "", connection: null, call: null, connected: false, called: false, streamid: "", cpt: 0 }) - 1;
    }
    return peers[index];
}

const remove_peer = (id) => {
    var index = peers.map(function (e) { return e.id; }).indexOf(id);
    if (index >= 0) {
        if (peers[index].connection && peers[index].connection.open) {
            peers[index].connection.close();

        }
        if (peers[index].call && peers[index].call.open) {
            peers[index].call.close();

        }
        peers = peers.filter(function (obj) {
            return obj.id !== id;
        });
    }
}

// Connections
const onConnectionOpen =(p,cxn)=>{
    p.connection = cxn
    p.connected = true
    cxn.send({ keynum: useSlufeStore().key });
    useSlufeStore().message(p.keynum, "connected", "info")
    init_call(cxn.peer)
}

const onConnectionData = (p,data) =>{
    if (data.keynum) { p.keynum = data.keynum }
    if (data.msg) {
        p.message = data.msg
        useSlufeStore().message(p.keynum, data.msg, "peer")
    }
    if (data.ask && data.ask == "callme" && mystream) {
       // init_call(cxn.peer, mystream);
    }
}

const onConnectionClose =(p)=>{
    p.connected = false
    useSlufeStore().message(p.keynum, "connection closed", "info")
}

// Calls
const onCallStream = (p, call, stream) => {
    p.call = call
    p.called = true;
    
    if (stream && stream.id) {
        console.log("STREAM VT",stream.id,stream.getVideoTracks()[0])
        p.stream = stream
        p.streamid = stream.id
    }
}

const onCallStop = (p) => {
    p.called = false;
    p.streamid = ""
    p.called = false;
    if (p.stream) {
        p.stream.getTracks().forEach(track => { track.stop() })
        p.stream = null;
    }
    p.call = null;
}




const init_mypeer = () => {
    myPeer = new Peer()
    myPeer.on('open', (id) => {
        useSlufeStore().set(id);
        myPeer.on('connection', (cxn) => {
            let p = new_peer(cxn.peer);
            cxn.on('open', () => {onConnectionOpen(p,cxn)})
            cxn.on('data', (data) => {onConnectionData(p,data)})
            cxn.on('close', () => {onConnectionClose(p)})
        })
        myPeer.on('call', (call) => {
            let p = new_peer(call.peer);
            if(mystream){
            call.answer(mystream.clone())
            }else{
                call.answer() 
            }
            call.on('stream', (stream) => {onCallStream(p,call, stream)})
            call.on('close', () => {onCallStop(p)})
            call.on('error', (err) => {console.log(err);onCallStop(p)})
            })
 
        myPeer.on('close', () => {
            remove_peer(id);
        })
        myPeer.on('error', (err) => {

            let serr = err.toString();
            if (serr.length > 34) {
                let err_msg = serr.substring(0, 32);
                if (err_msg == "Error: Could not connect to peer") {
                    let err_id = serr.substring(33);
                    // failed_peerid.push(err_id);
                }
            }
            remove_peer(id);
        })
    })
}

const reset_mypeer = () => {
    if (myPeer != null) {
        for (let i = 0; i < peers.length; i++) {
            if (peers[i] && peers[i].connection && peers[i].connection.open) {
                peers[i].connection.close()
            }
            if (peers[i] && peers[i].call && peers[i].call.open) {
                peers[i].call.close()
            }
        }
        peers = [];
        myPeer.destroy();
    }
}

const init_connection = (pid, k) => {
    let cxn = myPeer.connect(pid)
    if (cxn) {
        let p = new_peer(cxn.peer);
        p.keynum = k;
        cxn.on('open', () => {onConnectionOpen(p,cxn)})
        cxn.on('data', (data) => {onConnectionData(p,data)})
        cxn.on('close', () => {onConnectionClose(p)})
    }
}

const init_call = (pid) => {
    console.log("INIT_CALL",pid,mystream)
    let call 
    
    if(mystream){
     call = myPeer.call(pid, mystream);
    }else{
     //call = myPeer.call(pid, createfakestream());
    }

    if (call) {
        let p = new_peer(call.peer);
        call.on('stream', (stream) => {onCallStream(p, call,stream)})
        call.on('close', () => {onCallStop(p)})
        call.on('error', (err) => {console.log(err);onCallStop(p)})
    } 
}



const synchro_fwl_peers = () => {
    let fwl = useSlufeStore().fwl


    for (let i = 0; i < fwl.length; i++) {
        let f = fwl[i];
        var index = peers.map(function (e) { return e.id; }).indexOf(f.d);
        if (index < 0) {
            init_connection(f.d, f.k);
            //init_call(f.d, mystream);
        } else {
            let p = peers[index]
            if (p.connected == false && p.cpt < 20) { p.cpt = p.cpt + 1; init_connection(f.d, f.k); }
            //if (p.called == false && p.cpt < 20) { p.cpt = p.cpt + 1; init_call(f.d, mystream); }
            p.keynum = f.k;
        }

    }
    let todelete = [];

    for (let i = 0; i < peers.length; i++) {
        var index = fwl.map(function (e) { return e.d; }).indexOf(peers[i].id);
        if (index < 0) {
            todelete.push(peers[i].id)
        }
    }

    for (let i = 0; i < todelete.length; i++) {
        remove_peer(todelete[i]);
    }

    useSlufeStore().update_flux();

}



export const useSlufeStore = defineStore('slufe', {

    state: () => ({
        msg: "",
        key: "000000",
        fwl: [],
        site_host: site_host,
        site_title: site_title,
        flux: [],
        messages: [],
        showme: true,
        last_tik: Date.now(),
        env_test: env_test

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
            reset_mypeer();
            axios.get('/new').then(res => {
                this.update_data(res.data);
                init_mypeer();
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
        tik(){
            this.last_tik= Date.now()
        },
        update_flux() {
            //this.flux.splice(0, this.flux.length, ...peers)
            let peerid = "";
            let connected = false;
            if (myPeer) {
                peerid = myPeer.id
                connected = true;
            }
            let tab = peers.map((e) => { return { id: e.id, keynum: e.keynum, stream: e.stream || fakestream, message: e.message, connected: e.connected, me: false, streamid: e.streamid } });
            let mystreamid =''
            console.log(Date.now()-this.last_tik) 
            if(mystream && Date.now()-this.last_tik > 3000 ){
             console.log("!!!",mystream.id)   
                mystreamid=mystream.id

                 mystreammuted = mystreammuted || mystream.clone()
                
                 let audiotracks = mystreammuted.getAudioTracks();
                 if (audiotracks.length > 0) { mystreammuted.removeTrack(audiotracks[0]); }
            }

            tab.push({ id: peerid, keynum: this.key, stream: mystreammuted || fakestream, message: mymessage, connected: connected, me: true, streamid: mystreamid})

            this.flux = tab.sort((a, b) => (a.keynum > b.keynum) ? 1 : -1)


        },
        update_messages(m) {
            this.messages.splice(0, this.messages.length, ...m)
        },
        message(k, m, c) {
            if (m != "") {
                this.messages.push({ keynum: k, msg: m, cat: c })
            }
        },

        send_message(msg) {
            mymessage = msg;
            this.message(this.key, msg, "me");
            for (let i = 0; i < peers.length; i++) {
                if (peers[i].connection && peers[i].connection.open) {
                    peers[i].connection.send({ keynum: this.key, msg: msg })
                }
            }
        },
        stream(s) {
            
           if (mystream) {mystream.getTracks().forEach(track => { track.stop() })}
            if (mystreammuted) {mystreammuted.getTracks().forEach(track => { track.stop() })}
            
            if (s != null) {
                mystream=s
                mystreammuted = null
                
                // let audiotracks = mystreammuted.getAudioTracks();
                // if (audiotracks.length > 0) { mystreammuted.removeTrack(audiotracks[0]); }

                for (let i = 0; i < peers.length; i++) {
                    if (myPeer && peers[i].connection && peers[i].connection.open ){
                        if(peers[i].call){peers[i].call.close()}
                        //init_call(myPeer.call(peers[i].id, s))
                        init_call(peers[i].id);
                    }
                }
            } else {
                mystreammuted = null;
                mystream = null;
                for (let i = 0; i < peers.length; i++) {
                    if (myPeer && peers[i].connection && peers[i].connection.open) {
                        //init_call(myPeer.call(peers[i].id, s))
                        if(peers[i].call){peers[i].call.close()}
                        init_call(peers[i].id);
                    }
                }
            }
           
            
        },
        switchshowme() {
            this.showme = !this.showme;
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
        keylink: (state) => { return "https://"+state.site_host + "/" + state.key },
        getflux: (state) => { return state.flux },
        getmessages: (state) => { return state.messages },
        getnf: (state) => { return state.flux.length },
    }



});