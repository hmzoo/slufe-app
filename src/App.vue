<script setup>
import { ref , onMounted,watch } from 'vue'
import { storeToRefs } from "pinia";
import Settings from '@/components/Settings.vue';
import Chat from '@/components/Chat.vue';
import Peers from '@/components/Peers.vue';
import Camera from '@/components/Camera.vue';
import IcoBtn from '@/components/IcoBtn.vue';




import { useKeyNumStore } from '@/stores/keynum'
import { useMyPeerStore } from '@/stores/mypeer'
import { useMediaStore } from '@/stores/media'

const keynum = useKeyNumStore()
const mypeer = useMyPeerStore()
const media = useMediaStore()

const { peers,messages } = storeToRefs(mypeer);

watch( ()=>mypeer.peerid,(data) =>{
  console.log('some changed', data)
  keynum.set(data)
  mypeer.set_keynum(keynum.key)
})

watch( ()=>media.stream,(data) =>{
  console.log('media', data)
  mypeer.stream(data);
})



const msg = ref("no msg");
const key = ref("");
const fwl = ref([]);

const qkey = ref("");
const qval = ref("");

const qmsg = ref("");

const open = ref(false);

const callNumber= ()=>{
  let s = qkey.value
  qkey.value=s.replace(new RegExp("[^0-9]","g"),"");
  keynum.add(qkey.value)
}

const checkNumber=()=>{
  qkey.value=qkey.value.replace(new RegExp("[^0-9]","g"),"");
  console.log("OK",s,qkey.value)
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
    <i-layout-header class="_background:dark">
           <i-container color="dark">
    <i-row middle>
        <i-column xs="3" lg="2"><b>SLUFE APP</b></i-column>
        <i-column xs="3" lg="1"><b class="_font-size:xl">{{ keynum.key }}</b></i-column>
        <i-column xs="3" lg="1"  class="_text-align:right" >
        <IcoBtn ico="cam" :val="media.camera.beOn" @click="media.switchcam" />
        </i-column>
    
        <i-column xs="3" lg="1" class="_text-align:left" >
        <IcoBtn ico="mic" :val="media.micro.beOn" @click="media.switchmic"/>
        </i-column>
        
        <i-column xs="6" lg="3"><i-form @submit="callNumber"><i-input v-model="qkey" placeholder="Number .." type="Number" size="sm" ><template #append><i-button type="submit" size="sm" color="primary">CALL</i-button></template></i-input></i-form></i-column>
        <i-column xs="4" lg="3"> <small>{{ keynum.msg}}</small></i-column>

    <i-column xs="1" class="_text-align:right"><i-hamburger-menu v-model="open" animation="arrow-right" color="dark" /></i-column>
    </i-row>
    </i-container>
       
    </i-layout-header>
        
 
       
<i-layout vertical class="_padding-top:1/2">
    <i-layout-content>
            <i-sidebar v-model="open" size="lg" placement="right" :collapse="true" style="----width:400px">
          <Settings />
        </i-sidebar>
       <i-container>


    <i-row>
       <i-column xs="12"> 
       <i-table border>
      <tbody>
       <tr v-for="item in keynum.fwl">
       <th>{{item.k}}</th><td>{{item.d}}</td>
       <td><i-button @click="mypeer.connect(item.d)" size="sm">CONNECT</i-button></td>
       <td><i-button @click="mypeer.call(item.d)" size="sm">CALL</i-button></td>
       </tr>
      </tbody>
       </i-table>
       </i-column>    
    </i-row>
       
       <i-row>
       <i-column xs="6">
       <Chat  />
      
       </i-column>    
       <i-column xs="6">
       <Camera />
       </i-column>
    </i-row>
    
        <i-row>
       <i-column xs="12"> <h3>peers</h3>
      <Peers :peers="peers" />
       </i-column>    
    </i-row>

    </i-container>
    </i-layout-content>
    </i-layout>
</i-layout>


</template>
