import { defineStore } from 'pinia';
import axios from 'axios';
axios.defaults.withCredentials = true;


export const useKeyNumStore = defineStore('keynum',{
    
    state: () => ({
      msg: "",
      key: "000000",
      fwl: []
    }),
    actions: {
        update_data(data){       
            this.msg = data.msg || "no msg";
            this.key = data.key || "no key";
            this.fwl = data.fwl || []; 
        },
        hb(){
            axios.get('/hb').then(res => {
                this.update_data(res.data);           
               })  
        },
        renew() {
            axios.get('/new').then(res => {
             this.update_data(res.data);
            })       
         },
         set(v){
            axios.get('/set',{params: { val: v}}).then(res => {
             this.update_data(res.data);
            })       
         },
         add(k){
            console.log("ADD",k)
                axios.get('/add',{params: { key: k}}).then(res => {
                 this.update_data(res.data);
                })       
             }
         

    }



});