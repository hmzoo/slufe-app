<script setup>
import { ref , onMounted} from 'vue'
import axios from 'axios';
import Peer from 'peerjs';

axios.defaults.withCredentials = true;

let myPeer = null;

const cxns =ref([]);

const msg = ref("no msg");
const key = ref("");
const fwl = ref([]);

const qkey = ref("");
const qval = ref("");

const update_data =(data)=>{
             msg.value = data.msg || "no msg";
              key.value = data.key || "no key";
              fwl.value = data.fwl || []; 
              
}

const connect_peer =(id,keynum) => {
   if (id) {
            init_cxn(myPeer.connect(id,{label:keynum}),keynum);
          }
}

const init_cxn = (cxn,keynum="ME")=>{
            console.log('connection', cxn)
            cxn.keynum = keynum;
            console.log("PC",cxn.peerConnection)
            cxns.value.push(cxn)
            cxn.ready = ()=>{ return cxn.peerConnection && (cxn.peerConnection.connectionState == "connected")}
            cxn.on('open', () => {
              console.log(cxn.peer,"open");
              cxn.send("hello")
            })
            cxn.on('data', (data) => {
              console.log("data",cxn.peer,data);
            })
            cxn.on('close', () => {
              console.log(cxn.peer,"close");
            })
             cxn.on('error', (error) => {
              console.log("error",cxn.peer,error);
            })
}

const req_hb =()=> {
           axios.get('./hb').then(res => {
            update_data(res.data);
           })       
        }

const req_new =()=> {
           axios.get('./new').then(res => {
            update_data(res.data);
           })       
        }

const req_set =()=> {
           axios.get('./set',{params: { val: qval.value}}).then(res => {
            update_data(res.data);
           })       
        }

const req_add =()=> {
           axios.get('./add',{params: { key: qkey.value}}).then(res => {
            update_data(res.data);
           })       
        }

onMounted(() => {
   req_hb();
  window.setInterval(() => {
    req_hb(); 
  }, 10000);
});

myPeer = new Peer()
        myPeer.on('open', (id) => {
          console.log('Connected at PeerJS server with success')
          console.log('this.myPeer.id: ' + myPeer.id + ' this.myPeer.key: ' + myPeer.key)
          console.log('My peer ID is: ' + id);
          qval.value=id;
          req_set();
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
        <i-column xs="6"><h2>SLUFE APP</h2></i-column><i-column xs="6"><h2>{{ key }}</h2></i-column>
    </i-row>
    </i-container>
       
    </i-layout-header>

    <i-layout-content>
       <i-container>
    <i-row>
        <i-column xs="1"><button @click="req_hb">HB</button></i-column><i-column xs="1"><button @click="req_new">NEW</button></i-column><i-column xs="5">{{ msg }}</i-column>
  
        <i-column xs="4"><i-input v-model="qval" placeholder="set val .." /></i-column><i-column xs="1"><button @click="req_set">Set val</button></i-column>
    </i-row>
    <i-row>
    <i-column xs="4"><i-input v-model="qkey" placeholder="key .." /></i-column><i-column xs="1"><button @click="req_add">ADD</button></i-column>
    </i-row>
    <i-row>
       <i-column xs="12">
       {{ fwl }}
       <i-table>
      <tbody>
       <tr v-for="item in fwl">
       <th>{{item.k}}</th><td>{{item.d}}</td><td><button @click="connect_peer(item.d,item.k)">CONNECT</button></td>
       </tr>
      </tbody>
       </i-table>
       </i-column>    
    </i-row>
        <i-row v-for="item in cxns" >
      <i-column xs="2">
       {{ item.keynum}}
       </i-column>  
       <i-column xs="2">
       {{ item.label}}
       </i-column> 
       <i-column xs="4">
       {{ item.peer}}
       </i-column>    
       <i-column xs="4">
       {{ item.ready()}}
       </i-column>  
    </i-row>
    </i-container>
    </i-layout-content>
</i-layout>


</template>
