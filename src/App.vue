<script setup>
import logo from '@/assets/logo.png';
import logo_small from '@/assets/logo_small.png';
import { ref , onMounted,watch ,onBeforeUnmount} from 'vue'
import { storeToRefs } from "pinia";
import Settings from '@/components/Settings.vue';
import Chat from '@/components/Chat.vue';
import Camera from '@/components/Camera.vue';
import IcoBtn from '@/components/IcoBtn.vue';
import Flux from '@/components/Flux.vue';
import TOS from '@/components/TOS.vue';
import Debug from '@/components/Debug.vue';


import { useSlufeStore } from '@/stores/slufe'
import { useMediaStore } from '@/stores/media'

const slufe = useSlufeStore()
const media = useMediaStore()
const { camstatus,micstatus } = storeToRefs(media);
const { getnf } = storeToRefs(slufe);


watch( ()=>media.stream,(data) =>{
  slufe.stream(data);
})
watch( ()=>slufe.key,(data) =>{
  open.value=false
})


const qkey = ref("");
const qmsg = ref("");
const open = ref(false);

const cookieok =ref(false);

const callNumber= ()=>{
  let s = qkey.value
  qkey.value=s.replace(new RegExp("[^0-9]","g"),"");
  slufe.add(qkey.value)
}

const onAccept = ()=>{
  
}

const send =()=>{
  slufe.send_message(qmsg.value);
  qmsg.value="";
}

let preferences = [
  {
    title: 'Cookie settings',
    description:
      slufe.site_title+" won't work without cookies enabled !",
    items: [{ label: 'Clicking SAVE, I Accept all cookies', value: 'all', isRequired: true }],
    
  }
];

onMounted(() => {
 
  cookieok.value=localStorage.getItem('cookie-comply') != null ;
   slufe.init_peer();
   slufe.hb();
   window.addEventListener('beforeunload', ()=>{slufe.reset_peer()});
   window.setInterval(() => {
    slufe.hb(); 
    slufe.synchro(); 
  }, 3000);
});
onBeforeUnmount(() => media.destroy())

const copylink = ()=>{
  navigator.clipboard.writeText(slufe.keylink);
}
const copykey = ()=>{
  navigator.clipboard.writeText(slufe.key);
}

</script>

<template>

<i-layout >
    <i-layout-header class="_background:dark" v-if="getnf >1 ">
           <i-container color="dark">
    <i-row middle>
        <i-column xs="6" lg="3"><img :src="logo_small"  /></i-column>
        <i-column xs="6" lg="2" class="_text-align:left number">{{ slufe.key }}</i-column>
        
        
        <i-column xs="7" lg="3"><i-form @submit="callNumber" ><i-input v-model="qkey" placeholder="Number .." type="Number" size="sm" ><template #append><i-button type="submit" size="sm" color="primary">CALL</i-button></template></i-input></i-form></i-column>
        <i-column xs="3" lg="3"> <small>{{ slufe.msg}}</small></i-column>

    <i-column xs="1" class="_text-align:center"><i-hamburger-menu v-model="open" animation="arrow-right" color="dark" /></i-column>
    </i-row>
    </i-container>
    </i-layout-header>

    <i-layout-header  v-if="getnf <2 ">
        <i-container >
        <i-column xs="4" lg="2"> <img :src="logo"  /></i-column>
        <i-column xs="8" lg="10"></i-column>
    </i-container>
    </i-layout-header>
       
<i-layout vertical class="_padding-top:1/2">
    <i-layout-content>
            <i-sidebar v-model="open" size="lg" placement="right" :collapse="true" style="----width:360px;----margin:0px">
          <Settings />
        </i-sidebar>
       <i-container>


  <i-row middle  v-if="getnf < 2 ">
       <i-column xs="12" lg="6" class="_text-align:center" >
       <div class="number">Your number is </div> <div class="number numbershow" @click="copykey()" >{{ slufe.key }}</div>
       <div><i-form @submit="callNumber" ><i-input v-model="qkey" placeholder="Number .." type="Number" size="lg" ><template #append><i-button type="submit" size="lg" color="primary">CALL</i-button></template></i-input></i-form></div>
       <div><small>{{ slufe.msg}}</small></div>
          </i-column>
          <i-column xs="12" lg="6" >
          <div style="width:304px;height:350px;margin:auto;padding-top:50px"  >
          <Camera />
          <div  ><small>Link to your space :</small><br/><IcoBtn ico="copy" @click="copylink()" /> {{slufe.keylink}}</div>
          <div style="width:304px;margin-top:50px" align="right" ><TOS /></div>
          </div>
          </i-column>
       </i-row>    

<Flux v-if="getnf >1" />
<Chat v-if="getnf >1" />




 

    </i-container>
    </i-layout-content>
</i-layout>
    <i-layout-footer v-if="getnf >1" class="_background:dark _position:fixed-bottom"  >
    <i-container color="dark">
          <i-row center>

             <i-column  xs="12" lg="9" >
             <div class="msg_input"><IcoBtn ico="cam" :val="camstatus" @click="media.switchcam" /></div>
            <div class="msg_input"> <IcoBtn ico="mic" :val="micstatus" @click="media.switchmic"/></div>
          <div class="msg_input" style="width:50%">
    <i-form @submit="send()">
     <i-input v-model="qmsg" placeholder="message .." type="text" size="sm" style=""><template #append><i-button type="submit" size="sm" color="secondary" style="padding:2px">SEND</i-button></template></i-input>
    </i-form> 
    </div> 
          </i-column>
        
    </i-row>
           </i-container>
    </i-layout-footer>
    <vue-cookie-comply
        :preferences="preferences"
        @on-accept-all-cookies="onAccept"
     
      />
    
</i-layout>


</template>

<style>

.number {
  display: inline-block;
    font-family: 'Comic Neue', sans-serif;
    font-size:30px;
    height: 45px;


    -webkit-font-smoothing: antialiased;
}

.numbershow {

    color : #FFFFFF;
    background-color:#992222;
    width: 100px;
    height: 45px;
}

.msg_input {
  display: inline-block;
  margin : 5px 18px 5px 0px;
}

</style>