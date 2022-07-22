<template>
  <div class="antialiased">

    <Sidebar/>


    <div class="page">
      
      <Header hint="Cari" :enabled="false"/>

      <div class="content">
        <div class="container">
          <!-- Page title -->
          <div class="page-header">
            <div class="row d-flex justify-content-between">
              <div class="col-auto">
                <h2 class="page-title">
                  Laporan Retur Penjualan
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
                    <!-- <button class="btn btn-primary ml-3" v-html="ic('download')+' Export Excel'" @click="_exportExcel"> </button> -->
                  </div>
                </div>

              </div>
            </div>
          </div>

          <Skeleton type="table" :length="10" class="mt-3 bg-white" v-if="loading"/>

          <Nodata v-if="!loading && data.length == 0 && isFilter"/>
          <div class="alert alert-info" v-if="!isFilter && !loading">
            <i class="fe fe-info mr-2"></i> Pilih filter untuk memuat data Retur Penjualan
          </div>

          <div class="text-center my-6" v-if="!loading && data.length > 0">
            
            <img :src="asset('doc.png')" alt="" style="width: 200px; opacity: .5">
            <h3 class="my-3" v-html="data.length+' Data'"></h3>

            <div class="btn-group">
              <!-- <button class="btn btn-outline-primary" @click="_createPdf">Export PDF</button> -->
              <button class="btn btn-primary" @click="_createExcel">Export Excel</button>
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
  name: "LaporanReturPenjualan",
  components: { FormFilter },

  data() {
    return {
      auth: {},

      filter: {
        config: { view: false, title: null },
        data: null, isSubmit: false,
        action: () => {}
      },

      loading: true, isFilter: false,
      data: [],
  
      dataFilter: {
        id_perusahaan: '',
        id_salesman: 'all',
        status: 'approved',
        kategori: 'all',
        start_date: this.dateTime('ymd'),
        end_date: this.dateTime('ymd'),
        depo:[],
        id_principal: [],
      },
    };
  },

  mixins: [helper],

  methods: {

      _get(){
        this.loading = true
        let formData = {
          status: this.dataFilter.status,
          start_date: this.dataFilter.start_date,
          end_date: this.dataFilter.end_date,
          id_salesman: this.dataFilter.id_salesman,
          depo: this.dataFilter.depo,
          kategori: this.dataFilter.kategori,
          id_principal: this.dataFilter.id_principal,
          id_perusahaan: this.dataFilter.id_perusahaan,
        }

        this.axios.get('report/retur_penjualan',
            {
              params: formData
            }
        ).then(res => {
          this.loading = false;
          if(res.data.length != 0){
            this.data = res.data.data
          }
        }).catch( err => {
          this.loading = false
          this.onError(err)
        });
      },

      _filter(){
        this.filter.config = {view: true, title: 'Filter'}
        this.filter.action = (formData) => {
          this.isFilter = true

          for (const key in formData) {
            this.dataFilter[key] = formData[key]
          }

          this._get()
        }
      },

      _createExcel(){
        let dataExcel = [];

        for(let i = 0; i < this.data.length; i++){
          let data = this.data[i];
          dataExcel.push({
            'NUMBER': data.no_invoice,
            'Gudang': data.nama_gudang,
            'SALESRTRD': data.sales_retur_date,
            'ClaimDate': data.claim_date,
            'CUSTID': data.no_acc,
            'CONAME': data.nama_toko,
            'Address': data.alamat,
            'Team': data.tim,
            'Brand': data.barang.segmen.brand.nama_brand,
            'RCat': data.kategori_bs,
            'StockCode': data.barang.item_code,
            'SCode': data.barang.kode_barang,
            'QtyDus': { v: data.qty_dus, t: "n"},
            'QtyPcs': { v: data.qty_pcs, t: "n"},
            'Volume': { v: data.barang.isi, t: "n"},
            'Harga0': data.dbp,
            'NPWP': data.npwp,
            'Subtotal': data.subtotal,
            'Disc': data.potongan,
            'Ppn': data.ppn,
            'TOTAL': data.net,
            'ExpDate': data.expired_date,
            'Periode': data.periode,
            'InCarton': this.ribuan((+data.qty_dus + (+data.qty_pcs / +data.barang.isi))+'|,2'),
            'InPcs': (+data.qty_dus * +data.barang.isi) + +data.qty_pcs,
            'DPP RETUR PPn': data.dpp,
            'Depo': null,
            'Depo2': null,
            'KATEGORI': null,
            'TAHUN': null,
            'BULAN': null,
            'WEEKICBP': null,
            'SIKLUS': null,
            'BRAND_NEW': null,
            'SUBBRAND': null,
            'VENDOR': data.barang.segmen.brand.principal.nama_principal,
            'RCat2': null,
            'no_acc': data.cust_no,
            'approved_date': data.approved_at,
            'harga': data.harga_tax,
            'SEGMEN': data.barang.nama_barang,
            'IDRETUR': data.id_retur_penjualan,
            'TYPERETUR': data.kategori_retur,
            'NPR': data.npr
          })
        }

        this.createExcel({data: dataExcel, filename: 'laporan-retur-penjualan-'+this.dataFilter.start_date+' - '+this.dataFilter.end_date}, false)
      }
    
  },

  mounted(){
    this.auth = JSON.parse(localStorage.user)
    this._get()
  },

};
</script>
