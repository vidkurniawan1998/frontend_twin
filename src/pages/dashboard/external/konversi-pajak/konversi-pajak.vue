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
                        Konversi Pajak
                      </h2>
                    </div>
                  </div>
                </div>
                <div class="form-group" 
                style="
                max-width: 300px; 
                background-color: white; 
                padding: 20px; 
                border: solid; 
                border-width: thin;
                border-radius: 10px; 
                border-color: rgba(200, 202, 204, 0.5);
                opacity: 0.8;"
                >
                  <div>
                      <b>NOMOR PAJAK</b>
                      <br />
                      <small>NO. PAJAK TERAKHIR</small><hr style="height: 1px"> 
                  </div>
                  <div class="row">
                    <div class="col-12">
                      <input type="text" placeholder="FG Pengganti" maxlength="3" v-model="format.fg_penganti" class="form-control"/>
                    </div>

                    <div class="col-12" style="padding-top: 10px;">
                      <input type="text" placeholder="Header Faktur" maxlength="3" v-model="format.faktur_header" class="form-control"/>
                    </div>

                    <div class="col-12" style="padding-top: 10px;">
                      <input type="text" placeholder="Nomor Faktur" maxlength="10" v-model="format.faktur_nomor" class="form-control" autofocus/>
                    </div>
                    <div style="padding-top: 15px; opacity: 0.8;">
                      <button class="btn btn-outline-primary" @click="triggerFilter"> 
                        <i class="fa fa-pencil-square-o" aria-hidden="true">&nbsp;</i> NPWP External 
                      </button>
                      <button class="btn btn-outline-secondary" @click="_onWaiting('reset')" style="margin-left: 10px; padding-right: 20px;">
                        <i class="fa fa-retweet" aria-hidden="true"></i>&nbsp; Reset
                      </button>
                    </div>
                  </div>
                </div>

                <transition name="slide-fade-y">
                  <div class="frame-upload" @dragover.prevent @drop.prevent="_drop">

                      <div class="input-file">
                        <input type="file" class="d-none" accept=".xlsx" ref="file" @change="_onFile">

                        <div v-if="npwp_external.data.length==0 && !progress.waiting" @click="triggerFilter">
                          <div class="mb-3"> <i class="fa fa-meh-o" aria-hidden="true"></i> </div>
                          <div style="letter-spacing: 1px">DATA NPWP TIDAK DITEMUKAN <br> Silahkan Inputkan Data</div>
                        </div>

                         <div v-if="!progress.chosed && !progress.loaded && !progress.failed && !progress.waiting && npwp_external.data.length>0">
                          <div class="mb-3"> <i class="fa fa-clone" style="margin-bottom: -10px;"></i> </div>
                          <div style="letter-spacing: 1px">PILIH FORMAT FILE INPUT</div>
                          <span style="letter-spacing: 0px;">
                            <button class="btn btn-sm btn-outline-primary" style="width: 200px; margin: 2px;"
                             @click="format.tipe_converter='dms'; progress.chosed=true">Import Data DMS</button>
                          </span><br>
                          <span style="letter-spacing: 0px;">
                            <button class="btn btn-sm btn-outline-primary" style="width: 200px; margin: 2px;"
                            @click="format.tipe_converter='sky'; progress.chosed=true">Import Data SKY</button>
                          </span><br>
                          <span style="letter-spacing: 0px;">
                            <button class="btn btn-sm btn-outline-primary" style="width: 200px; margin: 2px;" 
                            @click="format.tipe_converter='intravis'; progress.chosed=true">Import Data Intravis</button>
                          </span><br>
                          <span style="letter-spacing: 0px;">
                            <button class="btn btn-sm btn-outline-primary" style="width: 200px; margin: 2px;" 
                            @click="format.tipe_converter='twin'; progress.chosed=true">Import Data Twin</button>
                          </span><br>

                        </div>

                        <div @click="$refs.file.click();"
                         v-if="progress.chosed && !progress.loaded && !progress.failed && !progress.waiting && npwp_external.data.length>0">
                          <div class="mb-3"> <i class="fe fe-upload"></i> </div>
                          <div style="letter-spacing: 1px">UPLOAD FILE EXCEL <br> ATAU DRAG & DROP DISINI</div>
                        </div>

                        <div v-if="progress.waiting" style="text-align: center; z-index: 2;">
                          <div class="mb-3"> <i class="fa fa-cog fa-spin"></i> </div>
                          <div style="letter-spacing: 1px">
                            LOADING <br>
                            <span>Mohon Tunggu </span>
                            <span style="letter-spacing: 0px">{{progress.note}}</span><br>
                            <span style="letter-spacing: 0px">{{file.type}}</span>
                          </div>
                        </div>

                        <div @click="$refs.file.click();" v-if="progress.failed" style="text-align: center;">
                          <div class="mb-3"><i class="fa fa-frown-o" aria-hidden="true"></i></div>
                          <div style="letter-spacing: 1px">
                            SOMETHING GOES WRONG <br>
                            <span style="letter-spacing: 0px">{{progress.note}}</span><br>
                          </div>
                        </div>

                        <div @click="progress.chosing=true" 
                        v-if="data.length>0 &&!progress.chosing && !progress.failed && !progress.waiting" style="text-align: center;">
                          <div class="mb-3"><i class="fa fa-file-excel-o" aria-hidden="true"></i></div>
                          <div style="letter-spacing: 1px">
                            UPLOAD SUCESS <br>
                            <span style="letter-spacing: 0px">{{file.name}}</span><br>
                            <span style="letter-spacing: 0px">{{file.lastModifiedDate}}</span>
                          </div>
                        </div>

                        <div v-if="progress.chosing && !progress.waiting && converted.length==0" @click="_onWaiting('send');" style="text-align: center;">
                          <div class="mb-3"> <i class="fe fe-arrow-right"></i> </div>
                          <div style="letter-spacing: 1px">
                            CONVERT : <br>
                            {{file.name}} <br>
                            FORMAT FROM {{format.tipe_converter.toUpperCase()}}
                          </div>
                        </div>

                        <div v-if="progress.chosing && !progress.waiting && converted.length>0" style="text-align: center;">
                          <div class="mb-3"><i class="fa fa-file" aria-hidden="true"></i></div>
                          <div style="letter-spacing: 1px">
                              DOWNLOAD : <br>
                              <span style="letter-spacing: 0px;">
                                <button class="btn btn-sm btn-outline-primary" style="width: 200px; margin: 2px;"
                                 @click="_createExcel()">Download Excel</button>
                              </span><br>
                              <span style="letter-spacing: 0px;">
                                <JsonCSV class="btn btn-sm btn-outline-primary" style="width: 200px; margin: 2px;"
                                  delimiter=";"
                                  :name="'koversi_pajak.csv'"
                                  :data="converted"
                                  >Download Csv
                                </JsonCSV>
                              </span>
                          </div>
                        </div>

                      </div>
                    </div>
                  </transition>

              </div>
            </div>

        </div>
      <FormFilter/>
    </div>

</template>

<script>
import XLSX from "xlsx";
import VueJsonToCsv from "vue-json-to-csv";
import JsonCSV from "vue-json-csv";

import helper from "@/assets/js/helper.js";
import FormFilter from "./modals/filter.vue";
import { mapState, mapActions, mapMutations } from 'vuex';

export default {
  name: "pajak",
  components: { VueJsonToCsv, JsonCSV, FormFilter },
  mixins: [helper],  
  computed: {
    ...mapState(['loading']),
    ...mapState('konversi_pajak', {
      data_form  : state => state.data_form,
      data_laporan : state => state.data_laporan,
      npwp_external : state => state.npwp_external,
    }),
  },
  data() {
    return {
      file          : {},
      data          : [],
      converted     : [],
      format        : {
        fg_penganti    : '',
        faktur_header  : '',
        faktur_nomor   : '',
        tipe_converter : '',
      },
      progress     : {
        loading    : false,
        loaded     : false,
        chosing    : false,
        chosed     : false,
        failed     : false,
        waiting    : false,
        note       : ''
      },
 
    };
  },

  methods: {
    ...mapActions('konversi_pajak', ['triggerFilter','getLaporan']),
    _onFailed(note){
      this.progress.waiting      = true
      setTimeout(() => {
        this.progress.failed     = true
        this.progress.loading    = false
        this.progress.loaded     = false
        this.progress.chosing    = false
        this.progress.chosed     = false
        this.progress.waiting    = false
        this.progress.note       = note
      }, 300);
    },

    _resetImport(){
      this.file                = {}
      this.data                = []
      this.converted           = []
      this.progress.loading    = false
      this.progress.loaded     = false
      this.progress.chosing    = false
      this.progress.chosed     = false
      this.progress.failed     = false
      this.progress.waiting    = false
      this.progress.note       = ''
      return true
    },

    _onWaiting(params){
      this.progress.waiting      = true
      setTimeout(() => {
        switch(params) {
          case "convert":
            this.progress.note = 'read : '
            this._convert(function () {
              this.progress.waiting = false
              this.progress.note = ''
            })
            break;
          case "send":
            this.progress.note = 'converting from : '
            this._send(function () {
              this.progress.waiting = false
              this.progress.note = ''
            })
            break;
          case "reset":
            this._resetImport(function () {
              this.progress.waiting = false
            })
            break;
          default:
            this._onFailed('Entah Kenapa Error ...')
        }
      }, 300);
    },

    _onFile(event) {
      this.progress.loaded  = true
      this.progress.failed  = false
      this.date             = new Date().toLocaleDateString().split("/").join("-")
      let file              = event.target.files[0];

      let allowed = ['xlsx','xls']
      if (allowed.indexOf(file.name.split('.').pop()) < 0) {
        this._onFailed('Format file tidak valid!')
        return;
      }
      if (file) {
        this.progress.loading = false
        if (file.size >= 10985795) {
          this._onFailed('File ini terlalu besar untuk diproses, (' +this.formatBytes(file.size) +')')
        } 
        else {
          this.file = file
          this._onWaiting('convert')
        }
      }
    },
    _convert(){
      console.log(this.file)
      let self         = this
      var selectedFile = this.file
      var FR           = new FileReader()

      FR.onload = function(e) {
         self.progress.waiting = true
         var data = new Uint8Array(e.target.result);
         var workbook = XLSX.read(data, {type: 'array'});
         var firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            
         //range adalah area read
         switch(self.format.tipe_converter) {
          case 'intravis':
            var result = XLSX.utils.sheet_to_json(firstSheet, { header: 0, range:0 });
            break;
          case 'sky':
            var result = XLSX.utils.sheet_to_json(firstSheet, { header: 0, range:3 });
            break;          
          case 'dms':
            var result = XLSX.utils.sheet_to_json(firstSheet, { header: 0, range:4 });
            break;   
          case 'twin':
            var result = XLSX.utils.sheet_to_json(firstSheet, { header: 0, range:0 });
            break;
          default:
            var result = XLSX.utils.sheet_to_json(firstSheet);
        }

         self.data  = result;
         self.progress.waiting = false
       };
      FR.onerror = function(event) {
        console.error("File could not be read! Code " + event.target.error.code);
      };
      FR.readAsArrayBuffer(selectedFile)
      return true
    },
    _send(){
      this.progress.waiting=true 
      this.axios.post('koversi_pajak/convert', {
         file     : this.data,
         format   : this.format
      }).then(res => {
        this.progress.waiting=false
        this.converted = res.data
        this.toast('Koversi Selesai')
      }).catch(err => {
        this.progress.waiting=false
        this.onError(err)
      })
      return true
    },
    _createExcel(){
      var wb     = XLSX.utils.book_new()
      //var ws     = XLSX.utils.json_to_sheet(this.converted)
      var ws     = XLSX.utils.aoa_to_sheet(this.converted)        
      XLSX.utils.book_append_sheet(wb, ws, 'All Depo') 
      XLSX.writeFile(wb, 'koversi_pajak.xlsx')
      //XLSX.writeFile(wb, 'koversi_pajak.csv')
    },
  },

  mounted() {

  },
  created() {

  }
};
</script>
<style lang="scss" src="./konversi-pajak.scss" scoped/>
