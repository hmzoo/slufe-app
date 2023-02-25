<script setup>
import { storeToRefs } from "pinia";
import { useSlufeStore } from '@/stores/slufe'

const { getflux ,getnf,showme} = storeToRefs(useSlufeStore());

</script>

<template>
  <i-row middle v-if="showme">

       <i-column xs="12" lg="6" v-for="item in getflux" :key="item.keynum" >
       <div style="width:100%"  >
       <div class="smallmsg" ><small><b>{{item.keynum }}</b></small> <span><i>{{ item.message }}</i></span></div>
         <video :srcObject="item.stream"  autoplay style="width:100%" :muted="item.me"></video>
         </div>
       </i-column>
    
       </i-row>

         <i-row middle v-if="!showme && getnf == 2 ">

       <i-column xs="12" lg="12" v-for="item in getflux" :key="item.keynum" >
       <div style="width:100%" v-if="!item.me " >
       <div class="smallmsg" ><small><b>{{item.keynum }}</b></small> <span><i>{{ item.message }}</i></span></div>
         <video :srcObject="item.stream"  autoplay style="width:100%" :muted="item.me"></video>
         </div>
       </i-column>
    
       </i-row>
</template>

<style>
.smallmsg {
  font-family: 'Comic Neue', sans-serif;
  color : #FFFFFF;
  border: 1px solid #32a1ce;
  width : 100%
}
</style>