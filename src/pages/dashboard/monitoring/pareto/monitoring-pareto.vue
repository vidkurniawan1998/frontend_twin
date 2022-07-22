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
                  Monitoring Pareto
                </h2>
              </div>

              <div class="col-auto">
                <div class="row">
                  <div class="col-auto px-0">

                  </div>

                  <div class="col-auto">
                    <button class="btn btn-outline-primary ml-3" @click="_createExcel"  :disabled="loading || data_filter.request" 
                    v-html="data_filter.request || loading ? spin() : ic('download')+' Export Excel'"> </button>
                    <button class="btn btn-white  ml-3" v-html="ic('filter')+' Filter'"  @click="triggerFilter" > </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
          <Skeleton type="table" :length="10" class="mt-3 bg-white" v-if="loading && data_filter.request"/>
          <div class="alert alert-info" v-if="!data_filter.request && !loading && data_laporan.data.length == 0">
            <i class="fe fe-info mr-2"></i> Pilih filter untuk memuat monitoring pareto
          </div>
          <Nodata v-if="!loading && !data_filter.request && data_laporan.data.length == 0"/>
          <div class="box" v-if="data_laporan.data.length>0 && !loading && !data_filter.request">
            <div class="card">
              <div class="table-responsive">
                <table class="table table-vcenter table-hover card-table table-striped table-control  table-no-break">
                    <tr class="text-muted">
                      <td rowspan="2">Tim</td>
                      <td rowspan="2">Salesman</td>
                      <td rowspan="2">Kode Outlet</td>
                      <td rowspan="2">Outler</td>
                      <td :colspan="data_laporan.barang.length" style="text-align: center;">Value Before</td>
                      <td :colspan="data_laporan.barang.length" style="text-align: center;">Value After</td>
                      <td :colspan="data_laporan.barang.length" style="text-align: center;">Growth</td>
                    </tr>
                    <tr class="text-muted">
                      <td v-for="(row, i) in data_laporan.barang" style="text-align: center;" :key="i" >{{row.kode_barang}}</td>
                      <td v-for="(row, i) in data_laporan.barang" style="text-align: center;" :key="i">{{row.kode_barang}}</td>
                      <td v-for="(row, i) in data_laporan.barang" style="text-align: center;" :key="i">{{row.kode_barang}}</td>
                    </tr>
                  <tbody>
                    <tr v-for="(row, i) in data_laporan.data"  :key="i"
                        v-bind:style="
                        row.tipe == 'total_other' ? {'background-color': '#fffbed'} : 
                        row.tipe == 'total_pareto' ? {'background-color' : '#fffbed'} : 
                        row.tipe == 'total_all' ? {'background-color' : '#deeaf6'} :
                        {'background-color' : 'white'} ">
                      <td>{{row.nama_tim}}</td>
                      <td>{{row.nama_salesman}}</td>
                      <td>{{row.kode_toko}}</td>
                      <td>{{row.nama_toko}}</td>
                      <td v-for="(sub, j) in data_laporan.barang" style="text-align: center;" :key="j">{{row['total_before_'+sub.id] | currency}}</td>
                      <td v-for="(sub, j) in data_laporan.barang" style="text-align: center;" :key="j">{{row['total_after_'+sub.id] | currency}}</td>
                      <td v-for="(sub, j) in data_laporan.barang" style="text-align: center;" :key="j">{{row['growth_'+sub.id] ? row['growth_'+sub.id] * 100 : 0 | currency}}%</td>
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
    ...mapState('monitoring_pareto', {
      data_filter  : state => state.data_filter,
      data_laporan : state => state.data_laporan,
    }), 
  },
  methods: {
      ...mapActions('monitoring_pareto', ['triggerFilter','getLaporan']),
      _createExcel(){
        let data_excel = []
        for (var i = 0; i < this.data_laporan.data.length; i++) {
          let data = this.data_laporan.data[i]
          let res  = {
            'TIM'        : data.nama_tim,
            'SALESMAN'   : data.nama_salesman,
            'TOKO'       : data.nama_toko
          }
          for (var j = 0; j < this.data_laporan.barang.length; j++) {
            let barang = this.data_laporan.barang[j]
            res[barang.kode_barang+' BEFORE'] = {v: parseFloat(data['total_before_'+barang.id]), t: "n", z: "#,##0"}
            res[barang.kode_barang+' AFTER']  = {v: parseFloat(data['total_after_'+barang.id]), t: "n", z: "#,##0"}
            res[barang.kode_barang+' GROWTH'] = {v: parseFloat(data['growth_'+barang.id]), t: "n", z: '0%'}
          }
          data_excel.push(res)
        }
        this.createExcel({data: data_excel, filename: 'monitoring-pareto'})
      }
  },
  created(){
  },

  mounted(){
    this.auth = JSON.parse(localStorage.user)
  },

};
</script>
