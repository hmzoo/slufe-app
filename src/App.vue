<script setup>
import { ref , onMounted,watch } from 'vue'



import { useKeyNumStore } from '@/stores/keynum'
import { useMyPeerStore } from '@/stores/mypeer'

const keynum = useKeyNumStore()
const mypeer = useMyPeerStore()

watch( ()=>mypeer.peerid,(data) =>{
  console.log('some changed', data)
  keynum.set(data)
  mypeer.set_keynum(keynum.key)
})



const msg = ref("no msg");
const key = ref("");
const fwl = ref([]);

const qkey = ref("");
const qval = ref("");





onMounted(() => {
   keynum.hb();
  window.setInterval(() => {
    keynum.hb(); 
  }, 10000);
});



</script>

<template>

<i-layout>
    <i-layout-header class="_background:dark">
           <i-container color="dark">
    <i-row middle>
        <i-column xs="2" ><b>SLUFE APP</b></i-column><i-column xs="1"><b>{{ keynum.key }}</b></i-column><i-column xs="1"><i-button @click="keynum.renew()" size="sm" >RENEW KEY</i-button></i-column><i-column xs="3"> <small>{{ mypeer.peerid}}</small><br/><small>{{ keynum.msg}}</small></i-column><i-column xs="2"><i-input v-model="qkey" placeholder="key .." type="text" size="sm"><template #append><i-button @click="keynum.add(qkey)" size="sm">ADD</i-button></template></i-input></i-column>
    </i-row>
    </i-container>
       
    </i-layout-header>

    <i-layout-content>
       <i-container>


    <i-row>
       <i-column xs="12"> 
       <i-table border>
      <tbody>
       <tr v-for="item in keynum.fwl">
       <th>{{item.k}}</th><td>{{item.d}}</td><td><i-button @click="mypeer.connect(item.d)" size="sm">CONNECT</i-button></td>
       </tr>
      </tbody>
       </i-table>
       </i-column>    
    </i-row>
        <i-row>
       <i-column xs="12"> 
       <i-table border>
      <tbody>
       <tr v-for="item in mypeer.connections">
       <th>{{item.keynum}}</th><td>{{item.cxnid}} </td><td>{{item.peerid}}</td>
       </tr>
      </tbody>
       </i-table>
       </i-column>    
    </i-row>

    </i-container>
    </i-layout-content>
</i-layout>


</template>
