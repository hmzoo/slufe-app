<script setup>
import { ref  } from 'vue'
import { storeToRefs } from "pinia";
import { useMyPeerStore } from '@/stores/mypeer'
const mypeer = useMyPeerStore()
const { messages } = storeToRefs(mypeer);
const qmsg = ref("");


</script>

<template>
  <div class="_border">
    <span v-for="msg in messages" class="_display:block"><b>{{ msg.keynum}}:</b> {{ msg.msg}} </span>
     <i-input v-model="qmsg" placeholder="message .." type="text" size="sm"><template #append><i-button @click="mypeer.send_message(qmsg)" size="sm">SEND</i-button></template></i-input>
  </div>
</template>