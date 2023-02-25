<script setup>
import { ref,watch} from 'vue'
import { storeToRefs } from "pinia";
import { useSlufeStore } from '@/stores/slufe'
const slufe = useSlufeStore()
const { getmessages } = storeToRefs(slufe);

const msg_list = ref(null);
const msg_list_lock = ref(false);

watch( getmessages.value,(data)=>{
  
  if(msg_list.value && !msg_list_lock.value) {
   let h=msg_list.value.scrollHeight;
  msg_list.value.scrollTop=h;
  }
})


// onUpdated(() => {
//   console.log("updated",msg_list.value)
// if(msg_list.value && !msg_list_lock.value) {
//   let h=msg_list.value.scrollHeight;
//   msg_list.value.scrollTop=h;
// }

// });


</script>

<template>
            <i-row center>



       <i-column  xs="12" lg="6">
  <div class="msg_box _text-align:left" >
    <div  class="msg_list" ref="msg_list" @focus="msg_list_lock = true" @blur="msg_list_lock = false" >
    <span v-for="msg in getmessages" :class="'msg '+msg.cat"><small><b>{{ msg.keynum}}:</b></small> {{ msg.msg}} </span>
    <br/>
    </div>
   
  </div>
         </i-column>
        
    </i-row>
</template>

<style>
.msg_box {
 
  height:145px;
}
.msg_list {
   background-color:#ffffff;
  border: 1px solid #32a1ce;
  min-height: 50px;
  height:100px;
  overflow-y: scroll
}


.msg {
  display:block;
  font-family:'Comic Neue', sans-serif;
  font-size: 0.9em;
  line-height: 1em;
}

.me {
  color:#3b4a9e;
}

.peer {
  color:#721034;
}

.info {
  color:#333333;
}



</style>