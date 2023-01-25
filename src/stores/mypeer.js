
import { defineStore } from 'pinia';
import Peer from 'peerjs';


let myPeer = null;
let peers =[];
let connections =[];
let calls =[];
let messages =[];
let mystream = new MediaStream();
let mykeynum = "000000"

const new_peer= (id)=>{
    var index = peers.map(function(e) { return e.id; }).indexOf(id);
    if(index < 0){
    peers.push({id:id,keynum:"000000",stream:new MediaStream(),message:""})
    }
    useMyPeerStore().update_peers(peers);
}

const remove_peer= (id)=>{
    remove_connection(id);
    remove_call(id);
    peers = peers.filter(function( obj ) {
        return obj.id !== id;
    });
    useMyPeerStore().update_peers(peers);
}

const get_my_keynum =()=>{ return mykeynum;}
const set_my_keynum =(k)=>{  mykeynum = k;}

const get_my_stream =()=>{ return mystream;}
const set_my_stream =(s)=>{  mystream = s;}

const peer_exists=(id)=>{
    var index = peers.map(function(e) { return e.id; }).indexOf(id);
    return index !=-1
}
const connection_exists=(id)=>{
    var index = connections.map(function(e) { return e.id; }).indexOf(id);
    return index !=-1 && connections[index].open
}

const call_exists=(id)=>{
    var index = calls.map(function(e) { return e.id; }).indexOf(id);
    return index !=-1 && calls[index].open
}

const get_peer_keynum =(id)=>{
    var index = peers.map(function(e) { return e.id; }).indexOf(id);
    if(index < 0){
    return "000000";
    }
    return peers[index].keynum;
}

const set_peer_keynum =(id,keynum)=>{
    var index = peers.map(function(e) { return e.id; }).indexOf(id);
    if(index >= 0){
      peers[index].keynum=keynum
      useMyPeerStore().update_peers(peers);
    }
}

const set_peer_stream =(id,stream)=>{
    var index = peers.map(function(e) { return e.id; }).indexOf(id);
    if(index >= 0){
      peers[index].stream=stream
      useMyPeerStore().update_peers(peers);
    }
}

const set_peer_msg =(id,msg)=>{
    var index = peers.map(function(e) { return e.id; }).indexOf(id);
    if(index >= 0){
      peers[index].message=msg
      useMyPeerStore().update_peers(peers);
    }
}

const new_message=(keynum,msg,cat)=>{
  messages.push({keynum:keynum,msg:msg,cat:cat})
  useMyPeerStore().update_messages(messages);
  console.log(messages);
}

const new_connection=(cxn)=>{
    remove_connection(cxn.peer);
    connections.push(cxn);
  }

const remove_connection=(peerid)=>{
    connections = connections.filter(function( obj ) {
        if(pbj.peer == peerid){obj.close()}
        return obj.peer !== peerid;
    })
}

const new_call=(call)=>{
    remove_call(call.peer)
    connections.push(call);
  }

const remove_call=(peerid)=>{
    calls = calls.filter(function( obj ) {
        if(obj.peer == peerid){obj.close()}
        return obj.peer !== peerid;
    })
}

const send_message_all=(msg)=>{
    new_message(mykeynum,msg,"me")
    for(let i=0;i<connections.length;i++){
        if(connections[i].open){
            connections[i].send({keynum:mykeynum,msg:msg})
        }
    }
}

const peer_connect=(id)=>{
    if (id && !connection_exists(id)) {
        init_connection(myPeer.connect(id));
      } 
}

const peer_call=(id)=>{
    if (id && !call_exists(id)) {
        init_call(myPeer.call(id,mystream));
      } 
}

myPeer = new Peer()
myPeer.on('open', (id) => {
    useMyPeerStore().update_peerid(id);
    myPeer.on('connection', (cxn) => {
        init_connection(cxn);
       })
    myPeer.on('call', (call) => {
        init_call(call);
        call.answer(mystream)
       })
    myPeer.on('close', () => {
        new_message(get_peer_keynum(id),"peer closed","info")
        remove_peer(id);   
       })
    myPeer.on('error', (err) => {
        new_message(get_peer_keynum(cxn.peer),"peer error :"+err,"info")
        remove_peer(id); 
       })
})




const init_connection = (cxn)=>{
    console.log("INIT_CONNEXION ",cxn.peer);
    new_peer(cxn.peer);
    cxn.on('open', () => {
      new_connection(cxn);
      cxn.send({keynum:mykeynum})
    })
    cxn.on('data', (data) => {
        console.log("DATA :",data)

      if(data.keynum){
        set_peer_keynum (cxn.peer,data.keynum)
      }
      if(data.msg){
        set_peer_msg (cxn.peer,data.msg)
        new_message(data.keynum,data.msg,"peer")
      }
    })
    cxn.on('close', () => {
      new_message(get_peer_keynum(cxn.peer),"connection closed","info")
      remove_connection(cxn.peer)
      
    })
     cxn.on('error', (error) => {
        new_message(get_peer_keynum(cxn.peer),"connection error :"+error,"info")
        remove_connection(cxn.peer)
    })
}

const init_call =(call)=>{
    console.log("INIT_CALL ",call.peer);
    new_peer(call.peer);

    call.on('stream',(stream =>{
        new_call(call);
        set_peer_stream (call.peer,stream)
        
    }))
    call.on('close',()=>{
        new_message(get_peer_keynum(call.peer),"connection closed","info")
        remove_call(call.peer)
    })
    call.on('error',(err)=>{
        new_message(get_peer_keynum(call.peer),"call error :"+err,"info")
        remove_call(call.peer)
    })

}



export const useMyPeerStore = defineStore('mypeer',{

    state: () => ({
        peerid: "",
        peers : [],
        messages: []
    }),
    actions: {
        connect(id){  
            if (id) {
                peer_connect(id);
              } 
        },
        call(id){  
            if (id) {
                peer_call(id);
              } 
        },
        update_peers(p){
           this.peers=peers
        },
        update_messages(m){
            this.messages=m
            console.log("m",this.messages)
         },
        update_peerid(id){  
            this.peerid=id;     
        },
        set_keynum(k){  
            set_my_keynum(k);     
        },
        send_message(msg){
            send_message_all(msg);
        },
        stream(stream){
            set_my_stream(stream)
        }
       
    }



});