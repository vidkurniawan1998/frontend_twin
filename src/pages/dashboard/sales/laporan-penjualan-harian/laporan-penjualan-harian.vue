<template>
  <div class="antialiased">

    <Sidebar/>


    <div class="page">
      
      <Header @keyup="_search" hint="Ketik nama barang"/>

      <div class="content">
        <div class="container">
          <!-- Page title -->
          <div class="page-header">
            <div class="row d-flex justify-content-between">
              <div class="col-auto">
                <h2 class="page-title">
                  Laporan Penjualan Harian
                </h2>
              </div>

              <!-- <div class="col-auto">
                <div class="text-muted text-h5 mt-2">Login Pada {{auth.logged_at}}</div>
              </div> -->

              <div class="col-auto">
                <div class="row">
                  <div class="col-auto px-0">

                    <!-- <div class="input-icon">
                      <span class="input-icon-addon"> <i class="fe fe-align-left"></i> </span>
                      <select class="form-control" v-model="paginate.perPage" @change="_get" :disabled="loading">
                        <option :value="num" v-for="(num, i) in [10,50,100,999]" :key="i" v-html="num == 999 ? 'Semua' : num"/>
                      </select>
                    </div> -->

                  </div>

                  <div class="col-auto">
                    <button class="btn btn-white" v-html="ic('filter')+' Filter'" @click="_filter"> </button>
                    <button class="btn btn-primary ml-3" v-html="request ? spin() : ic('download')+' Export Excel'" :disabled="request || jmlSales == 0 " @click="_createExcel"> </button>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <Skeleton type="table" :length="10" class="mt-3 bg-white" v-if="loading"/>

          <Nodata v-if="!loading && data.length == 0 && isFilter"/>
          <div class="alert alert-info" v-if="!isFilter && !loading && data.length == 0">
            <i class="fe fe-info mr-2"></i> Pilih filter untuk memuat data Penjualan Harian
          </div>

          <div class="box" v-if="!loading && data.length > 0">
              <div class="card">
                <div class="table-responsive">
                  <table class="table table-vcenter table-hover card-table table-striped table-no-break">

                     <thead>
                      <tr class="text-muted nowrap">
                        <th>No</th>
                        <th>Salesman</th>
                        <th>Jml Inv</th>
                        <th>EC</th>
                        <th>SKU</th>
                        <th>QTY ORDER</th>
                        <th>Value ORDER</th>
                        <th>QTY SHIP</th>
                        <th>Value</th>
                        <th>Jml Cash</th>
                        <th>Jml Credit</th>
                        <th>Total PPN</th>
                        <th>Total Disc</th>
                        <th>Pelunasan Tunai</th>
                        <th>Pelunasan BG</th>
                        <th>Pelunasan Transfer</th>
                        <th>Pelunasan Retur</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(row, i) in data" :key="i" >
                      <td>{{i + 1}}</td>
                      <td>{{row.tim}} - {{row.nama_salesman}}</td>
                      <td>{{row.count_inv}}</td>
                      <td>{{row.ec}}</td>
                      <td>{{ribuan(row.sku)}}</td>
                      <td>{{ribuan(row.total_qty_order)}} / {{row.total_pcs_order}}</td>
                      <td>{{ribuan(row.value_order+'|Rp ')}}</td>
                      <td>{{ribuan(row.total_qty)}} / {{row.total_pcs}}</td>
                      <td>{{ribuan(row.value+'|Rp ')}}</td>
                      <td>{{ribuan(row.value_cash+'|Rp ')}}</td>
                      <td>{{ribuan(row.value_credit+'|Rp ')}}</td>
                      <td>{{ribuan(row.total_ppn+'|Rp ')}}</td>
                      <td>{{ribuan(row.total_discount+'|Rp ')}}</td>
                      <td>{{ribuan(row.penagihan_tunai+'|Rp ')}}</td>
                      <td>{{ribuan(row.penagihan_bg+'|Rp ')}}</td>
                      <td>{{ribuan(row.penagihan_transfer+'|Rp ')}}</td>
                      <td>{{ribuan(row.penagihan_retur+'|Rp ')}}</td>
                      </tr>
                    </tbody>

                    <tfoot>
                      <!-- <tr class="text-muted nowrap">
                        <th>No</th>
                        <th>Salesman</th>
                        <th>Jml Inv</th>
                        <th>EC</th>
                        <th>SKU</th>
                        <th>QTY ORDER</th>
                        <th>Value ORDER</th>
                        <th>QTY SHIP</th>
                        <th>Value</th>
                        <th>Jml Cash</th>
                        <th>Jml Credit</th>
                        <th>Total PPN</th>
                        <th>Total Disc</th>
                      </tr> -->
                      <tr>
                        <td colspan="2">Total</td>
                        <td v-for="(n, i) in tFooter" :key="i" v-html="n"></td>
                      </tr>
                    </tfoot>
                    
                  </table>
                </div>
              </div>
          </div>

        </div>
      </div>

    </div>

    <FormFilter
      :config.sync="filter.config"
      :initData="filter.data" :dismiss.sync="filter.dismiss"
      :isSubmit.sync="filter.isSubmit"
      @submit="filter.action"
    />

  </div>
</template>

<script>
import helper from "@/assets/js/helper.js";
import FormFilter from "./modals/filter.vue";

import jsPDF from "jspdf";
import "jspdf-autotable";

export default {
  name: "LaporanPenjualanHarian",
  components: { FormFilter },

  data() {
    return {
      auth: {}, request: false,

      filter: {
        config: { view: false, title: null },
        data: null, isSubmit: false,
        action: () => {}
      },

      loading: false, isFilter: false,
      data: [], dataOri: [],
  
      paginate: {
        currentPage: 1,
        totalRows: 0,
        perPage: 10,
        fromPage: 0
      },

      jmlSales: 0,

      dataFilter: {
        id_salesman: [],
        start_date: this.dateTime('ymd'),
        end_date: this.dateTime('ymd'),
        tipe_pembayaran: 'all',
        depo:[],
        id_mitra: 'exclude',
      },

      tFooter: []

    };
  },

  mixins: [helper],

  methods: {

      _get(){
        this.loading = true
        

        // let url = "report/laporan_penjualan?start_date="+this.dataFilter.start_date+"&end_date="+this.dataFilter.end_date+"&id_salesman="+this.dataFilter.id_salesman.toString();
        this.axios.get('report/laporan_penjualan',
          {
            params: this.dataFilter
          }
        ).then(res => {
          this.loading = false;

          let data = res.data
          this.data = this.dataOri = data

          // hitung total data
          this.tFooter = []

          let keys = ['count_inv','ec','sku','total_qty_order','total_pcs_order','value_order','total_qty','total_pcs','value','value_cash','value_credit','total_ppn','total_discount','penagihan_tunai','penagihan_bg','penagihan_transfer','penagihan_retur'],
              temp = [] // hasil perhitungan total taruh di temp
          
          for (let k = 0; k < keys.length; k++) {
            temp.push(0)

            for (let i = 0; i < data.length; i++) {
              let _data = data[i]
              temp[k] += _data[keys[k]]
            }
          }

          for (let i = 0; i < temp.length; i++) {
            if([3,6].indexOf(i) > -1){
              this.tFooter.push(this.ribuan(temp[i])+'/'+this.ribuan(temp[i+1]))
            }else{
              if([4,7].indexOf(i) < 0){
                let rp = []
                this.tFooter.push(rp.indexOf(i) > -1 ? 'Rp '+this.ribuan(temp[i]) : this.ribuan(temp[i]+'|,2'))
              }
            }
          }

        }).catch( err => {
          this.loading = false
          this.onError(err)
        });
      },

      _filter(){
        this.filter.config = {view: true, title: 'Filter'}
        this.filter.action = (formData) => {
          for (const key in formData) {
            if(key == 'id_salesman'){
              this.dataFilter[key] = formData[key].toString()
              this.jmlSales = formData[key].length
            }else{
              this.dataFilter[key] = formData[key]
            }
          }

          this._get()
        }
      },

      _search(keyword){
        let k = keyword.toString().toLowerCase(); this.data = []
        for (let i = 0; i < this.dataOri.length; i++) {
          if(this.dataOri[i].nama_barang.toLowerCase().includes(k) || this.dataOri[i].kode_barang.toLowerCase().includes(k)){
            this.data.push(this.dataOri[i])
          }
        }
      },
      
      _createExcel() {
        this.request = true
        this.axios.get('report/laporan_penjualan_salesman', {
          params: {
            depo: this.dataFilter.depo,
            id_salesman: this.dataFilter.id_salesman,
            tanggal_awal: this.dataFilter.start_date,
            tanggal_akhir: this.dataFilter.end_date,
            tipe_pembayaran: this.dataFilter.tipe_pembayaran,
            id_mitra: this.dataFilter.id_mitra
          }
        }).then(res => {
          this.request = false
          window.open(res.data)
        }).catch(err => {
          this.request = false
          this.onError(err)
        })
      }
  },

  mounted(){
    this.auth = JSON.parse(localStorage.user)
  },

};
</script>
