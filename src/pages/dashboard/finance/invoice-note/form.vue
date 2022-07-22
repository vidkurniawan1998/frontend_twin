<template>
  <div class="antialiased">
    <Sidebar/>
    <div class="page">
      <Header hint="Cari" :enabled="false"/>
      <div class="content">
        <div class="container">
          <div class="page-header">
            <div class="row d-flex justify-content-between">
              <div class="col-auto">
                <h2 class="page-title">
                </h2>
              </div>
              <div class="col-auto">
                <h2 v-html="loading ? spin() : ''">
                </h2>
              </div>
            </div>
          </div>
          <div class="box">
            <div class="card">
              <div class="card-body">
                <div class="row">
                  <div class="col-2 form-group">
                    <label for="depo" class="form-label">Depo</label>
                    <selectize
                        id="depo"
                        data-placeholder="Pilih Depo"
                        :disabled="loading"
                        v-model="data_form.id_depo"
                        v-on:input="getSalesman()"
                        required>
                      <option :value="d.id" v-for="(d, i) in depo" :key="i"> {{d.nama_depo+' ('+d.perusahaan.kode_perusahaan+')'}} </option>
                    </selectize>
                  </div>

                  <div class="form-group col-4">
                    <label for="salesman" class="form-label">Salesman</label>
                    <selectize
                        id="salesman"
                        v-model="data_form.id_salesman"
                        data-placeholder="Pilih Salesman"
                        required 
                        v-on:input="getNoInvoice()"
                        :disabled="loading">
                      <option :value='d.id' v-for="(d, i) in salesman" :key="i">{{d.nama_salesman}} ({{d.tim}})</option>
                    </selectize>
                  </div>

                  <!--noinvoice-->
                  <div class="col-4 form-group">
                    <label class="form-label" for="no_invoice">No Invoice</label>
                    <selectize
                        data-placeholder="Pilih No Invoice"
                        id="no_invoice"
                        v-model="no_invoice_selected"
                        :disabled="loading"
                        required
                    >
                    <option :value='d.no_invoice+"/"+d.id' v-for="(d, i) in invoice" :key="i">
                      {{d.no_invoice+'&emsp; '+d.nama_toko}}
                    </option>
                    </selectize>
                  </div>

                  <div class="col-2 form-group">
                    <label class="form-label" style="color: white">.</label>
                    <button class="btn btn-primary" @click="add_row()">Tambah</button>
                  </div>
                 
                   <Skeleton type="table" :length="6" class="mt-3 bg-white" v-if="loading"/>
                   <div class="row" style="margin-top: 10px" v-if="!loading">
                    <div class="col-12">
                      <table class="table table-responsive">
                        <thead>
                          <tr>
                            <th>No</th>
                            <th>No Nota</th>
                            <th>Tanggal Req</th>
                            <th>Keterangan</th>
                            <th>Alasan Reschedule</th>
                            <th>Aksi</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-if="data_form.data_invoice.length == 0">
                            <td class="text-center" colspan="6" v-if="!loading">
                              Belum ada data
                            </td>
                          </tr>
                          <tr v-for="(row, i) in data_form.data_invoice" :key="i">
                            <td style="vertical-align: middle;">{{ i+1 }}</td>
                            <td style="vertical-align: middle;">{{ row.no_invoice }}</td>
                            <td style="vertical-align: middle;">
                              <input type="date" class="form-control" v-model="data_form.data_invoice[i].tanggal">
                            </td>
                            <td style="vertical-align: middle;">
                              <input type="text" class="form-control" v-model="data_form.data_invoice[i].keterangan">
                            </td>
                            <td style="vertical-align: middle;">
                              <input type="text" class="form-control" v-model="data_form.data_invoice[i].keterangan_reschedule">
                            </td>
                            <td style="vertical-align: middle;">
                              <button class="btn btn-sm btn-danger" v-html="ic('minus')"  @click="del_row(i, row.id)"></button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div> 

                </div>

                 <div class="row" style="margin-top: 20px;float: right">
                  <div class="col-12">
                    <button class="btn btn-primary" :disabled="loading" @click="action()" v-html="loading ? spin():'Simpan'"></button>
                    &nbsp;
                    <button class="btn btn-danger" @click="clear();$router.push({name: 'Invoice Note'})">Batal</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {mapState, mapActions } from 'vuex'
import helper from "@/assets/js/helper.js"

export default {
  name: "Modal",
  mixins: [helper],
  computed:{
    ...mapState(['loading']),
    ...mapState('invoice_note', {
      data_form    : state => state.data_form,
      data_laporan : state => state.data_laporan,
    }),
  },
  data() {
    return{
      salesman : [],
      depo : [],
      invoice : [],
      no_invoice_selected : '',
      data_delete : '',
    }
  },

  methods: {
    ...mapActions('salesman', ['getListSalesman']),
    ...mapActions('depo', ['getListDepo']),

    getSalesman() {
      const url = 'salesman/list/by_depo/';
      this.axios.get(url+this.data_form.id_depo).then((response) => {
         this.salesman = response.data.data
      })
    },
    getDepo(){
      let payload = {
        'id_perusahaan' : '', 
      };
      this.getListDepo(payload).then( res => {
        this.depo = res;
      })
    },

    getNoInvoice(){
      const url = 'penjualan/list/penjualan_by_salesman/';
      this.axios.get(url+this.data_form.id_salesman).then((response) => {
         this.invoice = response.data;
      })
    },

    add_row() {
      let invoceArr = this.no_invoice_selected.split('/');
      let exists = this.data_form.data_invoice.find( x => x.no_invoice == invoceArr[0]);
      if (exists) {
        this.toast('Data Diplicate');
        return
      }
      let pb = {
        'id' : 0,
        'id_penjualan' : invoceArr[1],
        'no_invoice' : invoceArr[0],
        'tanggal' : this.dateTime('ymd'),
        'keterangan' : '',
        'keterangan_reschedule' : '',
        'status' : 'belum_dikunjungi'};
      if(pb.no_invoice!=''){
        this.data_form.data_invoice.push(pb);
      }
    },

    del_row(i,id) {
      this.data_form.data_invoice.splice(i, 1)
      if(id>0){
        this.data_delete = this.data_delete+','+id;
      }
    },

    clear(){ 
      this.data_form.id_depo = 0;
      this.data_form.id_salesman = 0;
      this.data_form.id_active = [];
      this.data_form.data_invoice = [];
      this.data_delete = [];
      this.salesman = [];
      this.invoice = [];
    },

    checkUpdate(array){
      return array.id>0;
    },
    checkSubmit(array){
      return array.id==0;
    },

    action(){
      let data = this.data_form.data_invoice;
      let data_submit = data.filter(this.checkSubmit);
      let data_update = data.filter(this.checkUpdate);
      let data_remove = this.data_delete;

      if(data_submit.length>0){this.submit(data_submit);}
      if(data_update.length>0){this.update(data_update);}
      if(data_remove.length>0){this.remove(data_remove);}
      this.clear();
    },

    submit(payload){
      let url = '/invoice_note';
      //let payload = this.data_form.data_invoice;
      this.axios.post(url, payload).then(res => {
        this.toast('Berhasil ditambahkan');
        console.log(res.data);
      }).catch( err => {
        this.toast('Error Invoice Telah diInput');
      });
    },

    update(payload){
      let url = '/invoice_note';
      this.axios.put(url, payload).then(res => {
        this.toast('Berhasil diubah');
        console.log(res.data);
      }).catch( err => {
        this.onError(err);
      });
    },

    remove(payload){
      let url = 'invoice_note/'+payload;
      this.axios.delete(url).then(res => {
      }).catch( err => {
        this.onError(err);
      });
    },
    
    getDetail(){
      const url = 'invoice_note/detail';
      this.axios.get(url, {
        params: this.data_form.id_active
      }).then((response) => {
        let data_update = response.data.data;
        this.data_form.data_invoice=data_update;
      })
    },
  },
  watch: {

  },
  mounted: function () {
  },
  created(){
    this.getDepo();
    this.getDetail();
  }
}
</script>
