
import { defineStore } from 'pinia';
import Peer from 'peerjs';


let myPeer = null;
const cxns =[];
let cxn_cpt =0;

myPeer = new Peer()
myPeer.on('open', (id) => {
    useMyPeerStore().set_peerid(id);
    myPeer.on('connection', (cxn) => {
        init_cxn(cxn);
       })
})

const connect_peer =(id) => {
    if (id) {
             init_cxn(myPeer.connect(id));
           }
 }

const init_cxn = (cxn)=>{
    console.log('connection', cxn)
    console.log("PC",cxn.peerConnection);
    useMyPeerStore().new_connection(cxn.peer,cxn.connectionId)
    cxn.on('open', () => {
      console.log(cxn.peer,"open");
      cxn.send({keynum:useMyPeerStore().keynum})
    })
    cxn.on('data', (data) => {
      console.log("data",cxn.peer,data);
      if(data.keynum){
        useMyPeerStore().set_cxn_keynum(cxn.connectionId,data.keynum)
      }
    })
    cxn.on('close', () => {
      console.log(cxn.peer,"close");
    })
     cxn.on('error', (error) => {
      console.log("error",cxn.peer,error);
    })
}



export const useMyPeerStore = defineStore('mypeer',{

    state: () => ({
        keynum: "",
        peerid: "",
        connections: []
    }),
    actions: {
        connect(id){  
            connect_peer(id); 
        },
        set_keynum(k){  
            this.keynum=k;     
        },
        set_peerid(id){  
            this.peerid=id;     
        },
        new_connection(peerid,cxnid){
            this.connections.push({peerid:peerid,cxnid:cxnid,keynum:"000000"})
        },
        set_cxn_keynum(cxnid,keynum){
        for(let i=0;i<this.connections.length;i++){
            if(this.connections[i].cxnid==cxnid){
                this.connections[i].keynum=keynum;
                break;
            }
        }
        }
    }



});