<script setup>
const props = defineProps({
	messages: Array
})
</script>

<template>
  <div class="_border">
    <span v-for="msg in messages" class="_display:block"><b>{{ msg.keynum}}:</b> {{ msg.msg}} </span>
  </div>
</template>