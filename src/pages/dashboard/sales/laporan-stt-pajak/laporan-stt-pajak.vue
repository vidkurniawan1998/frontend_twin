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
                  Laporan Sales To Trade
                </h2>
              </div>

              <div class="col-auto">
                <div class="row">
                  <div class="col-auto px-0">

                  </div>

                  <div class="col-auto">
                    <button class="btn btn-white" v-html="ic('filter')+' Filter'" @click="_filter"> </button>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <Skeleton type="table" :length="10" class="mt-3 bg-white" v-if="loading"/>

          <Nodata v-if="!loading && data.length == 0 && isFilter"/>
          <div class="alert alert-info" v-if="!isFilter && !loading">
            <i class="fe fe-info mr-2"></i> Pilih filter untuk memuat data Sales To Trade
          </div>

          <div class="text-center my-6" v-if="!loading && data.length > 0">

            <img :src="asset('doc.png')" alt="" style="width: 200px; opacity: .5">
            <h3 class="my-3" v-html="data.length+' Data'"></h3>

            <div class="btn-group">
              <button class="btn btn-outline-primary" @click="_createPdf">Export PDF</button>
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
  name: "LaporanSTT",
  components: { FormFilter },

  data() {
    return {
      auth: {},

      filter: {
        config: { view: false, title: null },
        data: null, isSubmit: false,
        action: () => {}
      },

      loading: false, isFilter: false,
      data: [],

      dataFilter: {
        id_perusahaan: '',
        id_principal: [],
        id_salesman: 'all',
        start_date: this.dateTime('ymd'),
        end_date: this.dateTime('ymd'),
        status: 'all',
        depo:[],
        nomor_pajak: 'exclude'
      },
    };
  },

  mixins: [helper],

  methods: {

      _get(){
        this.loading = true

        this.axios.get("report/stt",{params: this.dataFilter}).then(res => {
          this.loading = false;

          this.data = []

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

      _createPdf(){
        let doc = new jsPDF('p'), user = JSON.parse(localStorage.user);
        let styles = { fillColor: [255, 255, 255], cellPadding: 0, lineColor: 0 }

        // title
        doc.autoTable(this.pdfHeader(''))

        let header = [['Kode', 'Nama Barang', 'Dus/Pcs', 'Sub Total', 'Disc', 'Ppn', "Net"]], temp = [];

        for(let i = 0; i < this.data.length; i++){
          let data = this.data[i];

          temp.push(data.kode_barang);
          temp.push(data.nama_barang);
          temp.push(data.qty_dus+'/'+data.qty_pcs);
          temp.push(this.ribuan(data.subtotal+'|,2'));
          temp.push(this.ribuan(data.discount+'|,2'));
          temp.push(this.ribuan(data.ppn+'|,2'));
          temp.push(this.ribuan(data.dbp+'|,2'));

          header.push(temp);
          temp = [];
        }

        styles['cellPadding'] = 2;

        doc.autoTable({ // body
          theme: 'grid', styles: styles, margin: { top: 10, left: 10, right: 10 },
          body: header,
        })

        this.pdfDownload([ doc.output() ])
      },

      _createExcel(){
        // ubah key pada data asli mengikuti format excel stt intravis
        var dataExcel = [];
        for(let i = 0; i < this.data.length; i++){
          let d = this.data[i]; //console.log(d)
          dataExcel.push({
            'gudang': d.nama_gudang,
            'outcode': d.no_acc,
            'outname': d.nama_toko,
            'address': d.alamat_toko,
            'kab': d.kabupaten,
            'kecamatan': d.kecamatan,
            'kelurahan': d.kelurahan,
            'kodepos': d.kode_pos,
            'npwp': (d.npwp == null || d.npwp == '' ? '' : d.npwp.replaceAll('.','').replace('-','')),
            'custtype': d.tipe_harga,
            'typeotl': d.tipe_toko,
            'distrik': 'Bali',
            'itemcode': d.item_code,
            'scode': d.kode_barang,
            'groupcode': d.nama_segmen,
            'brand': d.nama_brand,
            'segmen': d.nama_barang,
            'satuan': d.satuan,
            'slsmname': d.nama_salesman,
            'team': d.nama_tim,
            'depo': d.nama_depo,
            'qtydus': { v: d.qty_dus, t: "n"},
            'qtypcs': { v: d.qty_pcs, t: "n"},
            'hargatrans': d.price_before_tax,
            'volume': { v: d.isi, t: "n"},
            'tahun': d.tahun,
            'bulan': d.bulan,
            'hari': d.hari,
            'transdate': d.tanggal_penjualan,
            'subtotal': d.subtotal,
            'diskon': d.discount,
            'proposal': d.promo,
            'ppn': d.ppn,
            'total': d.total,
            'hpp': d.hpp,
            'harga_net': d.dbp,
            'week': d.week,
            'number': d.no_invoice,
            'no_pajak': d.no_pajak,
            'berat': d.berat,
            'nopo': d.no_po,
            'status': d.status,
            'ordered_at': d.ordered_at,
            'approved_at': d.approved_at,
            'delivered_at': d.delivered_at,
            'tipe_pembayaran': d.tipe_pembayaran,
            'NamaPKP': d.nama_pkp,
            'AlamatPKP': d.alamat_pkp,
            'Principal' : d.nama_principal,
            'no_ktp' : d.no_ktp,
            'nama_ktp' : d.nama_ktp,
            'alamat_ktp': d.alamat_ktp,
            'order_qtydus': { v: d.order_dus, t: "n"},
            'order_qtypcs': { v: d.order_pcs, t: "n"},
            'pending_status': d.pending_status,
            'remark': d.remark_close
          })
        }

        this.createExcel({data: dataExcel, filename: 'laporan-stt-'+this.dataFilter.start_date+' - '+this.dataFilter.end_date}, false)
      }

  },

  mounted(){
    this.auth = JSON.parse(localStorage.user)
    // this._get()
  },

};
</script>
