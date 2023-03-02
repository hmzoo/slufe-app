<script setup>

import { useSlufeStore } from '@/stores/slufe'

import IcoBtn from '@/components/IcoBtn.vue';

const slufe=useSlufeStore();


</script>

<template>
<i-card color="secondary" >
  <div style="width:270px;display: inline-block" >
    <IcoBtn ico="cam" :val="slufe.camstatus" @click="slufe.switchcam"/>
    <span style="width:24px;display: inline-block"></span>
    <IcoBtn ico="mic" :val="slufe.micstatus" @click="slufe.switchmic"/>
    <div style="float:right"><IcoBtn ico="swap"  @click="slufe.swapcam" v-if="slufe.camOn && slufe.camlabel"/></div>
  </div><br/>
  <div style="width:270px;display: inline-block;margin-bottom:5px" >
 <span class="camText" v-if="slufe.camOn" >{{ slufe.camlabel}}</span>
  </div>
  <br/>
    <div v-if="slufe.stream_error.length > 0 || !slufe.camOn">
  <span class="errText vid"  >{{ slufe.stream_error }}</span>
  </div>
  <div v-if="slufe.stream_error.length == 0 && slufe.camOn" >
    <video :srcObject="slufe.stream" style="width:100%"  muted="true" autoplay></video>
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