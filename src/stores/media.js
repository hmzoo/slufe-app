import { defineStore } from 'pinia';

const createfakestream=()=>{
  let color1 = "#24A8AC",color2="#0087CB";
  let numberOfStripes = 30;
  let w = 640
  let h=400;
  const canvas = Object.assign(document.createElement('canvas'), { width:w, height:h });
  const cxt=canvas.getContext('2d');
  //cxt.fillStyle = 'grey';
  //cxt.fillRect(0, 0, 320, 200);
  for (var i=0;i < numberOfStripes;i++){
      var thickness = h / numberOfStripes;
      cxt.beginPath();
      cxt.strokeStyle = i % 2?color1:color2;
      cxt.lineWidth =thickness;
      
      cxt.moveTo(0,i*thickness + thickness/2);
      cxt.lineTo(w,i*thickness + thickness/2);
      cxt.stroke();
  }


  const stream = canvas.captureStream();
  const vtrack = stream.getVideoTracks()[0];
  const videoTrack = Object.assign(vtrack, { enabled: true });
  return new MediaStream([videoTrack]);
}


export const useMediaStore = defineStore('media',{
    
    state: () => ({
      videoDevices: [],
      audioDevices: [],
      camera: {beOn:true,id:"",index:0,mobile:"user",label:""},
      micro: {beOn:false,id:"",index:0,label:""},
      stream:createfakestream(),
      constrains:{},
      error:""


    }),
    actions: {
        start(){   
           this.error ="";    
           if(this.stream){
            this.stream.getTracks().forEach(track => {
              //console.log('stopping', track)
              track.stop()
            })
          }
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
                  //  facingMode: state.camera.mobile,
                  },
                }
                if (!this.camera.beOn){this.constrains.video=false;this.camera.label="none"}
                if (!this.micro.beOn){this.constrains.audio=false;this.micro.label="none"}
                if(this.micro.beOn || this.camera.beOn ){
                navigator.mediaDevices
                  .getUserMedia(this.constrains)
                  .then(s => {
                    //console.log('media streaming', s)
                    this.stream= s;
                   })
                  .catch(error => {
                    this.stop();
                    this.error = "⚠\n"+error + "\nMay the browser didn't support or there is some errors."
             
                  })
              }else{this.stop();}})
        },
        stop(){
          if(this.stream){
            this.stream.getTracks().forEach(track => {
              //console.log('stopping', track)
              track.stop()
            })
          }
            //console.log("stop stream ",this.stream)
            this.stream = createfakestream();
        },
        destroy(){
          if(this.stream){
            this.stream.getTracks().forEach(track => {
              //console.log('stopping', track)
              track.stop()
            })
          }
            //console.log("stop stream ",this.stream)
            this.stream = null;
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
   
        
      },
      getters: {
        camstatus: (state) => { return state.camera.beOn },
        micstatus: (state) => { return state.micro.beOn },
    }



});