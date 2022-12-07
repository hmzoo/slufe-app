<script setup>
import { ref , onMounted} from 'vue'
import axios from 'axios';
axios.defaults.withCredentials = true;


const msg = ref("no msg")
const key = ref("")
const fwl = ref([])

const qkey = ref("")
const qval = ref("")

const update_data =(data)=>{
             msg.value = data.msg || "no msg";
              key.value = data.key || "no key";
              fwl.value = data.fwl || [];
}



const req_hb =()=> {
           axios.get('./hb').then(res => {
            update_data(res.data);
           })       
        }

const req_new =()=> {
           axios.get('./new').then(res => {
            update_data(res.data);
           })       
        }

const req_set =()=> {
           axios.get('./set',{params: { val: qval.value}}).then(res => {
            update_data(res.data);
           })       
        }

const req_add =()=> {
           axios.get('./add',{params: { key: qkey.value}}).then(res => {
            update_data(res.data);
           })       
        }

onMounted(() => {
   req_hb();
  window.setInterval(() => {
    req_hb(); 
  }, 10000);
});

</script>

<template>

<i-layout>
    <i-layout-header class="_text-align:center">
           <i-container>
    <i-row>
        <i-column xs="6"><h2>SLUFE APP</h2></i-column><i-column xs="6"><h2>{{ key }}</h2></i-column>
    </i-row>
    </i-container>
       
    </i-layout-header>

    <i-layout-content>
       <i-container>
    <i-row>
        <i-column xs="1"><button @click="req_hb">HB</button></i-column><i-column xs="1"><button @click="req_new">NEW</button></i-column><i-column xs="5">{{ msg }}</i-column>
  
        <i-column xs="4"><i-input v-model="qval" placeholder="set val .." /></i-column><i-column xs="1"><button @click="req_set">Set val</button></i-column>
    </i-row>
    <i-row>
    <i-column xs="4"><i-input v-model="qkey" placeholder="key .." /></i-column><i-column xs="1"><button @click="req_add">ADD</button></i-column>
    </i-row>
    <i-row>
       <i-column xs="12">
       {{ fwl }}
       <i-table>
      <tbody>
       <tr v-for="item in fwl">
       <th>{{item.k}}</th><td>{{item.d}}</td>
       </tr>
      </tbody>
       </i-table>
       </i-column>    
    </i-row>
    </i-container>
    </i-layout-content>
</i-layout>


</template>
