import { defineStore } from 'pinia';


export const useMediaStore = defineStore('media',{
    
    state: () => ({
      videoDevices: [],
      audioDevices: [],
      camera: {beOn:true,id:"",index:0,mobile:"user",label:""},
      micro: {beOn:false,id:"",index:0,label:""},
      stream:null,
      constrains:{},
      error:""


    }),
    actions: {
        start(){   
           this.error ="";    
           this.stop();
            navigator.mediaDevices.enumerateDevices().then(devices => {
                this.audioDevices = devices.filter(device => device.kind === 'audioinput')
                if (this.audioDevices.length > 0) {
                  this.micro.id = this.audioDevices[this.micro.index].deviceId
                  this.micro.label = this.audioDevices[this.micro.index].label
                }
                this.videoDevices = devices.filter(device => device.kind === 'videoinput')
                if (this.videoDevices.length > 0) {
                  this.camera.id= this.videoDevices[this.camera.index].deviceId
                  this.camera.label= this.videoDevices[this.camera.index].label
                }
                this.constrains= {
                  audio: {deviceId:{exact:this.micro.id}},
                  video: {
                    deviceId:{exact:this.camera.id},
                    width: { min: 1024, ideal: 1280, max: 1920 },
                    height: { min: 576, ideal: 720, max: 1080 },
                  //  facingMode: state.camera.mobile,
                  },
                }
                if (!this.camera.beOn){this.constrains.video=false;this.camera.label="none"}
                if (!this.micro.beOn){this.constrains.audio=false;this.micro.label="none"}
                if(this.micro.beOn || this.camera.beOn ){
                navigator.mediaDevices
                  .getUserMedia(this.constrains)
                  .then(s => {
                    //console.log('streaming', s)
                    this.stream= s;
                   })
                  .catch(error => {
                    this.stream= null;
                    this.error = "⚠\n"+error + "\nMay the browser didn't support or there is some errors."
             
                  })
              }else{this.stream= null;}})
        },
        stop(){
          if(this.stream){
            this.stream.getTracks().forEach(track => {
              //console.log('stopping', track)
              track.stop()
            })
            this.stream = null
          }
        },
        switchcam(){
          this.camera.beOn=!this.camera.beOn;
          this.start();
        },
        switchmic(){
          this.micro.beOn=!this.micro.beOn;
          this.start();
        },
        swapcam(){
          this.camera.index=(this.camera.index+1)% this.videoDevices.length
          if(this.camera.id==this.videoDevices[this.camera.index].deviceId){this.camera.index=(this.camera.index+1)% this.videoDevices.length}
          this.camera.id=this.videoDevices[this.camera.index].deviceId
          this.camera.label=this.videoDevices[this.camera.index].label
          this.start();
        }
        ,
        swapmic(){
          this.micro.index=(this.micro.index+1)% this.audioDevices.length
          if(this.micro.id==this.audioDevices[this.micro.index].deviceId){this.micro.index=(this.micro.index+1)% this.audioDevices.length}
          this.micro.id=this.audioDevices[this.micro.index].deviceId
          this.micro.label=this.audioDevices[this.micro.index].label
          this.start();
        }
   
        
      }



});