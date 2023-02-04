<script setup>
import Camera from '@/components/Camera.vue';
import IcoBtn from '@/components/IcoBtn.vue';
import { useKeyNumStore } from '@/stores/keynum';



const keynum = useKeyNumStore();

const copylink = ()=>{
  navigator.clipboard.writeText(keynum.keylink);
}


</script>


<template>
<div style="margin:0;padding:0">
<Camera />
<i-card >
<template #header>Your number is <b>{{ keynum.key}}</b> <br/> </template>
 <div><IcoBtn ico="dice"  @click="keynum.renew()"/> Get a new Number</div>
<div><small>Link to your space :</small><br/><IcoBtn ico="copy" @click="copylink()" /> {{keynum.keylink}}</div>
</i-card>
    

</div>

</template>