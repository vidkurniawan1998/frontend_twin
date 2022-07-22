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
                  Service Level Monitoring
                </h2>
              </div>

              <div class="col-auto">
                <div class="row">
                  <div class="col-auto px-0">

                  </div>

                  <div class="col-auto">
                    <button class="btn btn-white" v-html="ic('filter')+' Filter'"  @click="triggerFilter" > </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
          <Skeleton type="table" :length="10" class="mt-3 bg-white" v-if="loading"/>
          <Nodata v-if="!loading && data_laporan.data.length == 0"/>
          <div class="box" v-if="Object.keys(data_laporan.data).length>0 && !loading">
            <div class="card">
              <div class="table-responsive">
                <table class="table table-vcenter table-hover card-table table-striped table-control">
                  <thead>
                    <tr class="text-muted">
                      <th colspan="2">Total</th>
                      <th style="text-align: center;">Total Waiting</th>
                      <th style="text-align: center;">Total Approved</th>
                      <th style="text-align: center;">Total Loaded</th>
                      <th style="text-align: center;">Total Delivered</th>
                      <th style="text-align: center;">Total Closed</th>
                    </tr>
                    <tr>
                      <td colspan="2"></td>
                      <td style="text-align: center;">
                        <button class="btn btn-warning" style="min-width: 80px; margin-right: 5px;">
                          {{_checkerNull(data_laporan.total.waiting,'total_qty') | currency}}
                        </button>
                        <button class="btn btn-warning" style="min-width: 80px; opacity: 0.7">
                          {{_checkerNull(data_laporan.total.waiting,'total_qty_pcs') | currency}}
                        </button>
                      </td>
                      <td style="text-align: center;">
                        <button class="btn btn-success" style="min-width: 80px; margin-right: 5px;">
                          {{_checkerNull(data_laporan.total.approved,'total_qty') | currency}}
                        </button>
                        <button class="btn btn-success" style="min-width: 80px; opacity: 0.7">
                          {{_checkerNull(data_laporan.total.approved,'total_qty_pcs') | currency}}
                        </button>
                      </td>
                      <td style="text-align: center;">
                        <button class="btn btn-secondary" style="min-width: 80px; margin-right: 5px;">
                          {{_checkerNull(data_laporan.total.loaded,'total_qty') | currency}}
                        </button>
                        <button class="btn btn-secondary" style="min-width: 80px; margin-right: 5px;">
                          {{_checkerNull(data_laporan.total.loaded,'total_qty_pcs') | currency}}
                        </button>
                      </td>
                      <td style="text-align: center;">
                        <button class="btn btn-info" style="min-width: 80px; margin-right: 5px;">
                          {{_checkerNull(data_laporan.total.delivered,'total_qty') | currency}}
                        </button>
                        <button class="btn btn-info" style="min-width: 80px; opacity: 0.7">
                          {{_checkerNull(data_laporan.total.delivered,'total_qty_pcs') | currency}}
                        </button>
                      </td>
                      <td style="text-align: center;">
                        <button class="btn btn-danger" style="min-width: 80px; margin-right: 5px;">
                          {{_checkerNull(data_laporan.total.closed,'total_qty') | currency}}
                        </button>
                        <button class="btn btn-danger" style="min-width: 80px; opacity: 0.7">
                          {{_checkerNull(data_laporan.total.closed,'total_qty_pcs') | currency}}
                        </button>
                      </td>
                    </tr>
                    <tr class="bg-light"><th colspan="7"></th></tr>
                    <tr class="text-muted">
                      <th style="text-align: center;">No</th>
                      <th style="text-align: center;">Depo</th>
                      <th style="text-align: center;">Waiting</th>
                      <th style="text-align: center;">Approved</th>
                      <th style="text-align: center;">Loaded</th>
                      <th style="text-align: center;">Delivered</th>
                      <th style="text-align: center;">Closed</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, cop, i) in data_laporan.data">
                      <td>{{i+1}}</td>
                      <td>{{cop}}</td>
                      <td style="text-align: center;">
                        <button class="btn" style=" min-width: 160px; ">
                          {{_convertData(row,'waiting')}}
                        </button>
                      </td>
                      <td style="text-align: center;">
                        <button class="btn" style=" min-width: 160px; ">
                          {{_convertData(row,'approved')}}
                        </button>
                      </td>
                      <td style="text-align: center;">
                        <button class="btn" style=" min-width: 160px; ">
                          {{_convertData(row,'loaded')}}
                        </button>
                      </td>
                      <td style="text-align: center;">
                        <button class="btn" style=" min-width: 160px; ">
                          {{_convertData(row,'delivered')}}
                        </button>
                      </td>
                      <td style="text-align: center;">
                        <button class="btn" style=" min-width: 160px; ">
                          {{_convertData(row,'closed')}}
                        </button>
                      </td>
                    <tr/>
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

import jsPDF from "jspdf";
import "jspdf-autotable";

export default {
  name: "ServiceLevelMonitoring",
  components: { FormFilter },

  data() {
    return {
    };
  },

  mixins: [helper],

  computed: {
    ...mapState(['loading']),
    ...mapState('service_level', {
      data_filter  : state => state.data_filter,
      data_laporan : state => state.data_laporan,
    }), 
  },
  methods: {
      ...mapActions('service_level', ['triggerFilter','getLaporan']),
      _checkerNull(data,params){
        let res = {...data}
            res = res[params] ? res[params] : 0
        return res
      },
      _convertData(data, params){
        let res     = {...data}
            res     = res[params] ? res[params] : 0
        let qty     = res[0] ? res[0].total_qty ? res[0].total_qty : 0 : 0
        let qty_pcs = res[0] ? res[0].total_qty_pcs ? res[0].total_qty_pcs : 0 : 0
        return res[0] ? this.ribuan(qty)+' / '+this.ribuan(qty_pcs) : '0 / 0'
      },
  },
  created(){
      
  },

  mounted(){
    this.auth = JSON.parse(localStorage.user)
    this.getLaporan()
  },

};
</script>
