
import { defineStore } from 'pinia';
import Peer from 'peerjs';


let myPeer = null;
let connections =[];
let calls =[];
let failed_peerid=[];
let mystream = new MediaStream();
let mykeynum = "000000"

const new_peer= (id)=>{
    var index = useMyPeerStore().peers.map(function(e) { return e.id; }).indexOf(id);
    if(index < 0){
        useMyPeerStore().peers.push({id:id,keynum:"000000",stream:new MediaStream(),message:""})
    }
    
}

const remove_peer= (id)=>{
    console.log("rm peer",id)
    remove_connection(id);
    remove_call(id);
    useMyPeerStore().peers = useMyPeerStore().peers.filter(function( obj ) {
        return obj.id !== id;
    });
    
}

const get_my_keynum =()=>{ return mykeynum;}
const set_my_keynum =(k)=>{  mykeynum = k;}

const get_my_stream =()=>{ return mystream;}
const set_my_stream =(s)=>{  mystream = s;}

const peer_exists=(id)=>{
    var index = useMyPeerStore().peers.map(function(e) { return e.id; }).indexOf(id);
    return index !=-1
}
const connection_exists=(id)=>{
    var index = connections.map(function(e) { return e.peer; }).indexOf(id);
    console.log(index,id,connections[index])
    if (connections[index],index !=-1 ){console.log("CXN:",connections[index],connections[index].open)}
    return index !=-1 && connections[index].open
}

const call_exists=(id)=>{
    console.log(calls)
    var index = calls.map(function(e) { return e.peer; }).indexOf(id);
    return index !=-1 && calls[index].active
}

const get_peer_keynum =(id)=>{
    var index = useMyPeerStore().peers.map(function(e) { return e.id; }).indexOf(id);
    if(index < 0){
    return "000000";
    }
    return useMyPeerStore().peers[index].keynum;
}

const set_peer_keynum =(id,keynum)=>{
    var index = useMyPeerStore().peers.map(function(e) { return e.id; }).indexOf(id);
    console.log("setkey",index)
    if(index >= 0){
        if(useMyPeerStore().peers[index].keynum=="000000"){
        new_message(keynum,"connected","info")
        }
        useMyPeerStore().peers[index].keynum=keynum
        
    }
}

const clean_peer = (id,keynum)=>{
    let todelete =[];
   for (let i=0;i< useMyPeerStore().peers.length;i++){
     if (useMyPeerStore().peers[i].keynum == keynum && useMyPeerStore().peers[i].id != id){
           todelete.push(useMyPeerStore().peers[i].id)
     }
   }
   for (let i=0;i<todelete.length;i++){
    remove_peer(todelete[i]);
   }
   

}

const clean_peers = (keynums)=>{
    let todelete =[];
   for (let i=0;i< useMyPeerStore().peers.length;i++){
     if (keynums.indexOf(useMyPeerStore().peers[i].keynum)<0){
           todelete.push(useMyPeerStore().peers[i].id)
     }
   }
   for (let i=0;i<keynums.length;i++){
    remove_peer(todelete[i]);
   }
   

}

const set_peer_stream =(id,stream)=>{
    var index = useMyPeerStore().peers.map(function(e) { return e.id; }).indexOf(id);
    if(index >= 0){
        useMyPeerStore().peers[index].stream=stream
      
    }
}

const set_peer_msg =(id,msg)=>{
    var index = useMyPeerStore().peers.map(function(e) { return e.id; }).indexOf(id);
    if(index >= 0){
        useMyPeerStore().peers[index].message=msg
    }
}

const new_message=(keynum,msg,cat)=>{
    if(keynum !="000000"){
    useMyPeerStore().messages.push({keynum:keynum,msg:msg,cat:cat})
    }
}

const new_connection=(cxn)=>{
    remove_connection(cxn.peer);
    connections.push(cxn);
  }

const remove_connection=(peerid)=>{
    connections = connections.filter(function( obj ) {
        if(obj.peer == peerid){obj.close()}
        return obj.peer !== peerid;
    })
}

const new_call=(call)=>{
    remove_call(call.peer)
    calls.push(call);
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

const send_callme_all=()=>{
    for(let i=0;i<connections.length;i++){
        if(connections[i].open){
            connections[i].send({keynum:mykeynum,ask:"callme"})
        }
    }
}

const call_all=()=>{
    console.log("mystream",mystream)
    for(let i=0;i<connections.length;i++){
        if(connections[i].open){
            peer_call(connections[i].peer)
        }
    }
}

const peer_connect=(id)=>{
    if (id && !failed_peerid.includes(id) && !connection_exists(id) ) {
        
        init_connection(myPeer.connect(id));
      } 
}

const peer_call=(id)=>{
    if (id  && !failed_peerid.includes(id) && !call_exists(id) ) {
        let stream=mystream;
        if(stream ==null){stream=new MediaStream();}
        init_call(myPeer.call(id,stream));
      } 
}
const init_mypeer =()=>{
myPeer = new Peer()
myPeer.on('open', (id) => {
    useMyPeerStore().update_peerid(id);
    failed_peerid.push(id);
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
        console.log(id,err);
        let serr=err.toString();
        if(serr.length>34){
        let err_msg = serr.substring(0,32);
        
        if(err_msg=="Error: Could not connect to peer"){
            let err_id = serr.substring(33);
            failed_peerid.push(err_id);
        }
        }

        new_message(get_peer_keynum(id),"peer error :"+err,"info")
        remove_peer(id); 
       })
})
}




const init_connection = (cxn)=>{
    console.log("INIT_CONNEXION ",cxn.peer);
    new_peer(cxn.peer);
    cxn.on('open', () => {
      new_connection(cxn);
      cxn.send({keynum:mykeynum});
      if(get_peer_keynum(cxn.peer)!="000000"){
        new_message(get_peer_keynum(cxn.peer),"connected","info")
        }
        peer_call(cxn.peer);
      
    })
    cxn.on('data', (data) => {
        console.log("DATA :",data)

      if(data.keynum){
        console.log("OK")
        set_peer_keynum (cxn.peer,data.keynum)
        clean_peer (cxn.peer,data.keynum)
      }
      if(data.msg){
        set_peer_msg (cxn.peer,data.msg)
        new_message(data.keynum,data.msg,"peer")
      }
      if(data.ask && data.ask=="callme"){
        console.log("CALLME");
        peer_call(cxn.peer)
      }
    })
    cxn.on('close', () => {
      new_message(get_peer_keynum(cxn.peer),"connection closed","info")
      remove_connection(cxn.peer)
      
    })
     cxn.on('error', (error) => {
        console.log("ERR",error)
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
            this.peers.splice(0, this.peers.length, ...p)
            console.log("this",this.peers)
           
        },
        update_messages(m){
            this.messages.splice(0, this.messages.length, ...m)
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
            set_my_stream(stream);
            call_all();
        },
        reset(){
            if(myPeer!=null){
            for(let i=0;i<connections.length;i++){
                connections[i].close();
             }
             for(let i=0;i<calls.length;i++){
                 calls[i].close();
              }
              connections=[];
              calls=[];
            this.peers.splice(0,this.peers.length)
            myPeer.destroy();
            }
            init_mypeer();
        }
       
    },
    getters: {
        getPeers: (state) => state.peers
    }



});