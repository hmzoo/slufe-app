<script setup>
import { ref ,onUpdated } from 'vue'
import { storeToRefs } from "pinia";
import { useSlufeStore } from '@/stores/slufe'
const slufe = useSlufeStore()

const qmsg = ref("");


const send =()=>{
  slufe.send_message(qmsg.value);
  qmsg.value="";
}


</script>

<template>
            <i-row center>

             <i-column  xs="12" lg="6" >
          <div class="msg_input">
    <i-form @submit="send()">
     <i-input v-model="qmsg" placeholder="message .." type="text" size="sm" style=""><template #append><i-button type="submit" size="sm" color="secondary" style="padding:2px">SEND</i-button></template></i-input>
    </i-form> 
    </div> 
          </i-column>
        
    </i-row>
</template>

<style>





</style>