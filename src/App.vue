<script setup>
import { ref , onMounted,watch } from 'vue'



import { useKeyNumStore } from '@/stores/keynum'
import { useMyPeerStore } from '@/stores/mypeer'

const keynum = useKeyNumStore()
const mypeer = useMyPeerStore()

watch( ()=>mypeer.peerid,(data) =>{
  console.log('some changed', data)
  keynum.set(data)
})



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



onMounted(() => {
   keynum.hb();
  window.setInterval(() => {
    keynum.hb(); 
  }, 10000);
});



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
    <i-row>
       <i-column>
       {{ mypeer.peerid}}
       </i-column>  
    </i-row>
    </i-container>
    </i-layout-content>
</i-layout>


</template>
