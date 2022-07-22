<template>
  <div class="antialiased">

    <Sidebar/>


    <div class="page">
      
      <Header :disabledSearch="true"/>

      <div class="content">
        <div class="container pos-relative">
          <!-- Page title -->
          <div class="page-header">
            <div class="row d-flex justify-content-between">
              <div class="col-auto">
                <h2 class="page-title">
                  Import Nomor Pajak
                </h2>
              </div>

              <div class="col-auto">
                <div class="alert" :class="available ? 'alert-info' : 'alert-danger'">
                  <b> <i class="fe fe-info mr-1"></i> SYARAT UPLOAD!</b> <br>
                  Format file harus .xlsx atau .xls <br> No | Pajak | Invoice
                </div>
              </div>
            </div>
          </div>

          <transition name="slide-fade-x">
            <div class="time-convert" v-if="isFinish">
              <div class="text-muted" v-html="'Estimasi waktu konversi '+(timeFinish >= 60 ? parseInt((timeFinish / 60))+' menit '+(timeFinish - (60 * parseInt((timeFinish / 60))))+' detik' : timeFinish+' detik')"></div>
            </div>
          </transition>

          <div class="frame-upload" @dragover.prevent @drop.prevent="_drop">

            <div class="file-control" v-if="files.length > 0">
              <i class="fe fe-chevron-left nav-left" v-if="file.index > 0" @click="_prevFile"></i>
              <i class="fe fe-chevron-right nav-right" v-if="file.index < files.length - 1" @click="_nextFile"></i>
            </div>

            <div class="input-file" @click="isSubmit ? false : $refs.file.click()" :class="isSubmit ? 'active' : ''">
              <input type="file" class="d-none" accept=".xlsx,.xls" ref="file" @change="_onFile" multiple>
              
              <transition name="slide-fade-y">
                <div v-if="file.file != null">
                  <div class="img">
                    <span v-html="file.size"></span>
                    <img :src="asset('excel.png')" alt="">
                  </div>
                  <div v-html="file.name" class="mt-2"></div>
                  <div v-html="(file.index + 1) +' dari '+files.length+' file'"></div>
                </div>
              </transition>

              <div v-if="file.file == null && !hasUploaded">
                <div class="mb-3"> <i class="fe fe-upload"></i> </div>
                <div style="letter-spacing: 2px">UPLOAD FILE EXCEL <br> ATAU DRAG & DROP DISINI</div>
              </div>
              
            </div>

          </div>

          <transition name="slide-fade-y">
            <div class="btn-fly" v-if="file.file != null && available">
              <h3 class="text-center" v-html="time >= 60 ? parseInt((time / 60))+' menit '+(time - (60 * parseInt((time / 60))))+' detik' : time+' detik'" v-if="isSubmit"></h3>
              <button class="btn btn-primary btn-pill" :disabled="isSubmit" @click="_convert" v-html="isSubmit ? spin()+' Mohon menunggu...' : 'IMPORT NOMOR PAJAK'"></button>
            </div>
          </transition>

        </div>
      </div>

    </div>

    <Message :config.sync="message.config"/>


  </div>
</template>

<script>
import helper from "@/assets/js/helper.js";
import Message from "./modals/message.vue";

export default {
  name: "KinoBridging",
  components: { Message },

  data() {
    return {
        auth: {},
        file: {
          file: null, name: null, size: null, index: 0
        },

        message: {
          config: { view: false },
        },

        files: [],
        hasUploaded: false, isSubmit: false, interval: null, time: 0, timeFinish: 0, available: true, isFinish: false
    };
  },

  mixins: [helper],

  methods: {

    _onFile(e, params){

      const files = params == null ? e.target.files : params.files;
      // this.available = true

      // check file name validation
      // let fnAvailable = ['rtr','stt','stock'];
      // for (let i = 0; i < files.length; i++) {
      //   let fn = files[i].name.split('.')[0]

      //   if(fnAvailable.indexOf(fn) < 0){ this.available = false; this.files = []; }
      // }

      // if(!this.available) return

      this.files = files

      const file = params == null ? e.target.files[0] : params.files[0],
            allowed = ['xlsx','xls'];

      if (allowed.indexOf(file.name.split('.').pop()) < 0) {
        this.toast('Format file tidak valid');
        return;
      }

      if (typeof FileReader === 'function') {
        const reader = new FileReader();

        this.file.file = null
        this.file.index = 0

        setTimeout(() => {
          reader.onload = (event) => {
            this.file.file = file
            this.file.name = file.name
            this.file.size = this.formatBytes(file.size)
          };

          this.hasUploaded = true

          reader.readAsDataURL(file);
        }, this.hasUploaded ? 500 : 0);

      } else {
        this.toast('FileReader API not supported');
      }
    },

    _fileInfo(index = 0){
      let file = this.files[index]

      this.file.file = file
      this.file.name = file.name
      this.file.size = this.formatBytes(file.size)
    },

    _prevFile(){
      this.file.index = this.file.index - 1
      this._fileInfo(this.file.index)
    },

    _nextFile(){
      this.file.index = this.file.index + 1
      this._fileInfo(this.file.index)
    },

    _convert(){
      this.isSubmit = true
      this.isFinish = false

      let formData = new FormData();

      for (let i = 0; i < this.files.length; i++) {
        formData.append('file[]', this.files[i]);
      }

      let self = this; this.time = 1; this.timeFinish = 1

      this.interval = setInterval(function () {
        self.time = self.time + 1
        self.timeFinish = self.timeFinish + 1
      }, 1000);

      this.axios.post('import/pajak', formData).then(res => {
        clearInterval(this.interval)
        this.isSubmit = false

        this.toast('Nomor pajak berhasil di upload')

        // for (const key in res.data) {

        //   let blob = new Blob([res.data[key]], { type: 'application/txt' })
        //   let link = document.createElement('a')
        //   link.href = window.URL.createObjectURL(blob)
        //   link.setAttribute('download', key+' - '+this.dateTime('date')+'.txt')
        //   link.click()

        // }

        this.file.file = null
        this.hasUploaded = false
        this.isFinish = true

        // let blob = new Blob([res.data], { type: 'application/txt' })
        // let link = document.createElement('a')
        // link.href = window.URL.createObjectURL(blob)
        // link.setAttribute('download', 'kino-briging-'+this.dateTime('date')+'.txt')
        // link.click()
        // window.open(link, '_blank')
      }).catch(err => {
        this.message.config.view = true

        this.onError(err)
        this.isSubmit = false
        this.isFinish = true

        clearInterval(this.interval)
      })
    },

    _drop(e){
      let dataTransfer = e.dataTransfer.files

      this._onFile(e, {files: dataTransfer})

      

    },

    _dragOver(e){

    }

    
  },

  mounted(){
    this.auth = JSON.parse(localStorage.user)
  }

};
</script>

<style lang="scss" src="./import-pajak.scss" scoped/>