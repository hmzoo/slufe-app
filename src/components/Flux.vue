<script setup>
import { storeToRefs } from "pinia";
import { useSlufeStore } from '@/stores/slufe'

const { getflux } = storeToRefs(useSlufeStore());

</script>

<template>
  <i-row middle>

       <i-column xs="6" v-for="item in getflux" :key="item.keynum" >
       <div>
       <div><small><b>{{item.keynum }}</b></small> <span><i>{{ item.message }}</i></span>{{ item.stream }} {{ item.stream.active }}</div>
         <video :srcObject="item.stream"  autoplay></video>
         </div>
       </i-column>
    
       </i-row>
</template>