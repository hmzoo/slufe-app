import { defineStore } from 'pinia';


let videoDevices = [];
let audioDevices = [];
let videoIndex = 0;
let listDevices = () => {
  if (videoDevices.length == 0) {
    navigator.mediaDevices.enumerateDevices().then(devices => {
      audioDevices = devices.filter(device => device.kind === 'audioinput');
      videoDevices = devices.filter(device => device.kind === 'videoinput');
    }).catch(error => { console.log(error) });

  }
}
let getConstrains = (camOn, micOn) => {
  let constrains = { audio: { echoCancellation: true }, video: true }
  if (videoDevices.length > 0 || videoIndex < videoDevices.length) { constrains.video = { deviceId: { exact: videoDevices[videoIndex].deviceId } } }
  if (!camOn) { constrains.video = false }
  if (!micOn) { constrains.audio = false }
  return constrains
}
let curCam = () => {
  if (videoDevices.length == 0) { return "default" }
  return videoDevices[videoIndex].label
}
let nextCam = () => {
  if (videoDevices.length == 0) { return "default" }
  let oldid = videoDevices[videoIndex].deviceId
  videoIndex = (videoIndex + 1) % videoDevices.length
  if (oldid == videoDevices[videoIndex].deviceId) { videoIndex = (videoIndex + 1) % videoDevices.length }
  return videoDevices[videoIndex].label
}


export const useMediaStore = defineStore('media', {

  state: () => ({
    camOn: true,
    micOn: false,
    camlabel:"",
    stream: null,
    stream_error: "",
    stream_status: { cam: false, mic: false, caminfo: "", ready: false }
  }),
  actions: {
    list() {
      listDevices(devices);
      this.camlabel = curCam();
    },
    start() {
      this.stream_status = { cam: false, mic: false, caminfo: "INIT", ready: false }
      let caminfo = "";
      this.error = "";

      if (this.stream) {
        this.stream.getTracks().forEach(track => { track.stop() })
        this.stream = null
      }

      if (this.micOn || this.camOn) {
        navigator.mediaDevices
          .getUserMedia(getConstrains(this.camOn, this.micOn))
          .then(s => {
            listDevices();
            this.camlabel = curCam();
            this.error = "";
            this.stream = s;
            console.log("streamin",this.stream)
            this.stream_status = { cam: this.camOn, mic: this.micOn, caminfo: caminfo, ready: true }
          })
          .catch(error => {
            this.micOn = false;
            this.camOn = false;
            this.stop();
            this.stream_error = "⚠\nMay the browser didn't support or there is some errors.\n Or \n Camera not authorized. please check your media permissions settings"
            console.log("constrains : ",getConstrains(this.camOn, this.micOn) )
            console.log(error)
            this.stream_status = { cam: false, mic: false, caminfo: "ERR", ready: false }


          })
      } else { this.stop(); }
    },
    stop() {
      if (this.stream) {
        this.stream.getTracks().forEach(track => { track.stop(); this.stream = null; })
      }
      this.stream_status = { cam: false, mic: false, caminfo: "STOP", ready: false }

    },
    destroy() {
      if (this.stream) { this.stream.getTracks().forEach(track => { track.stop(); this.stream = null; }) }
    },
    switchcam() {
      this.camOn = !this.camOn;
      this.start();
    },
    switchmic() {
      this.micOn = !this.micOn;
      this.start();
    },
    swapcam() {
      this.camlabel = nextCam();
      this.start();
    }

  },
  getters: {
    camstatus: (state) => { return state.camOn },
    micstatus: (state) => { return state.micOn },
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