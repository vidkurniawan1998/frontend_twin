<template>
  <div class="antialiased">

    <Sidebar/>


    <div class="page">

      <Header @keyup="" id="keyword" hint="Ketik nama barang"/>

      <div class="content">
        <div class="container">
          <!-- Page title -->
          <div class="page-header">
            <div class="row d-flex justify-content-between">
              <div class="col-auto">
                <h2 class="page-title">Posisi Stock Gudang</h2>
              </div>

              <!-- <div class="col-auto">
                <div class="text-muted text-h5 mt-2">Login Pada {{auth.logged_at}}</div>
              </div> -->

              <div class="col-auto">
                <div class="row">
                  <div class="col-auto px-0">

                  </div>

                  <div class="col-auto">
                    <button class="btn btn-white" v-html="ic('filter')+' Filter'" @click="triggerFilter"> </button>
                    <button class="btn btn-primary ml-3" :disabled="data_laporan.length == 0" v-html="ic('download') + ' Export Excel'" @click="_createExcel"></button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        

          <Skeleton type="table" :length="10" class="mt-3 bg-white" v-if="loading" />

          <div class="alert alert-info" v-if=" !loading && data_laporan.data.length == 0">
            <i class="fe fe-info mr-2"></i> Pilih filter untuk memuat data Posisi Stock
          </div>
          <Nodata v-if="!loading && data_laporan.data.length == 0 " />

          <div class="box" v-if="!loading && data_laporan.data.length > 0">
            <div class="card">
              <div class="table-responsive">
                <table class="table table-vcenter table-hover card-table table-striped table-no-break">
                  <thead>
                    <tr class="text-muted">
                      <th>No</th>
                      <th>Gudang</th>
                      <th>Kode Barang</th>
                      <th>Nama Barang</th>
                      <th>Stock Awal</th>
                      <th>Pembelian</th>
                      <th>Mutasi Masuk</th>
                      <th>Adjustment</th>
                      <th>Mutasi Keluar</th>
                      <th>Deliver</th>
                      <th>Retur</th>
                      <th>Stock Akhir</th>
                    </tr>
                  </thead>
                  <tbody> 
                    <tr v-for="(row, i) in data_laporan.data" :key="i">
                      <td>{{ i + 1 }}</td>
                      <td>{{row.nama_gudang}}</td>
                      <td>{{row.kode_barang}}</td>
                      <td>{{row.nama_barang}}</td>
                      <td>{{row.saldo_awal_qty+'/'+row.saldo_awal_pcs}}</td>
                      <td>{{row.qty_penerimaan+'/'+row.qty_pcs_penerimaan}}</td>
                      <td>{{row.qty_mutasi_masuk+'/'+row.qty_pcs_mutasi_masuk}}</td>
                      <td>{{row.qty_adjustment+'/'+row.qty_pcs_adjustment}}</td>
                      <td>{{row.qty_mutasi_keluar+'/'+row.qty_pcs_mutasi_keluar}}</td>
                      <td>{{row.qty_deliver+'/'+row.qty_pcs_deliver}}</td>
                      <td>{{row.qty_retur+'/'+row.qty_pcs_retur}}</td>
                      <td>{{row.saldo_akhir_qty+'/'+row.saldo_akhir_pcs}}</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colspan="4">Total</td>
                      <td>{{data_laporan.total.saldo_awal_qty+'/'+data_laporan.total.saldo_awal_pcs}}</td>
                      <td>{{data_laporan.total.qty_penerimaan+'/'+data_laporan.total.qty_pcs_penerimaan}}</td>
                      <td>{{data_laporan.total.qty_mutasi_masuk+'/'+data_laporan.total.qty_pcs_mutasi_masuk}}</td>
                      <td>{{data_laporan.total.qty_adjustment+'/'+data_laporan.total.qty_pcs_adjustment}}</td>
                      <td>{{data_laporan.total.qty_mutasi_keluar+'/'+data_laporan.total.qty_pcs_mutasi_keluar}}</td>
                      <td>{{data_laporan.total.qty_deliver+'/'+data_laporan.total.qty_pcs_deliver}}</td>
                      <td>{{data_laporan.total.qty_retur+'/'+data_laporan.total.qty_pcs_retur}}</td>
                      <td>{{data_laporan.total.saldo_akhir_qty+'/'+data_laporan.total.saldo_akhir_pcs}}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>

    <FormFilter/>

  </div>
</template>

<script>
import helper from "@/assets/js/helper.js";
import FormFilter from "./modals/filter.vue";
import { mapState, mapActions, mapMutations } from 'vuex';

export default {
  name: "LaporanPosisiStockMitra",
  components: { FormFilter },

  data() {
    return {
    };
  },

  mixins: [helper],

  computed:{
    ...mapState(['loading']),
    ...mapState('posisi_stock_mitra', {
      data_filter  : state => state.data_filter,
      data_laporan : state => state.data_laporan,
    }),
  },

  methods: {
    ...mapActions('posisi_stock_mitra', ['triggerFilter','getLaporan']),
    _getStockAkhir(data) {
      return data.stock_awal+data.penerimaan_barang+data.mutasi_masuk+data.adjustment-data.mutasi_keluar+data.penjualan+data.retur
    },
    _numColumn(num){
      let s = '', t;
      while (num > 0) {
        t = (num - 1) % 26;
        s = String.fromCharCode(65 + t) + s;
        num = (num - t)/26 | 0;
      }
      return s || undefined;
    },
    _createExcel() {
      let data  = [...this.data_laporan.data]
      let res   = {}
      let n     = 0
      for (let key of Object.keys(data[0])) {
        n++
        let cell = this._numColumn(n)
        res[key] = n<6 ? '' : {f: 'SUM('+cell+'2:'+cell+(data.length+1)+')'}
      }
      data.push(res)
      this.createExcel({
        data: data,
        filename: "posisi-stock-gudang-mitra" + this.data_filter.end_date,
      });
    },

  },

  mounted() {
    this.auth = JSON.parse(localStorage.user);
    //this._get();
  },
};
</script>
