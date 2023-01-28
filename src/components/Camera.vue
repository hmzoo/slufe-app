<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
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
onBeforeUnmount(() => media.stop())
</script>

<template>
<i-card >

  <div v-if="media.error.length > 0 || !media.camera.beOn">
  <span class="errText"  >{{ media.error }}</span>
  </div>
  <div v-if="media.error.length == 0 && media.camera.beOn" >
  <video :srcObject="media.stream" width="320" height="200" autoplay  ></video>
  </div>


  <template #footer>
  <div>
    <IcoBtn ico="cam" :val="media.camera.beOn" @click="media.switchcam"/>
    <span class="camText" v-if="media.camera.beOn" >{{ media.camera.label}}</span>
    <IcoBtn ico="swap"  @click="media.swapcam" v-if="media.camera.beOn"/>
  </div>
  <div>
   <IcoBtn ico="mic" :val="media.micro.beOn" @click="media.switchmic"/>
    <span class="camText" v-if="media.micro.beOn" >{{ media.micro.label}}</span>
    <IcoBtn ico="swap"  @click="media.swapmic" v-if="media.micro.beOn"/>
  </div>
  </template>
</i-card>
</template>


<style>

.camText {
  display: inline-block;
  width: 244px;
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
  width: 320px;
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


.imgButton {
	-moz-box-shadow:inset 0px 1px 0px 0px #ffffff;
	-webkit-box-shadow:inset 0px 1px 0px 0px #ffffff;
	box-shadow:inset 0px 1px 0px 0px #ffffff;
	background:-webkit-gradient(linear, left top, left bottom, color-stop(0.05, #ffffff), color-stop(1, #f6f6f6));
	background:-moz-linear-gradient(top, #ffffff 5%, #f6f6f6 100%);
	background:-webkit-linear-gradient(top, #ffffff 5%, #f6f6f6 100%);
	background:-o-linear-gradient(top, #ffffff 5%, #f6f6f6 100%);
	background:-ms-linear-gradient(top, #ffffff 5%, #f6f6f6 100%);
	background:linear-gradient(to bottom, #ffffff 5%, #f6f6f6 100%);
	filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#ffffff', endColorstr='#f6f6f6',GradientType=0);
	background-color:#ffffff;
	-webkit-border-radius:6px;
	-moz-border-radius:6px;
	border-radius:6px;
	border:1px solid #dcdcdc;
	display:inline-block;
	cursor:pointer;
	color:#666666;
	font-family:Arial;
	font-size:15px;
	font-weight:bold;
	padding:2px 2px;
	text-decoration:none;
	text-shadow:0px 1px 0px #ffffff;
  width: 30px
}
.imgButton:hover {
	background:-webkit-gradient(linear, left top, left bottom, color-stop(0.05, #f6f6f6), color-stop(1, #ffffff));
	background:-moz-linear-gradient(top, #f6f6f6 5%, #ffffff 100%);
	background:-webkit-linear-gradient(top, #f6f6f6 5%, #ffffff 100%);
	background:-o-linear-gradient(top, #f6f6f6 5%, #ffffff 100%);
	background:-ms-linear-gradient(top, #f6f6f6 5%, #ffffff 100%);
	background:linear-gradient(to bottom, #f6f6f6 5%, #ffffff 100%);
	filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#f6f6f6', endColorstr='#ffffff',GradientType=0);
	background-color:#f6f6f6;
}
.imgButton:active {
	position:relative;
	top:1px;
}

</style>