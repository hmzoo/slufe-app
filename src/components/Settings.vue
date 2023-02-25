<script setup>
import { ref  } from 'vue'
import Camera from '@/components/Camera.vue';
import IcoBtn from '@/components/IcoBtn.vue';
import { useSlufeStore } from '@/stores/slufe';
import TOS from '@/components/TOS.vue';

const slufe = useSlufeStore();


const copylink = ()=>{
  navigator.clipboard.writeText(slufe.keylink);
}

const reset = ()=>{
  slufe.renew();
}


</script>


<template>
<div style="margin:0;padding:0">
<Camera />
<i-card >
<template #header>Your number is <b>{{ slufe.key}}</b> <br/> </template>
<div><i-toggle v-model="slufe.showme" > Show self view </i-toggle></div><br/>
 <div><IcoBtn ico="dice"  @click="reset()"/> Get a new Number</div>
<div><small>Link to your space :</small><br/><IcoBtn ico="copy" @click="copylink()" /> {{slufe.keylink}}</div>
</i-card>
<br/>
<TOS />

</div>

</template>