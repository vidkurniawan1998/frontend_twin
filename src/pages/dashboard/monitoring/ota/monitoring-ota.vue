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
                  Monitoring OTA <br>
                  <span style="font-size: 12px;">Outlet Tidak Aktif</span>
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
          <div class="alert alert-info" v-if="!loading && data_laporan.data.length == 0">
            <i class="fe fe-info mr-2"></i> Pilih filter untuk memuat monitoring ota
          </div>
          <Nodata v-if="!loading && data_laporan.data.length == 0"/>
          <div class="box" v-if="data_laporan.data.length>0 && !loading">
            <div class="card">
              <div class="table-responsive">
                <table class="table table-vcenter table-hover card-table table-striped table-control  table-no-break">
                  <thead class="text-muted">
                    <th>No</th>
                    <th>Supervised</th>
                    <th>Tim</th>
                    <th>Salesman</th>
                    <th>Toko</th>
                    <th>Total STT Terakhir</th>
                    <th>Transaksi Terakhir</th>
                    <th>Tanggal Transaksi</th>
                    <th>Hari Non Aktif</th>
                  </thead>
                  <tbody>
                    <tr v-for="(row, i) in data_laporan.data" :key="i" >
                      <td>{{i+1}}</td>
                      <td>{{row.nama_koordinator}}</td>
                      <td>{{row.nama_tim}}</td>
                      <td>{{row.nama_salesman}}</td>
                      <td>{{row.nama_toko}}</td>
                      <td>{{row.total_stt | currency}}</td>
                      <td>{{row.banyak_transaksi_terakhir}}</td>
                      <td>{{row.tanggal_max}}</td>
                      <td>{{row.hari_non_aktif}} Hari</td>
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
  name: "MonitoringOta",
  components: { FormFilter },

  data() {
    return {
    };
  },

  mixins: [helper],

  computed: {
    ...mapState(['loading']),
    ...mapState('monitoring_ota', {
      data_filter  : state => state.data_filter,
      data_laporan : state => state.data_laporan,
    }), 
  },
  methods: {
      ...mapActions('monitoring_ota', ['triggerFilter','getLaporan']),
      _createExcel(){
        let data_excel = []
        for (let i = 0; i < this.data_laporan.data.length; i++) {
          let d = this.data_laporan.data[i];
          let res = {
            'supervised' : d.nama_koordinator,
            'tim' : d.nama_tim,
            'salesman' : d.nama_salesman,
            'toko' : d.nama_toko,
            'hari tidak transaksi' : d.hari_non_aktif,
            'total transaksi terakhir' : {v: d.total_stt, t: "n", z: "#,##0"},
            'banyak transaksi terakhir' : d.banyak_transaksi_terakhir,
            'tanggal transaksi terakhir' : d.tanggal_max 
          }
          data_excel.push(res)
        }
        this.createExcel({data: data_excel, filename: 'monitoring-ota'})
      }
  },
  created(){
  },

  mounted(){
    this.auth = JSON.parse(localStorage.user)
  },

};
</script>
