import { defineStore } from 'pinia';


export const useMediaStore = defineStore('media',{
    
    state: () => ({
      videoDevices: [],
      audioDevices: [],
      camera: "",
      micro:""
    }),
    actions: {
        getDevices(){       
            navigator.mediaDevices.enumerateDevices().then(devices => {
                this.audioDevices = devices.filter(device => device.kind === 'audioinput')
                if (this.audioDevices.length > 0) {
                  this.micro = this.audioDevices[0].deviceId
                }
                this.videoDevices = devices.filter(device => device.kind === 'videoinput')
                if (this.videoDevices.length > 0) {
                  this.camera= this.videoDevices[0].deviceId
                }
                
              })
        }
         

    }



});