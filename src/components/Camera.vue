<script setup>
import { ref, onMounted } from 'vue'
import { useMediaStore } from '@/stores/media'

import IcoBtn from '@/components/IcoBtn.vue';

const media=useMediaStore();

const props = defineProps({
	camon: Boolean,
    micon:Boolean
})




onMounted(() => {
  
    media.start();
    })

</script>

<template>
<i-card color="secondary" >


  <div style="width:270px;display: inline-block" >
    <IcoBtn ico="cam" :val="media.camera.beOn" @click="media.switchcam"/>
    <span style="width:24px;display: inline-block"></span>
    <IcoBtn ico="mic" :val="media.micro.beOn" @click="media.switchmic"/>
    <div style="float:right"><IcoBtn ico="swap"  @click="media.swapcam" v-if="media.camera.beOn"/></div>
  </div><br/>
  <div style="width:270px;display: inline-block;margin-bottom:5px" >
 <span class="camText" v-if="media.camera.beOn" >{{ media.camera.label}}</span>
  </div>
  <br/>
    <div v-if="media.error.length > 0 || !media.camera.beOn">
  <span class="errText vid"  >{{ media.error }}</span>
  </div>
  <div v-if="media.error.length == 0 && media.camera.beOn" >
  <video :srcObject="media.stream" width="270" height="200" autoplay class="vid" muted=true ></video>
  </div>

</i-card>
</template>


<style>

.camText {
  display: inline-block;
  width: 205px;
  height:16px;
  font-size:12px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding:2px 4px;
  margin: 0px
}

.errText {
  display: inline-block;
  width: 270px;
  height: 200px;
  font-size:14px;
  padding:10px 6px;
  font-style: italic;
  color:#999999;
  text-align:center;
  white-space: pre-wrap;
  line-height: 1em;
  background:#333333
}


.vid {
    margin: 0 auto;
    display: block;
}

</style>