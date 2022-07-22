<template>
  <div v-if="data_form.form">
    <div
      class="modal fade"
      :class="data_form.modal ? 'show' : ''"
      style="display: block"
      tabindex="-1"
      role="dialog"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-xl modal-dialog-centered" role="document">
        <div class="modal-content">

          <div class="modal-header">
            <h5 class="modal-title">NPWP External</h5>
            <span style="color: red; opacity: 0.4;" v-if="warning">Data Belum Tersimpan!</span>
            <button type="button" class="close" v-on:click="_close()" v-html="loading ? spin() : ic('close')"/>
          </div>

            <div class="modal-body pt-3" style="min-height: 620px;">
              
              <input type="file" class="d-none" accept=".xlsx,.xls" ref="file_npwp" @change="_importExcel" multiple>
              <div class="col-auto" @click="_out()">
                <div class="row">
                  <div class="col-auto">
                    <b-dropdown
                      split
                      split-variant="outline-success"
                      variant="outline-success"
                      class="m-2"
                      @click="$refs.file_npwp.click()"
                      >
                      <template slot="button-content">
                        &nbsp;<i class="fe fe-upload"></i>&nbsp;
                        Import Excel
                      </template>
                      <b-dropdown-item @click="$refs.file_npwp.click(); reformat = true">Reformat</b-dropdown-item>
                    </b-dropdown>
                    <button class="btn btn-outline-primary" style="margin-right: 10px;" 
                      @click="_exportExcel()" v-html="ic('download')+' Export Excel'">
                    </button>
                    <button class="btn btn-outline-secondary" 
                      @click="_get()"style="margin-right: 10px;" v-html="loading ? spin() : ic('refresh')+''">
                    </button>
                  </div>
                  <div class="col-auto" style="margin-left: 320px; padding-top: 10px;">
                    <input type="text" class="form-control" placeholder="Cari..." v-model="data_filter.keyword" @change="_get()">
                  </div>
                  <div class="col-auto px-0" style="padding-top: 10px;">
                    <div class="input-icon">
                          <span class="input-icon-addon">
                            <i class="fe fe-align-left"></i>
                          </span>
                      <select
                          @input="_get()"
                          class="form-control"
                          v-model="data_filter.per_page"
                          :disabled="loading">
                        <option
                            :value="num"
                            v-for="(num, i) in [10,50,100,'all']"
                            :key="i" v-html="num == 'all' ? 'Semua' : num"/>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <br>    
              
              <Skeleton type="table" :length="10" class="mt-3 bg-white" v-if="loading"/>
              <Nodata v-if="!loading && npwp_external.data.length == 0"/> 
              <div class="table-responsive" style="max-height: 490px; min-height: 490px;" v-if="npwp_external.data.length>0 && !loading">
                <div class="table-responsive" :tabindex="0">
                  <table class="table table-vcenter table-hover card-table table-control">
                  <thead @click="_out()" id="cop_npwp">
                    <tr class="text-muted">
                      <td width="50">No</td>
                      <td style="padding-left: 20px">Kode</td>
                      <td style="padding-left: 20px">Nama Toko</td>
                      <td style="padding-left: 20px">NPWP</td>
                      <td style="padding-left: 20px">Nama PKP</td>
                      <td style="padding-left: 20px">Alamat PKP</td>
                      <td></td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, i) in npwp_external.data" :key="i">
                      <template v-if="row.id == id_edit">
                        <td style="vertical-align: top; padding-top: 10px" v-if="npwp_external.meta">{{npwp_external.meta.from+i}}</td>
                        <td v-else>{{i+1}}</td>
                        <td>
                          <textarea rows="3" :placeholder="placeholder.kode_outlet" v-model="row.kode_outlet" class="form-control"></textarea>
                        </td>
                        <td width="200">
                          <textarea rows="3" :placeholder="placeholder.nama_toko" v-model="row.nama_toko" class="form-control"></textarea>
                        </td>
                        <td width="180">
                          <textarea rows="3" :placeholder="placeholder.npwp"  v-model="row.npwp" class="form-control"></textarea>
                        </td>
                        <td width="200">
                          <textarea rows="3" :placeholder="placeholder.nama_pkp"  v-model="row.nama_pkp" class="form-control"></textarea>
                        </td>
                        <td>
                          <textarea rows="3" :placeholder="placeholder.alamat_pkp"  v-model="row.alamat_pkp" class="form-control"></textarea>
                        </td>
                        <td><div></div></td>
                        <td class="p-0 pos-relative">
                          <div class="btn-group option center">
                            <button class="btn btn-white btn-pill" @click="_save(row, row.id)" v-html="ic('save')"/>
                          </div>
                        </td>
                      </template>
                      <template v-else>
                        <td v-if="npwp_external.meta">{{npwp_external.meta.from+i}}</td>
                        <td v-else>{{i+1}}</td>
                        <td @click="_edit(row)" style="padding-left: 20px; height: 50px" width="100">{{row.kode_outlet}}</td>
                        <td @click="_edit(row)" style="padding-left: 20px; height: 50px">{{row.nama_toko}}</td>
                        <td @click="_edit(row)" style="padding-left: 20px; height: 50px">{{row.npwp}}</td>
                        <td @click="_edit(row)" style="padding-left: 20px; height: 50px">{{row.nama_pkp}}</td>
                        <td @click="_edit(row)" style="padding-left: 20px; height: 50px">{{row.alamat_pkp}}</td>
                        <td class="p-0 pos-relative">
                          <div class="btn-group option center">
                            <button class="btn btn-white btn-pill" @click="_edit(row)" v-html="ic('edit')"/>
                            <button class="btn btn-white btn-pill text-danger" @click="_delete(row.id)" v-html="ic('trash')"/>
                          </div>
                        </td>
                      </template>
                    </tr>
                    <tr @click="_out()">
                        <td>#</td>
                        <td>
                          <textarea rows="2" :disabled="id_edit>0" v-model="row_new.kode_outlet" placeholder="Kode" class="form-control">
                            
                          </textarea>
                        </td>
                        <td width="200">
                          <textarea rows="2" :disabled="id_edit>0" v-model="row_new.nama_toko"  placeholder="Nama" class="form-control">
                            
                          </textarea>
                        </td>
                        <td width="180">
                          <textarea rows="2" :disabled="id_edit>0" v-model="row_new.npwp" placeholder="NPWP"class="form-control">
                            
                          </textarea>
                        </td>
                        <td width="200">
                          <textarea rows="2" :disabled="id_edit>0" v-model="row_new.nama_pkp" placeholder="Nama PKP"class="form-control">
                            
                          </textarea>
                        </td>
                        <td>
                          <textarea rows="2" :disabled="id_edit>0" v-model="row_new.alamat_pkp" placeholder="Alamat PKP" class="form-control">
                            
                          </textarea>
                        </td>
                        <td><div></div></td>
                        <td class="p-0 pos-relative">
                          <div class="btn-group option center">
                            <button class="btn btn-white btn-pill" @click="_new()" v-html="ic('save')"/>
                          </div>
                        </td>
                    </tr>
                  </tbody>
                </table>
                </div>
              </div>
              <b-pagination
                    v-if="typeof npwp_external.meta != 'undefined' && !loading && npwp_external.data.length > 0"
                    align="center"
                    class="mt-3" 
                    v-on:input="_get"
                    v-model="data_filter.page"
                    :total-rows="npwp_external.meta.total"
                    :per-page="data_filter.per_page" />

              <Confirm :id.sync="confirm.id" :title.sync="confirm.title" :isSubmit.sync="confirm.isSubmit" @submit="confirm.action"/>
            </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import XLSX from "xlsx";
import { mapState, mapActions, mapMutations } from 'vuex';
import helper from "@/assets/js/helper.js";

export default {
  name: "Modal",
  mixins: [helper],
  computed:{
    ...mapState('konversi_pajak', {
      data_form     : state => state.data_form,
      data_filter   : state => state.data_filter,
      npwp_external : state => state.npwp_external,
    }),
  },
  data() {
    return{
      data : [],
      placeholder : {
        kode_outlet : '',
        nama_toko   : '',
        npwp        : '',
        nama_pkp    : '',
        alamat_pkp  : '',
      },
      id_edit  : 0,
      warning  : false,
      loading  : false,
      reformat : false, 
      row_new  : {
        kode_outlet : '',
        nama_toko   : '',
        npwp        : '',
        nama_pkp    : '',
        alamat_pkp  : '',
      },
      confirm: {
        id: null, title: null, isSubmit: false, action: () => {}
      },
    }
  },

  methods: {
    ...mapActions('konversi_pajak', ['triggerFilter','getLaporan']),
    _out(){
      this.id_edit = 0
    },

    _close(){
      if(this.id_edit>0 && this.warning){
        this.triggerFilter()
      }
      else if(this.id_edit>0){
        this.warning = true
      }
      else{
        this.warning = false
        this.triggerFilter()
      }
    },

    _clearNew(){
      this.row_new = {
        kode_outlet : '',
        nama_toko   : '',
        npwp        : '',
        nama_pkp    : '',
        alamat_pkp  : '',
      }
    },

    _edit(data){
      this.id_edit     = data.id
      this.placeholder = {...data}
    },  

    _scrollTo(id){
      document.getElementById(id).scrollIntoView()
    },

    _new(){
      this.axios.post('npwp_external',this.row_new).then(res => {
        this.toast(res.data.message)
        this._get(true)
        this._scrollTo('cop_npwp')
        this._clearNew()
      }).catch(err => {
        this.onError(err)
      })
    },

    _save(data,id){
      this.axios.put('npwp_external/'+id,data).then(res => {
        this.toast(res.data.message)
        this._get(true)
        this.id_edit = 0
      }).catch(err => {
        this.onError(err)
      })
    },

    _delete(id){
      this.confirm.id = id
      this.confirm.title = 'Yakin ingin menghapus data npwp ini?'
      this.confirm.action = () => {
        this.axios.delete('npwp_external/'+id).then(res => {
          this.toast(res.data.message)
          this._get(true)
          this.confirm.id = null
        }).catch(err => {
          this.onError(err)
          this.confirm.isSubmit = false
        })

      }
    },

    _execute(data,id){
      this.axios.put('npwp_external/'+id,data).then(res => {
      }).catch(err => {
        this.onError(err)
      })
    },

    _importExcel(e){

      let allowed = ['xlsx','xls']
      let file    = e.target.files[0];

      if (allowed.indexOf(file.name.split('.').pop()) < 0) {
        this.toast('Format file tidak valid');
        return;
      }

      let self         = this
      var selectedFile = file
      var FR       = new FileReader()

      FR.onload = function(e) {
         var data = new Uint8Array(e.target.result);
         var workbook = XLSX.read(data, {type: 'array'});
         var firstSheet = workbook.Sheets[workbook.SheetNames[0]];
         
         var result = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
         self.data  = result
         self._send(result)
       };
      FR.onerror = function(event) {
        console.error("File could not be read! Code " + event.target.error.code);
      };
      FR.readAsArrayBuffer(file)
    },

    _exportExcel(){
      let dataExcel = []
      for (let i = 0; i < this.npwp_external.data.length; i++) {
        let data = this.npwp_external.data[i]
        let res = {
          'KODE TOKO'      : data.kode_outlet,
          'NAMA TOKO'      : data.nama_toko,
          'NPWP'           : data.npwp,
          'NAMA PKP'       : data.nama_pkp,
          'ALAMAT PKP'     : data.alamat_pkp,
        }
        dataExcel.push(res)
      }
      this.createExcel({data: dataExcel, filename: 'NPWP External - '+this.dTime('datetime')})   
    },

    _send(data){
      this.loading = true
      this.axios.post('npwp_external/import', {
         file     : data,
         reformat : this.reformat
      }).then(res => {
        this.loading  = false
        this.reformat = false
        this.toast('NPWP External berhasil diupload')
        this._get()
      }).catch(err => {
        this.loading = false
        this.onError(err)
      })
    },

    _get(silent = false){
      this.id_edit = 0
      this.loading = silent ? this.loading : true
      this.axios.get('npwp_external', { params: this.data_filter }).then(res => {
        this.npwp_external.data = res.data.data
        this.npwp_external.meta = res.data.meta
        this.loading = silent ? this.loading : false 
      }).catch(err => {
        this.onError(err)
      })
    },
  },
  mounted: function () {
    this._get()
  },
  created(){
  }
};
</script>

