<script setup>
import { ref ,onUpdated } from 'vue'
import { storeToRefs } from "pinia";
import { useMyPeerStore } from '@/stores/mypeer'
const mypeer = useMyPeerStore()
const { messages } = storeToRefs(mypeer);
const qmsg = ref("");
const msg_list = ref(null);
const msg_list_lock = ref(false);

const send =()=>{
  mypeer.send_message(qmsg.value);
  qmsg.value="";
}

onUpdated(() => {
if(msg_list.value && !msg_list_lock.value) {
  let h=msg_list.value.scrollHeight;
  msg_list.value.scrollTop=h;
}

});


</script>

<template>
  <div class="msg_box">
    <div  class="msg_list" ref="msg_list" @focus="msg_list_lock = true" @blur="msg_list_lock = true" >
    <span v-for="msg in messages" class="msg"><small><b>{{ msg.keynum}}:</b></small> {{ msg.msg}} </span>
    </div>
    <div class="msg_input">
    <i-form @submit="send()">
     <i-input v-model="qmsg" placeholder="message .." type="text" size="sm" style="padding:2px"><template #append><i-button type="submit" size="sm" color="secondary" style="padding:2px">SEND</i-button></template></i-input>
    </i-form> 
    </div> 
  </div>
</template>

<style>
.msg_box {

}
.msg_list {
  border: 1px solid #32a1ce;
  min-height: 50px;
  height:100px;
  overflow-y: scroll

}
.msg_input {

 
}

.msg {
  display:block;
  font-family:monospace;
  font-size: 0.9em;
  line-height: 1em;
}

.msg_message {

}

</style>