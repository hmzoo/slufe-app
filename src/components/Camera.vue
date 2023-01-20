<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useMediaStore } from '@/stores/media'

const media=useMediaStore();

const props = defineProps({
	camon: Boolean,
    micon:Boolean
})
const camon=ref(false)
const micon=ref(false)

const stream = ref(null)
const constraints = {
  audio: false,
  video: {
    width: { min: 1024, ideal: 1280, max: 1920 },
    height: { min: 576, ideal: 720, max: 1080 },
    facingMode: 'environment',
  },
}

const stop = () => {
  stream.value.getTracks().forEach(track => {
    console.log('stopping', track)
    track.stop()
  })
  stream.value = null
}

const play = () => {
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then(s => {
            console.log('streaming', s)
          stream.value = s;
        })
        .catch(error => {
          alert(error, "May the browser didn't support or there is some errors.")
        })
}

const toggleCam=()=>{
   camon.value=!camon.value;
   console.log(camon.value)
}

onMounted(() => {
    media.getDevices();
    play()
    })
onBeforeUnmount(() => stop())
</script>

<template>
  <div>
  <video :srcObject="stream" width="300" height="200" autoplay></video>
  <div>
    <button v-if="stream" @click="stop"><img src="@/assets/icons/disab-cam.svg" /></button>
    <button v-else @click="play"><img src="@/assets/icons/enab-cam.svg" /></button>
  </div>
  {{ media.audioDevices }}
  </div>
</template>