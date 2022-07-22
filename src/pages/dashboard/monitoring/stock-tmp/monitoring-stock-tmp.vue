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
                  Monitoring Stock TMP
                </h2>
              </div>

              <div class="col-auto">
                <div class="row">
                  <div class="col-auto px-0">

                  </div>

                  <div class="col-auto">
                    <button class="btn btn-outline-primary ml-3" @click="_createExcel"  :disabled="loading" 
                    v-html="loading ? spin() : ic('download')+' Export Excel'"> </button>
                    <button class="btn btn-white  ml-3" v-html="ic('filter')+' Filter'"  @click="triggerFilter" > </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
          <Skeleton type="table" :length="10" class="mt-3 bg-white" v-if="loading"/>
          <Nodata v-if="!loading && data_laporan.data.length == 0"/>
          <div class="box" v-if="data_laporan.data.length>0 && !loading">
            <div class="card">
              <div class="table-responsive">
                <table class="table table-vcenter table-hover card-table table-striped table-control  table-no-break">
                  <thead>
                    <th>Id Gudang</th>
                    <th>Id Barang</th>
                    <th>Nama Gudang</th>
                    <th>Kode Barang</th>
                    <th>Nama Barang</th>
                    <th>Isi</th>
                    <th>Jenis Gudang</th>
                    <th>Stock Tampungan</th>
                    <th>Posisi Stock</th>
                    <th>Selisih</th>
                  </thead>
                  <tbody>
                    <tr v-for="(row, i) in data_laporan.data"  @click="row.id=0" :style="row.id == 0 ? {'background-color' : '#dcf7d7', 'opacity': 0.8} : ''" >
                       <td><span class="click-able text-primary" @click="_copied(row.id_gudang)">{{row.id_gudang}}</span></td>
                       <td><span class="click-able text-primary" @click="_copied(row.id_barang)">{{row.id_barang}}</span></td>
                       <td><span class="click-able text-primary" @click="_copied(row.nama_gudang)">{{row.nama_gudang}}</span></td>
                       <td><span class="click-able text-primary" @click="_copied(row.kode_barang)">{{row.kode_barang}}</span></td>
                       <td><span class="click-able text-primary" @click="_copied(row.nama_barang)">{{row.nama_barang}}</span></td>
                       <td>{{row.isi}}</td>
                       <td>{{row.jenis_gudang}}</td>
                       <td>{{row.stock_tampungan | currency}}</td>
                       <td>{{row.stock_hitung | currency}}</td>
                       <td>{{_getDeference(row.stock_tampungan,row.stock_hitung,row.isi)}}</td>
                    </tr>
                  </tbody>
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
import {mapActions, mapState} from "vuex";
import FormFilter from "./modals/filter.vue";

export default {
  name: "MonitoringPareto",
  components: { FormFilter },

  data() {
    return {
    };
  },

  mixins: [helper],

  computed: {
    ...mapState(['loading']),
    ...mapState('monitoring_stock_tmp', {
      data_filter  : state => state.data_filter,
      data_laporan : state => state.data_laporan,
    }), 
  },
  methods: {
      ...mapActions('monitoring_stock_tmp', ['triggerFilter','getLaporan']),
      _getDeference(stock_tampungan, stock_hitung, isi){
        let selisih = (stock_tampungan-stock_hitung) * isi
        let qty     = Math.round(selisih/isi)
        let qty_pcs = selisih % isi
        return Math.round(qty)+' / '+Math.round(qty_pcs)
      },
      _createExcel(){
        this.createExcel({data: this.data_laporan.data, filename: 'monitoring-stock-tmp'})
      },
      _copied(data) {
        navigator.clipboard.writeText(data);
        this.toast(data+' tersimpan di clipboard')
      }
  },
  created(){
  },

  mounted(){
    this.auth = JSON.parse(localStorage.user)
    this.getLaporan()
  },

};
</script>
