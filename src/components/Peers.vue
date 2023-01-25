<script setup>
const props = defineProps({
	peers: Array
})
</script>

<template>
  <i-table border>
      <tbody>
       <tr v-for="item in peers" :key="item.keynum">
       <th>{{item.keynum}}</th><td><small>{{item.id}}</small></td><td>{{item.message}}</td><td><video :srcObject="item.stream" width="160" height="100" autoplay></video></td>
       </tr>
      </tbody>
       </i-table>
</template>