<script setup>
import { ref } from 'vue'
import axios from 'axios';

const message = ref("ok")
const testclick =()=> {
           console.log("TESTCLICK")
            message.value = message.value+'t'
        }

const testajax =()=> {
           axios.get('http://hmdev.mshome.net:5000/newuid').then(res => {
              message.value = res.data.uid
           })
            
        }

</script>

<template>
COOL!!!!!!!!!<br/>
{{ message }}
<br/>
<button @click="testclick">Change message</button>
<br/>
<button @click="testajax">Test ajax</button>
</template>
