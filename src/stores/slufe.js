import { defineStore } from 'pinia';
import Peer from 'peerjs';
import axios from 'axios';
axios.defaults.withCredentials = true;

const site_url = "https://slufe.com"
const site_title = "SLUFE"


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
    const stream = canvas.captureStream();
    const vtrack = stream.getVideoTracks()[0];
    const videoTrack = Object.assign(vtrack, { enabled: true });
    return new MediaStream([videoTrack]);
}


let mystream = createfakestream();

const new_peer = (id) => {
    var index = peers.map(function (e) { return e.id; }).indexOf(id);
    if (index < 0) {
        let keynum = "000000"
        let fwl = useSlufeStore().fwl
        let ifwl = fwl.map(function (e) { return e.d; }).indexOf(id);
        if (ifwl >= 0) { keynum = fwl[ifwl].k }
        index = peers.push({ id: id, keynum: keynum, stream: createfakestream(), message: "", connection: null, call: null, connected: false, called: false, streamid: "" }) - 1;
    }
    return peers[index];
}

const remove_peer = (id) => {
    var index = peers.map(function (e) { return e.id; }).indexOf(id);
    if (index >= 0) {
        if (peers[index].connection && peers[index].connection.open) {
            peers[index].connection.close();

        }
        peers = peers.filter(function (obj) {
            return obj.id !== id;
        });
    }
}


const new_connection = (cxn) => {
    var index = peers.map(function (e) { return e.id; }).indexOf(cxn.peer);
    if (peers[index].connection && peers[index].connection.open) {
        peers[index].connection.close()
    }
    peers[index].connection = cxn
    peers[index].connected = true
    useSlufeStore().message(peers[index].keynum, "connected", "info")

}


const new_call = (call, stream) => {

    if (call) {
        var index = peers.map(function (e) { return e.id; }).indexOf(call.peer);

        peers[index].call = call
        if (stream) {
            peers[index].stream = stream
            peers[index].streamid = stream.id
        }

    }


}





const init_mypeer = () => {
    myPeer = new Peer()
    myPeer.on('open', (id) => {
        useSlufeStore().set(id);
        failed_peerid.push(id);
        myPeer.on('connection', (cxn) => {
            let p = new_peer(cxn.peer);
            cxn.on('open', () => {
                p.connection = cxn
                p.connected = true
                cxn.send({ keynum: useSlufeStore().key });
                useSlufeStore().message(p.keynum, "connected", "info")
            })
            cxn.on('data', (data) => {
                if (data.keynum) { p.keynum = data.keynum }
                if (data.msg) {
                    p.message = data.msg
                    useSlufeStore().message(p.keynum, data.msg, "peer")
                }
                if (data.ask && data.ask == "callme" && mystream) {
                    init_call(cxn.peer, mystream);
                }
            })
            cxn.on('close', () => {
                p.connected = false
                useSlufeStore().message(p.keynum, "connection closed", "info")
                

            })
            cxn.on('error', (error) => {
                p.connected = false
                useSlufeStore().message(p.keynum, "connection closed", "info")
            })
        })
        myPeer.on('call', (call) => {
            console.log("myPeer.on('call'")
            let p = new_peer(call.peer);
            call.answer(mystream)
            call.on('stream', (stream => {
                p.call = call
                if (stream) {
                    p.stream = stream
                    p.streamid = stream.id
                }
            }))
            call.on('close', () => {
                p.called = false;
                p.stream = null;
                p.streamid = ""
            })
            call.on('error', (err) => {
                p.called = false;
                p.stream = null;
                p.streamid = ""

            })
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

const init_connection = (pid,k) => {
    let cxn = myPeer.connect(pid)
    if (cxn) {
        let p = new_peer(cxn.peer);
        p.keynum=k;
        cxn.on('open', () => {
            new_connection(cxn);
            cxn.send({ keynum: useSlufeStore().key });
        })
        cxn.on('data', (data) => {
            if (data.keynum) { p.keynum = data.keynum }
            if (data.msg) {
                p.message = data.msg
                useSlufeStore().message(p.keynum, data.msg, "peer")
            }
            if (data.ask && data.ask == "callme" && mystream) {
                init_call(cxn.peer, mystream);
            }
        })
        cxn.on('close', () => {
            p.connected = false
            useSlufeStore().message(p.keynum, "connection closed", "info")
           

        })
        cxn.on('error', (error) => {
            p.connected = false
            useSlufeStore().message(p.keynum, "connection closed", "info")
            
        })
    }
}

const init_call = (pid, s) => {

    let call = myPeer.call(pid, s);
    
    if (call) {
        let p = new_peer(call.peer);
        call.on('stream', (stream => {
            p.call = call
            if (stream) {
                p.stream = stream
                p.streamid = stream.id
            }
        }))
        call.on('close', () => {
            p.call = null;
            if (s) {
                s.getTracks().forEach(track => { track.stop() })
                s = null;
            }

        })
        call.on('error', (err) => {
            p.call = null;
            if (s) {
                s.getTracks().forEach(track => { track.stop() })
                s = null;
            }

        })
    } else {
        console.log(p, p.connecion, "callme")
        if (p.connection) { p.connection.send({ ask: "callme" }) }
    }
}



const synchro_fwl_peers = () => {
    let fwl = useSlufeStore().fwl
    let todelete = [];

    for (let i = 0; i < fwl.length; i++) {
        let f = fwl[i];
        var index = peers.map(function (e) { return e.id; }).indexOf(f.d);
        if (index < 0) {
            init_connection(f.d,f.k);
            init_call(f.d, mystream)
        } else {
            // SET PEER KEYNUM
            if (peers[index].call == null) {
                //  init_call(myPeer.call(f.d, mystream))
            }
            peers[index].keynum = f.k
        }
    }

    for (let i = 0; i < peers.length; i++) {
        var index = fwl.map(function (e) { return e.d; }).indexOf(peers[i].id);
        if (index < 0) {
            // REMOVE OLD PEER 
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
        site_url: site_url,
        site_title: site_title,
        flux: [],
        messages: [],
        showme: true

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
        update_flux() {
            //this.flux.splice(0, this.flux.length, ...peers)
            let peerid = ""
            let connected = false;
            if (myPeer) {
                peerid = myPeer.id
                connected = true;
            }
            let tab = peers.map((e) => { return { id: e.id, keynum: e.keynum, stream: e.stream, message: e.message, connected: e.connected, me: false, streamid: e.streamid } });
            tab.push({ id: peerid, keynum: this.key, stream: mystream, message: mymessage, connected: connected, me: true, streamid: mystream.id })

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
            if (s != null) {

                mystream = s.clone()
                let audiotracks = mystream.getAudioTracks();
                if (audiotracks.length > 0) { mystream.removeTrack(audiotracks[0]); }



                for (let i = 0; i < peers.length; i++) {
                    if (myPeer && peers[i].connection && peers[i].connection.open) {
                        //init_call(myPeer.call(peers[i].id, s))
                        init_call(peers[i].id, s.clone());
                    }
                }
            } else {
                mystream = createfakestream();
                for (let i = 0; i < peers.length; i++) {
                    if (myPeer && peers[i].connection && peers[i].connection.open) {
                        //init_call(myPeer.call(peers[i].id, s))
                        init_call(peers[i].id, createfakestream());
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
        keylink: (state) => { return state.site_url + "/" + state.key },
        getflux: (state) => { return state.flux },
        getmessages: (state) => { return state.messages },
        getnf: (state) => { return state.flux.length },
    }



});