import Peer from 'peerjs';
let peer =null
const cxns =[];
let cxn_cpt =0;



let mypeer={
   on_open:(id)=>{console.log("peer opened",id)},
   on_close:(id)=>{console.log("peer closed")},
   on_connection:(cxn)=>{console.log("peer connected",cxn)},
   on_disconnected:()=>{console.log("peer disconnected")},
   on_error:(error)=>{console.log("peer error",error)},
}

const init_peer=()=>{
        peer = new Peer()
        peer.on('open', (id) => {
          mypeer.on_open(id);
        })
        myPeer.on('connection', (cxn) => {
         init_cxn(cxn);
          mypeer.on_open(id);
        })
}