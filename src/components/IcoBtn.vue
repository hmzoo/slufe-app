<script setup>
import disacam from '@/assets/icons/disab-cam.png';
import enacam from '@/assets/icons/enab-cam.png';
import disamic from '@/assets/icons/disab-mic.png';
import enamic from '@/assets/icons/enab-mic.png';

import swap from '@/assets/icons/swap.png';
import settings from '@/assets/icons/settings.png';
import copy from '@/assets/icons/copy.png';
import dice from '@/assets/icons/dice.png';

const props = defineProps({
	ico: String,
    val: Boolean
})



</script>

<template>
    <span class="imgButton bg-disab-cam" >
 <img :src="disacam" v-if="ico == 'cam' && !val" />
 <img :src="enacam" v-if="ico == 'cam' && val" />
  <img :src="disamic" v-if="ico == 'mic' && !val" />
 <img :src="enamic" v-if="ico == 'mic' && val" />
 <img :src="settings" v-if="ico == 'settings' " />
 <img :src="copy" v-if="ico == 'copy' " />
  <img :src="swap" v-if="ico == 'swap' " />
  <img :src="dice" v-if="ico == 'dice' " />
    </span>

</template>

<style>

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
  width: 30px;
  height: 30px;
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