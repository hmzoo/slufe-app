<script setup>
import { ref } from 'vue'
import axios from 'axios';
axios.defaults.withCredentials = true;


const msg = ref("no msg")
const uid = ref("")
const key = ref("")
const qkey  = ref("")
const val = ref("")
const qval  = ref("")


const get_key =()=> {
           axios.get('./key').then(res => {
              msg.value = res.data.msg || "no msg";
              key.value = res.data.key || "no key";
              uid.value = res.data.uid || "no uid";
           })       
        }

const new_key =()=> {
           axios.get('./key',{params: { new: 1}}).then(res => {
              msg.value = res.data.msg || "no msg";
              key.value = res.data.key || "no key";
              uid.value = res.data.uid || "no uid";
           })       
        }

const set_val =()=> {
           axios.get('./set',{ params: { uid: uid.value,key: key.value,val: val.value } }).then(res => {
              msg.value = res.data.msg || "no msg";       
           })       
        }

const get_val =()=> {
           axios.get('./get',{ params: { key: qkey.value } }).then(res => {
              msg.value = res.data.msg || "no msg";
              qval.value = res.data.val || "no val";
           })       
        }

</script>

<template>

<i-layout>
    <i-layout-header class="_text-align:center">
        <h2>SLUFE APP</h2>
    </i-layout-header>

    <i-layout-content>
       <i-container>
    <i-row>
        <i-column xs="3"><button @click="get_key">Get key</button></i-column><i-column xs="3"><button @click="new_key">New key</button></i-column><i-column xs="3">{{ key }}</i-column><i-column xs="3">{{ uid }}</i-column>
    </i-row>
   <i-row>
        <i-column xs="4"><i-input v-model="val" placeholder="set val .." /></i-column><i-column xs="4"><button @click="set_val">Set val</button></i-column><i-column xs="4">{{ val }}</i-column>
    </i-row>
        <i-row>
        <i-column xs="4"><i-input v-model="qkey" placeholder="qet qval.." /></i-column><i-column xs="4"><button @click="get_val">Get val</button></i-column><i-column xs="4">{{ qval }}</i-column>
    </i-row>
   <i-row>
        <i-column xs="6">msg : </i-column><i-column xs="6">{{ msg }}</i-column>
    </i-row>
    </i-container>
    </i-layout-content>
</i-layout>


</template>
