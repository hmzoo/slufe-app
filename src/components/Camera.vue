<script setup>

import { useSlufeStore } from '@/stores/slufe'

import IcoBtn from '@/components/IcoBtn.vue';

const slufe=useSlufeStore();


</script>

<template>
<i-card color="secondary" >
  <div style="width:270px;display: inline-block;margin-bottom:20px" >
    <IcoBtn ico="cam" :val="slufe.camstatus" @click="slufe.switchcam"/>
    <span style="width:24px;display: inline-block"></span>
    <IcoBtn ico="mic" :val="slufe.micstatus" @click="slufe.switchmic"/>
   
  </div><br/>
  <div style="width:270px;display: inline-block;margin-bottom:5px" v-if="slufe.camOn">
 <span class="labelText"  ><b>CAM : </b>{{ slufe.camlabel}}</span>
 <div style="float:right"><IcoBtn ico="swap"  @click="slufe.swapcam" v-if="slufe.camOn && slufe.camlabel"/></div>
  </div>

  <br/>
    <div v-if="slufe.stream_error.length > 0 || !slufe.camOn">
  <span class="errText vid"  >{{ slufe.stream_error }}</span>
  </div>
  <div v-if="slufe.stream_error.length == 0 && slufe.camOn" >
    <video :srcObject="slufe.stream" style="width:100%"  muted="true" autoplay></video>
  </div>
  <div style="width:270px;display: inline-block;margin-bottom:5px" v-if="slufe.micOn">
 <span class="labelText"  ><b>MIC : </b>{{ slufe.miclabel}}</span>
 <div style="float:right"><IcoBtn ico="swap"  @click="slufe.swapmic" v-if="slufe.micOn && slufe.miclabel"/></div>
  </div>

</i-card>
</template>


<style>

.labelText {
  display: inline-block;
  width: 230px;
  height:20x;
  font-size:11px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding:2px 2px;
  margin: 0px;
  vertical-align: middle;
  color: #DDDDFF;
 
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