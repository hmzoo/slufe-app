<script setup>
import { ref , onMounted,watch } from 'vue'
import { storeToRefs } from "pinia";
import Settings from '@/components/Settings.vue';
import Chat from '@/components/Chat.vue';
import Peers from '@/components/Peers.vue';
import Camera from '@/components/Camera.vue';
import IcoBtn from '@/components/IcoBtn.vue';

import { useSlufeStore } from '@/stores/slufe'
import { useMediaStore } from '@/stores/media'

const slufe = useSlufeStore()
const media = useMediaStore()

const { flux,messages } = storeToRefs(slufe);


watch( ()=>media.stream,(data) =>{
  
  slufe.stream(data);
})


const qkey = ref("");


const open = ref(false);

const callNumber= ()=>{
  let s = qkey.value
  qkey.value=s.replace(new RegExp("[^0-9]","g"),"");
  slufe.add(qkey.value)
}



onMounted(() => {
   slufe.init_peer();
   slufe.hb();
   window.addEventListener('beforeunload', ()=>{slufe.reset_peer()});
   window.setInterval(() => {
    slufe.hb(); 
    slufe.synchro(); 
  }, 3000);
});




</script>

<template>

<i-layout>
    <i-layout-header class="_background:dark">
           <i-container color="dark">
    <i-row middle>
        <i-column xs="3" lg="2"><b>{{ slufe.site_title }}</b></i-column>
        <i-column xs="3" lg="1"><b class="_font-size:xl">{{ slufe.key }}</b></i-column>
        <i-column xs="3" lg="1"  class="_text-align:right" >
        <IcoBtn ico="cam" :val="media.camera.beOn" @click="media.switchcam" />
        </i-column>
    
        <i-column xs="3" lg="1" class="_text-align:left" >
        <IcoBtn ico="mic" :val="media.micro.beOn" @click="media.switchmic"/>
        </i-column>
        
        <i-column xs="6" lg="3"><i-form @submit="callNumber"><i-input v-model="qkey" placeholder="Number .." type="Number" size="sm" ><template #append><i-button type="submit" size="sm" color="primary">CALL</i-button></template></i-input></i-form></i-column>
        <i-column xs="4" lg="3"> <small>{{ slufe.msg}}</small></i-column>

    <i-column xs="1" class="_text-align:right"><i-hamburger-menu v-model="open" animation="arrow-right" color="dark" /></i-column>
    </i-row>
    </i-container>
       
    </i-layout-header>
       
<i-layout vertical class="_padding-top:1/2">
    <i-layout-content>
            <i-sidebar v-model="open" size="lg" placement="right" :collapse="true" style="----width:360px;----margin:0px">
          <Settings />
        </i-sidebar>
       <i-container>


    <i-row>
       <i-column xs="12"> 
       <i-table border>
      <tbody>
       <tr v-for="item in slufe.fwl">
       <th>{{item.k}}</th><td>{{item.d}}</td>
       <td><i-button @click="slufe.connect(item.d)" size="sm">CONNECT</i-button></td>
       <td><i-button @click="slufe.call(item.d)" size="sm">CALL</i-button></td>
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
<div style="height:500px"></div>
       </i-column>
    </i-row>
    
        <i-row>
       <i-column xs="12"> <h3>peers</h3>
      <Peers :peers="flux" />
       </i-column>    
    </i-row>

    </i-container>
    </i-layout-content>
    </i-layout>
</i-layout>


</template>
