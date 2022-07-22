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
                  Bridging
                </h2>
              </div>

              <div class="col-auto">
                <div class="alert" :class="convert.success ? 'alert-success' : available ? 'alert-info' : 'alert-danger'">
                  <b> <i class="fe mr-1" :class="convert.success ? 'fe-check' : 'fe-info'"></i> {{convert.success ? files.length+' FILE BERHASIL DIKONVERSI!' : 'SYARAT UPLOAD!'}}</b> <br>
                  <span v-html="convert.success ? 'Pilih principal untuk download hasil konversi.' : 'Nama file excel harus rtr, stt, stock.'"/>
                </div>
              </div>
            </div>
          </div>

          <transition name="slide-fade-x">
            <div class="time-convert" v-if="convert.success">
              <div class="text-muted" v-html="'Estimasi waktu konversi '+(timeFinish >= 60 ? parseInt((timeFinish / 60))+' menit '+(timeFinish - (60 * parseInt((timeFinish / 60))))+' detik' : timeFinish+' detik')"></div>
            </div>
          </transition>

          <div class="frame-upload" @dragover.prevent @drop.prevent="_drop">
            
            <transition name="show-up">
              <div class="form-group" style="width: 330px" v-if="convert.success">
                <div class="text-danger text-center mb-1" v-if="principals.length == 0">Tidak ada data principal.</div>

                <selectize data-placeholder="Pilih principal" required v-model="kode_principal" :disabled="request || principals.length == 0"> 
                  <option :value="row.kode" v-for="(row, i) in principals" :key="i"> {{row.kode+' - '+row.name}} </option>
                </selectize>

                <div class="text-center">
                  <button class="btn btn-primary mt-3 mb-2" v-html="convert.download ? spin()+' Mohon menunggu...' : request ? spin()+' Memuat data principal' : ic('download')+' Download'" :disabled="request || convert.download || kode_principal == null" @click="_download"> </button> <br>

                  <span class="click-able text-primary" @click="_reset" v-if="!convert.download">Upload Ulang</span>
                </div>

              </div>
            </transition>

            <div class="file-control" v-if="files.length > 0 && !convert.success">
              <i class="fe fe-chevron-left nav-left" v-if="file.index > 0" @click="_prevFile"></i>
              <i class="fe fe-chevron-right nav-right" v-if="file.index < files.length - 1" @click="_nextFile"></i>
            </div>

            <div class="input-file" @click="isSubmit ? false : $refs.file.click()" :class="isSubmit ? 'active' : ''" v-if="!convert.success">
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
              <!-- <button class="btn btn-primary btn-pill" :disabled="isSubmit" @click="_convert" v-html="isSubmit ? spin()+' Mohon menunggu...' : 'CONVERT EXCEL'"></button> -->
            </div>
          </transition>

        </div>
      </div>

    </div>


  </div>
</template>

<script>
import helper from "@/assets/js/helper.js";
import XLSX from 'xlsx';

export default {
  name: "KinoBridging",
  components: {  },

  data() {
    return {
      auth: {},
      request: false,
      principals: [], kode_principal: null,

      convert: {
        success: false,
        download: false
      },


      
      file: {
        file: null, name: null, size: null, index: 0
      },

      files: [],
      hasUploaded: false, isSubmit: false, interval: null, time: 0, timeFinish: 0, available: true
    };
  },

  mixins: [helper],

  methods: {

    getPrincipal(){
      this.request = true
      this.axios.get('bridging/principal').then(res => {// console.log(res)
        this.request = false
        this.principals = res.data
      }).catch(err => {
        this.onError(err)
        this.request = false
      })
    },

    _onFile(e, params){

      const files = params == null ? e.target.files : params.files;
      this.available = true

      if(files.length == 0) return

      // check file name validation
      let fnAvailable = ['rtr','stt','stock'];
      for (let i = 0; i < files.length; i++) {
        if(files[i] != null){
          let fn = files[i].name.split('.')[0]
          if(fnAvailable.indexOf(fn) < 0){ this.available = false; this.files = []; }
        }
      }

      if(!this.available) return

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
          this._convert()

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

      let formData = new FormData();

      for (let i = 0; i < this.files.length; i++) {
        formData.append('file[]', this.files[i]);
      }

      let self = this; this.time = 1; this.timeFinish = 1

      this.interval = setInterval(function () {
        self.time = self.time + 1
        self.timeFinish = self.timeFinish + 1
      }, 1000);

      this.axios.post('import/bridging', formData).then(res => {
        clearInterval(this.interval)
        this.isSubmit = false
        this.convert.success = true

        this.getPrincipal()

        // console.log(res)

        // for (const key in res.data) {

        //   let blob = new Blob([res.data[key]], { type: 'application/txt' })
        //   let link = document.createElement('a')
        //   link.href = window.URL.createObjectURL(blob)
        //   link.setAttribute('download', key+' - '+this.dateTime('date')+'.txt')
        //   link.click()
        // }

        // this.file.file = null
        // this.hasUploaded = false

        // let blob = new Blob([res.data], { type: 'application/txt' })
        // let link = document.createElement('a')
        // link.href = window.URL.createObjectURL(blob)
        // link.setAttribute('download', 'kino-briging-'+this.dateTime('date')+'.txt')
        // link.click()
        // window.open(link, '_blank')
      }).catch(err => {
        this.onError(err)
        this.isSubmit = false
      })
    },

    _drop(e){
      let dataTransfer = e.dataTransfer.files
      this._onFile(e, {files: dataTransfer})
    },

    _dragOver(e){

    },

    _reset(){
      this.convert.success = false
      this.file.file = null
      this.hasUploaded = false
    },

    _download(){
      if(this.kode_principal != null){
        this.convert.download = true
        this.axios.post('export/stt/bridging', {principal: this.kode_principal}).then(res => {
          this.convert.download = false

          let data = res.data
          for (let i = 0; i < data.length; i++) {
            window.open(data[i]) // open tab
            
            // download as file
            // let link = document.createElement('a')
            // link.href = data[i]
            // link.setAttribute('download', 'Bridging - '+this.dateTime('date')+'.xlsx')
            // link.click()
          }
          

          // let excel = [
          //   {
          //     'Kode': '',
          //     'SuperCode': '',
          //     'barcode': '',
          //     'NamaBrg': '',
          //     'Deskripsi': '',
          //     'ISI': '',
          //     'Supplier': '',
          //     'DENPASAR': 'DUS',
          //     'DENPASAR2': 'PCS',
          //     'KLUNGKUNG': 'DUS',
          //     'KLUNGKUNG2': 'PCS',
          //     'SINGAJARA': 'DUS',
          //     'SINGAJARA2': 'PCS',
          //     'NEGARA': 'DUS',
          //     'NEGARA2': '',
          //   }
          // ]

          // switch (this.kode_principal) {
          //   case 'C-004': //DAPUR KITA

          //     let data = res.data
          //     console.log(res.data[0])

              
          //     for (let i = 0; i < data.length; i++) {
          //       excel.push({
          //         'Kode': data[i].kode,
          //         'SuperCode': data[i].super_code,
          //         'barcode': data[i].barcode,
          //         'NamaBrg': data[i].nama_brg,
          //         'Deskripsi': data[i].deskripsi,
          //         'ISI': data[i].isi,
          //         'Supplier': data[i].supplier,
          //         'DENPASAR': data[i].denpasar.dus,
          //         'DENPASAR2': data[i].denpasar.pcs,
          //         'KLUNGKUNG': data[i].klungkung.dus,
          //         'KLUNGKUNG2': data[i].klungkung.pcs,
          //         'SINGAJARA': data[i].singaraja.dus,
          //         'SINGAJARA2': data[i].singaraja.pcs,
          //         'NEGARA': data[i].negara.dus,
          //         'NEGARA2': data[i].negara.pcs,
          //       });
          //     }

          //     const merge = [
          //       { s: { r: 0, c: 7 }, e: { r: 0, c: 8 } }, // merge column 1, row ke H dengan row ke I
          //       { s: { r: 0, c: 9 }, e: { r: 0, c: 10 } },
          //       { s: { r: 0, c: 11 }, e: { r: 0, c: 12 } },
          //       { s: { r: 0, c: 13 }, e: { r: 0, c: 14 } },
          //     ];

          //     var dataXlsx = XLSX.utils.json_to_sheet(excel) 
          //     var wb = XLSX.utils.book_new() // make Workbook of Excel
              
          //     dataXlsx["!merges"] = merge;
          //     dataXlsx["!cols"] = [{ wpx : 70 },{ wpx : 121 }]
              
          //     // [{
          //     //   // fill: {
          //     //   //   patternType: "none", // none / solid
          //     //   //   fgColor: {rgb: "99999999"},
          //     //   //   bgColor: {rgb: "99999999"}
          //     //   // },

          //     //   // font: {
          //     //   //   name: 'Times New Roman',
          //     //   //   sz: 16,
          //     //   //   color: {rgb: "#FF000000"},
          //     //   //   bold: true,
          //     //   //   italic: false,
          //     //   //   underline: false
          //     //   // },

          //     //   border: {
          //     //     top: {style: "thin", color: {auto: 1}},
          //     //     right: {style: "thin", color: {auto: 1}},
          //     //     bottom: {style: "thin", color: {auto: 1}},
          //     //     left: {style: "thin", color: {auto: 1}}
          //     //   }
          //     // }];

          //     XLSX.utils.book_append_sheet(wb, dataXlsx, 'sheet') // sheet is name of Worksheet
          //     XLSX.writeFile(wb, 'test.xlsx')


              
          //     break;
          
          //   default: this.toast('Export untuk principal ini belum tersedia')
          //     break;
          // }


          // this.createExcel({data: result, filename: 'laporan-aktual-'+this.dataFilter.start_date+' - '+this.dataFilter.end_date})

        }).catch(err => {
          this.onError(err)
          this.convert.download = false
        })
      }
    }

    
  },

  mounted(){
    this.auth = JSON.parse(localStorage.user)
  }

};
</script>

<style lang="scss" src="./bridging.scss" scoped/>