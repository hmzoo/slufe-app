
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
    myPeer.on('call', (call) => {
        init_call(call);
        call.answer(useMyPeerStore().mystream)
       })
    myPeer.on('error', (err) => {
        console;log("PEER ERR : ",err);
       })
})






const init_cxn = (cxn)=>{
    console.log('connection', cxn)
    console.log("PC",cxn.peerConnection);
    useMyPeerStore().new_connection(cxn.peer,cxn.connectionId)
    cxn.on('open', () => {
      console.log(cxn.peer,"open");
      cxns.push(cxn)
      cxn.send({keynum:useMyPeerStore().keynum})
    })
    cxn.on('data', (data) => {
      console.log("data",cxn.peer,data);
      if(data.keynum){
        useMyPeerStore().set_cxn_keynum(cxn.connectionId,data.keynum)
      }
      if(data.msg){
        useMyPeerStore().new_message(data.keynum,data.msg,false)
      }
    })
    cxn.on('close', () => {
      console.log(cxn.peer,"close");
    })
     cxn.on('error', (error) => {
      console.log("error",cxn.peer,error);
    })
}

const init_call =(call)=>{
    console.log("CALL",call)
    call.on('stream',(stream =>{
       console.log("S",stream)
    }))
    call.on('close',()=>{})
    call.on('error',(err)=>{})

}



export const useMyPeerStore = defineStore('mypeer',{

    state: () => ({
        keynum: "",
        peerid: "",
        connections: [],
        messages: [],
        mystream: null,
        streams: []
    }),
    actions: {
        connect(id){  
            if (id) {
                init_cxn(myPeer.connect(id));
              } 
        },
        call(id,stream){  
            if (id) {
                let c= myPeer.call(id,stream);
                console.log("C",c,"P",myPeer)
                init_call(c);
              } 
        },
        set_mystream(stream){
            this.mystream=stream
        },
        send_message(msg){
            useMyPeerStore().new_message(this.keynum,msg,true);
            for(let i=0;i<cxns.length;i++){
                if(cxns[i].open){
                    cxns[i].send({keynum:this.keynum,msg:msg})
                }
            }

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
        new_message(keynum,msg,me){
                    this.messages.push({keynum:keynum,msg:msg,me:me})
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