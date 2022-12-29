<script setup>
import { ref , onMounted} from 'vue'
import axios from 'axios';
import Peer from 'peerjs';
axios.defaults.withCredentials = true;
import { useKeyNumStore } from '@/stores/keynum'

const keynum = useKeyNumStore()

let myPeer = null;
const cxns =[];
let cxn_cpt =0;
const cxns_infos =ref([]);

const msg = ref("no msg");
const key = ref("");
const fwl = ref([]);

const qkey = ref("");
const qval = ref("");

const update_data =(data)=>{
             msg.value = data.msg || "no msg";
             key.value = data.key || "no key";
             fwl.value = data.fwl || []; 
              refresh_cxns_infos();

}

const refresh_cxns_infos=()=>{
  cxns_infos.value=[]
  for(let i=0;i<cxns.length;i++){
     cxns_infos.value.push({
      peer:cxns[i].peer,
      keynum:getnumfromcxn(cxns[i]),
      open:cxns[i].open,
      cpt:cxns[i].cpt
      })
  }
}

const getnumfromcxn =(cxn) => {
  console.log("CXN PEER",cxn.peer)
  for (let i=0;i<fwl.value.length;i++) {
    if (cxn.peer == fwl.value[i].d){
      return fwl.value[i].k
    }
  }
  return "UNKNOWN"
}

const connect_peer =(id) => {
   if (id) {
            init_cxn(myPeer.connect(id,{label:"CXN"}));
          }
}

const init_cxn = (cxn)=>{
            console.log('connection', cxn)
            
            console.log("PC",cxn.peerConnection);
            cxn_cpt++;
            cxn.cpt = cxn_cpt;
            cxns.push(cxn)
            
            cxn.on('open', () => {
              console.log(cxn.peer,"open");
              cxn.keynum = getnumfromcxn(cxn);
              
              cxn.send("hello")
              refresh_cxns_infos();
            })
            cxn.on('data', (data) => {
              console.log("data",cxn.peer,data);
              refresh_cxns_infos();
            })
            cxn.on('close', () => {
              console.log(cxn.peer,"close");
              refresh_cxns_infos();
            })
             cxn.on('error', (error) => {
              console.log("error",cxn.peer,error);
              refresh_cxns_infos();
            })
}

onMounted(() => {
   keynum.hb();
  window.setInterval(() => {
    keynum.hb(); 
  }, 10000);
});

myPeer = new Peer()
        myPeer.on('open', (id) => {
          keynum.set(id);
        })
        myPeer.on('connection', (cxn) => {
         init_cxn(cxn);
        })

</script>

<template>

<i-layout>
    <i-layout-header class="_text-align:center">
           <i-container>
    <i-row>
        <i-column xs="6"><h2>SLUFE APP</h2></i-column><i-column xs="6"><h2>{{ keynum.key }}</h2></i-column>
    </i-row>
    </i-container>
       
    </i-layout-header>

    <i-layout-content>
       <i-container>
    <i-row>
        <i-column xs="1"><button @click="keynum.hb()">HB</button></i-column><i-column xs="1"><button @click="keynum.renew()">NEW</button></i-column><i-column xs="5">{{ keynum.msg }}</i-column>
  
        <i-column xs="4"><i-input v-model="qval" placeholder="set val .." /></i-column><i-column xs="1"><button @click="keynum.set(qval)">Set val</button></i-column>
    </i-row>
    <i-row>
    <i-column xs="4"><i-input v-model="qkey" placeholder="key .." /></i-column><i-column xs="1"><button @click="keynum.add(qkey)">ADD</button></i-column>
    </i-row>
    <i-row>
       <i-column xs="12">
       {{ keynum.fwl }}
       <i-table>
      <tbody>
       <tr v-for="item in keynum.fwl">
       <th>{{item.k}}</th><td>{{item.d}}</td><td><button @click="connect_peer(item.d,item.k)">CONNECT</button></td>
       </tr>
      </tbody>
       </i-table>
       </i-column>    
    </i-row>
        <i-row v-for="item in cxns_infos" >
        <i-column xs="2">
       {{ item.cpt}}
       </i-column>  
      <i-column xs="2">
       <b>{{ item.keynum}}</b>
       </i-column>  
       <i-column xs="2">
      <small> {{ item.label}} </small>
       </i-column> 
       <i-column xs="4">
       {{ item.peer}}
       </i-column>    
       <i-column xs="2">
       {{ item.open}}
       </i-column>  
    </i-row>
    </i-container>
    </i-layout-content>
</i-layout>


</template>
