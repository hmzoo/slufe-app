<script setup>
import { storeToRefs } from "pinia";
import { useSlufeStore } from '@/stores/slufe'

const { getflux } = storeToRefs(useSlufeStore());

</script>

<template>
  <i-row middle>

       <i-column xs="12" lg="6" v-for="item in getflux" :key="item.keynum" >
       <div>
       <div class="smallmsg" ><small><b>{{item.keynum }}</b></small> <span><i>{{ item.message }}</i></span></div>
         <video :srcObject="item.stream"  autoplay></video>
         </div>
       </i-column>
    
       </i-row>
</template>

<style>
.smallmsg {
  border: 1px solid #32a1ce;
  width : 100%
}
</style>