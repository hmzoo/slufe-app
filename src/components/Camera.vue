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
  <video :srcObject="media.stream" width="300" height="200" autoplay></video>
  <div v-if="media.stream">
  {{media.stream.id}}
  </div>
  <div>
    <i-button @click="media.switchcam" size="sm">
    <img src="@/assets/icons/enab-cam.png" v-if="media.camera.beOn"/>
    <img src="@/assets/icons/disab-cam.png" v-else  />
    </i-button>
    <i-button @click="media.swapcam" size="sm"><img src="@/assets/icons/swap.png" /></i-button>
    <span>{{ media.camera.label}}</span>
  </div>
  <div>
    <i-button @click="media.switchmic" size="sm">
    <img src="@/assets/icons/enab-mic.png" v-if="media.micro.beOn"  />
    <img src="@/assets/icons/disab-mic.png" v-else />
    </i-button>
    <i-button @click="media.swapmic" size="sm"><img src="@/assets/icons/swap.png" /></i-button>
    <span>{{ media.micro.label}}</span>
  </div>
  {{ media.camera }}<br/>
  {{ media.videoDevices}}<br/>
  {{ media.audioDevices}}
  </div>
  <div>
  {{ media.constrains}}
  </div>
</template>