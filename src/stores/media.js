import { defineStore } from 'pinia';

let constrains = { audio: false, video: false }


const createfakestream = () => {
  let color1 = "#24A8AC", color2 = "#0087CB";
  let numberOfStripes = 30;
  let w = 640
  let h = 400;
  const canvas = Object.assign(document.createElement('canvas'), { width: w, height: h });
  const cxt = canvas.getContext('2d');
  //cxt.fillStyle = 'grey';
  //cxt.fillRect(0, 0, 320, 200);
  for (var i = 0; i < numberOfStripes; i++) {
    var thickness = h / numberOfStripes;
    cxt.beginPath();
    cxt.strokeStyle = i % 2 ? color1 : color2;
    cxt.lineWidth = thickness;

    cxt.moveTo(0, i * thickness + thickness / 2);
    cxt.lineTo(w, i * thickness + thickness / 2);
    cxt.stroke();
  }


  const fstream = canvas.captureStream(12);
  const vtrack = fstream.getVideoTracks()[0];
  const videoTrack = Object.assign(vtrack, { enabled: true });
  let fs= new MediaStream([videoTrack]);
 
  return fs;
}



export const useMediaStore = defineStore('media', {

  state: () => ({
    videoDevices: [],
    audioDevices: [],
    camera: { beOn: true, id: "", index: 0, mobile: "user", label: "",check:false },
    micro: { beOn: false, id: "", index: 0, label: "" ,check:false},
    stream: null,
    error: "",
    stream_status :{cam:false,mic:false,caminfo:""}


  }),
  actions: {
    list() {
      navigator.mediaDevices.enumerateDevices().then(devices => {
        this.audioDevices = devices.filter(device => device.kind === 'audioinput');
        this.videoDevices = devices.filter(device => device.kind === 'videoinput');
        console.log("list devices",devices,this.audioDevices,this.videoDevices);
      }).catch(error => { console.log(error)});
    },
    start() {
      let caminfo ="";
      this.error = "";
      if (this.stream ){
        this.stream.getTracks().forEach(track => {
          //console.log('stopping', track)
          track.stop()
        })
        
      }
      

      if (this.audioDevices.length > 0) {
        this.micro.id = this.audioDevices[this.micro.index].deviceId
        this.micro.label = this.audioDevices[this.micro.index].label
      }
      
      if (!this.camera.beOn) { 
        constrains.video = false; this.camera.label = "" 
        caminfo="NONE"
      } else { 
        if (this.camera.check) {
          this.camera.id = this.videoDevices[this.camera.index].deviceId
          this.camera.label = this.videoDevices[this.camera.index].label
          constrains.video = { deviceId: { exact: this.camera.id } }
          caminfo=this.camera.id 
        }else{ constrains.video = true ;caminfo="DEFAULT"  }
    }

    if (!this.micro.beOn) { constrains.audio = false; this.micro.label = "" } else { constrains.audio = { echoCancellation: true } }
  
      if (this.micro.beOn || this.camera.beOn) {
        console.log("C:" ,constrains)
        navigator.mediaDevices
          .getUserMedia(constrains)
          .then(s => {
            console.log("constrains : ", constrains.audio, constrains.video)
            if(!this.camera.check){this.camera.check=true;this.list()}
            this.error = "";
            this.stream = s;
            this.stream_status = {cam:this.camera.beOn, mic:this.micro.beOn ,caminfo:caminfo}
          })
          .catch(error => {
            this.camera.check =false;
            this.micro.beOn =false;
            this.camera.beOn =false;
            this.stop();
            this.error = "⚠\nMay the browser didn't support or there is some errors.\n Or \n Camera not authorized. please check your media permissions settings"
            console.log("constrains : ", constrains.audio, constrains.video)
            console.log(error)
            this.stream_status = {cam:false, mic:false ,camid:"ERR"}
           

          })
      } else { this.stop(); }
    },
    stop() {
      if (this.stream ) {
        this.stream.getTracks().forEach(track => {
          //console.log('stopping', track)
          track.stop()
        })
        this.stream = null;
      }
      this.stream_status = {cam:false, mic:false ,caminfo:"STOP"}
      //console.log("stop stream ",this.stream)
      
      
    },
    destroy() {
      if (this.stream ) {
        this.stream.getTracks().forEach(track => {
          //console.log('stopping', track)
          track.stop()
          this.stream = null;
        })
      }
      //console.log("stop stream ",this.stream)
      
    },
    switchcam() {
      this.camera.beOn = !this.camera.beOn;
      this.start();
    },
    switchmic() {
      this.micro.beOn = !this.micro.beOn;
      this.start();
    },
    swapcam() {
      this.camera.index = (this.camera.index + 1) % this.videoDevices.length
      if (this.camera.id == this.videoDevices[this.camera.index].deviceId) { this.camera.index = (this.camera.index + 1) % this.videoDevices.length }
      this.camera.id = this.videoDevices[this.camera.index].deviceId
      this.camera.label = this.videoDevices[this.camera.index].label
      this.start();
    }
    ,
    swapmic() {
      this.micro.index = (this.micro.index + 1) % this.audioDevices.length
      if (this.micro.id == this.audioDevices[this.micro.index].deviceId) { this.micro.index = (this.micro.index + 1) % this.audioDevices.length }
      this.micro.id = this.audioDevices[this.micro.index].deviceId
      this.micro.label = this.audioDevices[this.micro.index].label
      this.start();
    }


  },
  getters: {
    camstatus: (state) => { return state.camera.beOn },
    micstatus: (state) => { return state.micro.beOn },
  }



});

/*
constrains = {
        // audio: {deviceId:{exact:this.micro.id}},
        audio: this.audioDevices.length > 0,
        video: {
          deviceId: { exact: this.camera.id },
          //  facingMode: state.camera.mobile,
        },
      }

      */