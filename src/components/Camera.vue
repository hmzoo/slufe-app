<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useMediaStore } from '@/stores/media'

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
  <div>
  <video :srcObject="media.stream" width="160" height="100" autoplay></video>

  <div>
    <span class="camButton" @click="media.switchcam" >
    <img src="@/assets/icons/enab-cam.png" v-if="media.camera.beOn"/>
    <img src="@/assets/icons/disab-cam.png" v-else  />
    </span>
    <span class="camText" v-if="media.camera.beOn" >{{ media.camera.label}}</span>
    <span class="camButton" @click="media.swapcam" size="sm" v-if="media.camera.beOn"><img src="@/assets/icons/swap.png" /></span>
  </div>
  <div>
    <span class="camButton" @click="media.switchmic" size="sm">
    <img src="@/assets/icons/enab-mic.png" v-if="media.micro.beOn"  />
    <img src="@/assets/icons/disab-mic.png" v-else />
    </span>
    <span class="camText" v-if="media.micro.beOn" >{{ media.micro.label}}</span>
    <span class="camButton" @click="media.swapmic" size="sm" v-if="media.micro.beOn" ><img src="@/assets/icons/swap.png" /></span>
    
  </div>
  {{ media.camera }}<br/>
  {{ media.videoDevices}}<br/>
  {{ media.audioDevices}}
  </div>
  <div>
  {{ media.constrains}}
  </div>
</template>


<style>

.camText {
  display: inline-block;
  width: 100px;
  font-size:12px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding:2px 4px;
}


.camButton {
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
	padding:2px 4px;
	text-decoration:none;
	text-shadow:0px 1px 0px #ffffff;
}
.camButton:hover {
	background:-webkit-gradient(linear, left top, left bottom, color-stop(0.05, #f6f6f6), color-stop(1, #ffffff));
	background:-moz-linear-gradient(top, #f6f6f6 5%, #ffffff 100%);
	background:-webkit-linear-gradient(top, #f6f6f6 5%, #ffffff 100%);
	background:-o-linear-gradient(top, #f6f6f6 5%, #ffffff 100%);
	background:-ms-linear-gradient(top, #f6f6f6 5%, #ffffff 100%);
	background:linear-gradient(to bottom, #f6f6f6 5%, #ffffff 100%);
	filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#f6f6f6', endColorstr='#ffffff',GradientType=0);
	background-color:#f6f6f6;
}
.camButton:active {
	position:relative;
	top:1px;
}

</style>