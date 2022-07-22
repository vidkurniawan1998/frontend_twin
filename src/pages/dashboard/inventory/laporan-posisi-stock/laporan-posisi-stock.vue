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
                  Laporan Posisi Stock
                </h2> <small v-html="nama_gudang"></small>
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
                    <button class="btn btn-primary ml-3" :disabled="data.length == 0" v-html="ic('download')+' Export Pdf'" @click="_createPdf"> </button>
                    <button class="btn btn-primary ml-3" :disabled="data.length == 0" v-html="ic('download')+' Export Excel'" @click="_createExcel"> </button>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <Skeleton type="table" :length="10" class="mt-3 bg-white" v-if="loading"/>

          <Nodata v-if="!loading && data.length == 0 && isFilter"/>
          <div class="alert alert-info" v-if="!isFilter && !loading && data.length == 0">
            <i class="fe fe-info mr-2"></i> Pilih filter untuk memuat data Posisi Stock
          </div>

          <div class="box" v-if="!loading && data.length > 0">
              <div class="card">
                <div class="table-responsive">
                  <table class="table table-vcenter table-hover card-table table-striped table-no-break">

                    <thead>
                      <tr class="text-muted">
                        <th>No</th>
                        <th>Kode Barang
                        <th>Nama Barang</th>
                        <th>Saldo Awal</th>
                        <th>Pembelian</th>
                        <th>Mutasi Masuk</th>
                        <th>Adjustment</th>
                        <th>Penjualan Pending</th>
                        <th>Penjualan</th>
                        <th>Mutasi Keluar Pending</th>
                        <th>Mutasi Keluar</th>
                         <th>Deliver</th>
                        <th>Saldo Akhir</th>
                         <th>Saldo Fisik</th>
                        <th>Harga</th>
                        <th>Nilai Stock</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(row, i) in data" :key="i" >
                        <td>{{i + 1}}</td>
                        <td>{{row.kode_barang}}</td>
                        <td>{{row.nama_barang}}</td>
                        <td title="Saldo Awal">{{ribuan(row.saldo_awal_qty)}}/{{ribuan(row.saldo_awal_pcs)}}</td>
                        <td title="Pembelian">{{row.pembelian_qty}}/{{row.pembelian_pcs}}</td>
                        <td title="Mutasi Masuk">{{row.mutasi_masuk_qty}}/{{row.mutasi_masuk_pcs}}</td>
                        <td title="Adjustment">{{row.adjustment_qty}}/{{row.adjustment_pcs}}</td>
                        <td title="Penjualan Pending Sebelumnya">{{row.penjualan_pending_qty}}/{{row.penjualan_pending_pcs}}</td>
                        <td :title="`Penjualan Pending ${filter.end_date || dateTime('ymd')}`">{{row.penjualan_qty}}/{{row.penjualan_pcs}}</td>
                        <td title="Mutasi Keluar Pending">{{row.mutasi_pending_qty}}/{{row.mutasi_pending_pcs}}</td>
                        <td title="Mutasi Keluar">{{row.mutasi_keluar_qty}}/{{row.mutasi_keluar_pcs}}</td>
                        <td title="Deliver">{{row.deliver_qty}}/{{row.deliver_pcs}}</td>
                        <td title="Saldo Akhir Sistem">{{ribuan(row.saldo_akhir_qty)}}/{{ribuan(row.saldo_akhir_pcs)}}</td>
                        <td title="Saldo Akhir Fisik">{{row.saldo_fisik_qty+'/'+row.saldo_fisik_pcs}}</td>
                        <td>{{ribuan(parseFloat(row.harga).toFixed())}}</td>
                        <td>{{ribuan(row.nilai_stock.toFixed())}}</td>
                      </tr>
                    </tbody>

                    <tfoot>
                      <tr>
                        <td colspan="3">Total</td>
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
  name: "LaporanPosisiStock",
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
      data: [], dataOri: [],

      paginate: {
        currentPage: 1,
        totalRows: 0,
        perPage: 10,
        fromPage: 0
      },

      dataFilter: {
        id_gudang: null,
        start_date: this.dateTime('ymd'),
        end_date: this.dateTime('ymd'),
        id_principal: [],
        id_barang: [],
        id_brand: []
      },

      nama_gudang: null,

      tFooter: []

    };
  },

  mixins: [helper],

  methods: {

      _get(){
        this.loading = true
        let formData = {
          tanggal: this.dataFilter.end_date,
          id_gudang: this.dataFilter.id_gudang,
          id_principal: this.dataFilter.id_principal,
          id_barang: this.dataFilter.id_barang,
          id_brand: this.dataFilter.id_brand
        }

        this.axios.get("report/posisi_stock", {
          params: formData
        }).then(res => {
          this.loading = false;
          if(res.data.length !== 0){

            let data = res.data.data
            this.data = this.dataOri = data

            // hitung total data
            this.tFooter = []

            let keys = ['saldo_awal_qty','saldo_awal_pcs','pembelian_qty','pembelian_pcs','mutasi_masuk_qty','mutasi_masuk_pcs','adjustment_qty','adjustment_pcs','penjualan_pending_qty','penjualan_pending_pcs','penjualan_qty','penjualan_pcs', 'mutasi_pending_qty','mutasi_pending_pcs', 'mutasi_keluar_qty','mutasi_keluar_pcs', 'deliver_qty', 'deliver_pcs', 'saldo_akhir_qty','saldo_akhir_pcs', 'saldo_fisik_qty','saldo_fisik_pcs', 'harga','nilai_stock'],
                temp = [] // hasil perhitungan total taruh di temp

            for (let k = 0; k < keys.length; k++) {
              temp.push(0)

              for (let i = 0; i < data.length; i++) {
                let _data = data[i]
                temp[k] += _data[keys[k]]
              }
            }

            for (let i = 0; i < temp.length; i++) {
              if([0,2,4,6,8,10,12,14,16,18,20].indexOf(i) > -1){
                this.tFooter.push(this.ribuan(temp[i])+'/'+this.ribuan(temp[i+1]))
              }else{
                if([1,3,5,7,9,11,13,15,17,19,21].indexOf(i) < 0){
                  let rp = []
                  this.tFooter.push(rp.indexOf(i) > -1 ? 'Rp '+this.ribuan(temp[i]) : this.ribuan(temp[i]+'|,2'))
                }
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
            this.dataFilter[key] = formData[key]
          }

          this.nama_gudang = formData.nama_gudang

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

      _createPdf(){
        let doc = new jsPDF({ orientation: 'landscape' }), user = JSON.parse(localStorage.user);
        let styles = { fillColor: [255, 255, 255], cellPadding: 0, lineColor: 0 }

        // title
        doc.autoTable(this.pdfHeader(''))
        doc.setDrawColor(0, 0, 0);
        doc.line(10, 31, 287, 31);
        doc.setLineWidth(0.5);
        doc.line(10, 30, 287, 30);
        let header = [['Kode Barang','Nama Barang','Saldo Awal','Pembelian','Mutasi Masuk','Penjualan','Mutasi Keluar','Saldo Akhir','Harga','Nilai Stok']], temp = []

         this.data.forEach((o, i) => {
          temp.push(o.kode_barang)
          temp.push(o.nama_barang)
          temp.push(this.ribuan(o['saldo_awal_qty'])+'/'+ this.ribuan(o['saldo_awal_pcs']))
          temp.push( this.ribuan(o['pembelian_qty'])+'/'+this.ribuan(o['pembelian_pcs']));
          temp.push( this.ribuan(o['mutasi_masuk_qty'])+'/'+this.ribuan(o['mutasi_masuk_pcs']));
          temp.push( this.ribuan(o['penjualan_qty'])+'/'+this.ribuan(o['penjualan_pcs']));
          temp.push( this.ribuan(o['mutasi_keluar_qty'])+'/'+this.ribuan(o['mutasi_keluar_pcs']));
          temp.push( this.ribuan(o['saldo_akhir_qty'])+'/'+this.ribuan(o['saldo_akhir_pcs']));
          temp.push( this.ribuan(o['harga']));
          temp.push( this.ribuan(o['nilai_stock']));

          header.push(temp)
          temp = []
        });

        styles['cellPadding'] = 2;

        doc.autoTable({ // body
          theme: 'grid', styles: styles, margin: { top: 10, left: 10, right: 10 },
          bodyStyles: { valign: "top", fillColor: [255, 255, 255], textColor: [0,0,0], fontSize: 9, lineWidth: .1, lineColor: 1 },
          body: header
        })

        this.pdfDownload([ doc.output() ])
      },

      _createExcel(){
        let dataExcel = []
        for(let i = 0; i < this.data.length; i++){
          let d = this.data[i]
          dataExcel.push({
            'id_gudang': d.id_gudang,
            'nama_gudang': d.nama_gudang,
            'tanggal': d.tanggal,
            'id_stock': d.id_stock,
            'kode_barang': d.kode_barang,
            'nama_barang': d.nama_barang,
            'nama_segmen': d.nama_segmen,
            'saldo_awal_qty': d.saldo_awal_qty,
            'saldo_awal_pcs': d.saldo_awal_pcs,
            'pembelian_qty': d.pembelian_qty,
            'pembelian_pcs': d.pembelian_pcs,
            'mutasi_masuk_qty': d.mutasi_masuk_qty,
            'mutasi_masuk_pcs': d.mutasi_masuk_pcs,
            'adjustment_qty': d.adjustment_qty,
            'adjustment_pcs': d.adjustment_pcs,
            'penjualan_qty': d.penjualan_qty,
            'penjualan_pcs': d.penjualan_pcs,
            'mutasi_keluar_qty': d.mutasi_keluar_qty,
            'mutasi_keluar_pcs': d.mutasi_keluar_pcs,
            'saldo_akhir_qty': d.saldo_akhir_qty,
            'saldo_akhir_pcs': d.saldo_akhir_pcs,
            'harga': d.harga,
            'nilai_stock': d.nilai_stock,
            'nama_brand': d.nama_brand,
            'volume': d.isi
          })
        }
        this.createExcel({data: dataExcel, filename: 'laporan-posisi-stock-'+this.dataFilter.end_date})
      }

  },

  mounted(){
    this.auth = JSON.parse(localStorage.user)
  },

};
</script>
