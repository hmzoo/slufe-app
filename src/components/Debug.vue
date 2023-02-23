<script setup>
import { storeToRefs } from "pinia";
import { useSlufeStore } from '@/stores/slufe'

const { getflux, fwl } = storeToRefs(useSlufeStore());

</script>

<template>
<div>
<h4>FWL</H4>
    <i-table border>
      <tbody>
       <tr v-for="item in fwl">
       <th>{{item.k}}</th><td>{{item.d}}</td>
       </tr>
      </tbody>
       </i-table>
<h4>FLUX</H4>
  <i-table border>
      <tbody>
       <tr v-for="item in getflux" :key="item.keynum">
       <th>{{item.keynum}}</th>
       <td v-if="item.connected"><small>CONNECTED</small></td>
       <td><small>{{item.id}}</small></td><td>{{item.message}}</td><td><video :srcObject="item.stream" width="160" height="100" autoplay></video></td>
       </tr>
      </tbody>
       </i-table>
       </div>
</template>