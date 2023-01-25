
import { defineStore } from 'pinia';
import Peer from 'peerjs';


let myPeer = null;


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
    useMyPeerStore().new_connection(cxn)
    cxn.on('open', () => {
      console.log(cxn.peer,"open");  
      cxn.send({keynum:useMyPeerStore().keynum})
    })
    cxn.on('data', (data) => {
      console.log("data",cxn.peer,data);
      if(data.keynum){
        useMyPeerStore().set_peer_keynum(cxn.peer,data.keynum)
      }
      if(data.msg){
        useMyPeerStore().new_message(data.keynum,data.msg,"you")
      }
    })
    cxn.on('close', () => {
      useMyPeerStore().del_connection(cxn,"connection closed")
    })
     cxn.on('error', (error) => {
      useMyPeerStore().del_connection(cxn,"connection error :"+error)
    })
}

const init_call =(call)=>{
    console.log("CALL",call)
    call.on('stream',(stream =>{
        useMyPeerStore().set_call_stream(call,stream)
    }))
    call.on('close',()=>{
        useMyPeerStore().del_call(call,"call closed")
    })
    call.on('error',(err)=>{
        useMyPeerStore().del_call(call,"call error :"+err)
    })

}



export const useMyPeerStore = defineStore('mypeer',{

    state: () => ({
        keynum: "",
        peerid: "",
        connections: [],
        messages: [],
        mystream: null,
        calls: []
    }),
    actions: {
        connect(id){  
            if (id) {
                init_cxn(myPeer.connect(id));
              } 
        },
        call(id){  
            if (id) {
                init_call(myPeer.call(id,this.mystream));
              } 
        },
        set_mystream(stream){
            this.mystream=stream
        },
        set_keynum(k){  
            this.keynum=k;     
        },
        set_peerid(id){  
            this.peerid=id;     
        },
        set_peer_keynum(peerid,keynum){
            for(let i=0;i<this.connections.length;i++){
                if(this.connections[i].peerid==peerid){
                    this.connections[i].keynum=keynum;
                }
            }
        },
        new_connection(cxn){
            this.connections.push({cxn:cxn,peerid:cxn.peer,cxnid:cxn.connectionId,keynum:"000000"})
        },
        del_connection(cxn,msg){
            var index = this.connections.map(function(e) { return e.peerid; }).indexOf(cxn.peer);
            if(index >= 0){
            useMyPeerStore().new_message(this.connections[index].keynum,msg,"info");
            }
            this.connections = this.connections.filter(function( obj ) {
                return obj.cxnid !== cxn.connectionId;
            });
        },
        new_message(keynum,msg,cat){
                    this.messages.push({keynum:keynum,msg:msg,cat:cat})
        },
        send_message(msg){
            useMyPeerStore().new_message(this.keynum,msg,"me");
            for(let i=0;i<this.connections.length;i++){
                if(this.connections[i].cxn && this.connections[i].cxn.open){
                    this.connections[i].cxn.send({keynum:this.keynum,msg:msg})
                }
            }
        },
        new_call(call){
            this.calls.push({call:call,peerid:call.peer,stream:null,keynum:"000000"})
        },
        del_call(call,msg){
            var index = this.calls.map(function(e) { return e.peerid; }).indexOf(call.peer);
            if(index >= 0){
            useMyPeerStore().new_message(this.calls[index].keynum,msg,"info");
            }
            this.calls = this.calls.filter(function( obj ) {
                return obj.call !== call;
            });
        },
        set_call_stream(call,stream){
            for(let i=0;i<this.calls.length;i++){
                if(this.calls[i].call == call){
                    this.calls[i].stream=stream
                }
            }
        }
    }



});