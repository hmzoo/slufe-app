<script setup>
import Camera from '@/components/Camera.vue';
import IcoBtn from '@/components/IcoBtn.vue';
import { useKeyNumStore } from '@/stores/keynum';
import { useMyPeerStore } from '@/stores/mypeer'



const keynum = useKeyNumStore();
const mypeer = useMyPeerStore()

const copylink = ()=>{
  navigator.clipboard.writeText(keynum.keylink);
}

const reset = ()=>{
  mypeer.reset();
  keynum.renew();
}


</script>


<template>
<div style="margin:0;padding:0">
<Camera />
<i-card >
<template #header>Your number is <b>{{ keynum.key}}</b> <br/> </template>
 <div><IcoBtn ico="dice"  @click="reset()"/> Get a new Number</div>
<div><small>Link to your space :</small><br/><IcoBtn ico="copy" @click="copylink()" /> {{keynum.keylink}}</div>
</i-card>
    

</div>

</template>