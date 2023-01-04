
import { defineStore } from 'pinia';
import Peer from 'peerjs';

let myPeer = null;
const cxns =[];
let cxn_cpt =0;

myPeer = new Peer()
myPeer.on('open', (id) => {
    useMyPeerStore().set_peerid(id);
})



export const useMyPeerStore = defineStore('mypeer',{

    state: () => ({
        peerid: ""
    }),
    actions: {
        set_peerid(id){  
            this.peerid=id;     
        }
    }



});