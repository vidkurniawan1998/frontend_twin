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
                <h2 class="page-title">
                  Laporan Monitoring Stock
                </h2> 
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
                    <button class="btn btn-primary ml-3" :disabled="data_laporan.length == 0" v-html="ic('download')+' Export Excel'" @click="_createExcel"> </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
          <Skeleton type="table" :length="10" class="mt-3 bg-white" v-if="loading"/>

          <Nodata v-if="!loading && data_laporan.length == 0 && data_filter.request"/>
          <div class="alert alert-info" v-if="!data_filter.request && !loading && data_laporan.length == 0">
            <i class="fe fe-info mr-2"></i> Pilih filter untuk memuat monitoring stock
          </div>

          <div class="form-group" v-if="!loading && data_laporan.length>0">
            <div class="row" style="max-width: 600px;">
              <div class="col-6">
                <label class="form-label" for="end-date">Sales Plan</label>
                <input type="text" class="form-control" v-model="parameter_sls" placeholder="Inputkan Sales Plan">
              </div>
              <div class="col-6">
                <label class="form-label" for="end-date">Buffer (hari)</label>
                <input type="text" class="form-control" v-model="buffer" placeholder="Inputkan Buffer (Hari)">
              </div>
            </div>
          </div>
          <div class="box" v-if="!loading && data_laporan.length>0">
              <div class="card">
                <div class="table-responsive">    
                  <table class="table">
                      <tr>
                        <td v-for="(row, i) in data_laporan" style="text-align: center;" v-bind:id="-1-i">
                          <button class="btn" @click="_scrollTo(i)">
                            {{row[1].nama_depo}}
                          </button>
                        </td>
                      </tr>
                  </table>
                </div>
                <div class="table-responsive" id="content" ref="content">
                  <table class="table table-vcenter table-hover card-table">
                      <tr>
                        <template v-for="(row, i) in data_laporan">
                          <td colspan="9" class="bg-white" style="vertical-align: top;" v-bind:id="i">
                          <template v-for="(sub, j) in row">
                           <thead v-if="sub.nama_barang=='header'">
                              <tr>
                                <th colspan="14" style="text-align: center;">
                                  <div style="min-width: 1080px;">
                                    Depo {{row[1].nama_depo}}
                                  </div>
                                </th>
                              </tr>
                              <tr class="text-muted">
                                <th>No</th>
                                <th>Principal</th>
                                <th>Brand</th>
                                <th>Segmen</th>
                                <th>Kode</th>
                                <th>Nama Barang</th>
                                <th>STT/week</th>
                                <th>SAVL</th>
                                <th>Git</th>
                                <th>SCW</th>
                                <th>Buffer</th>
                                <th>Sls PLN</th>
                                <th>PO</th>
                                <th>SCW Akhir</th>
                              </tr>
                           </thead>
                            <tr v-else>
                              <td>{{j}}</td>
                              <td>{{sub.nama_principal}}</td>
                              <td>{{sub.nama_brand}}</td>
                              <td>{{sub.nama_segmen}}</td>
                              <td>{{sub.kode_barang}}</td>
                              <td>{{sub.nama_barang}}</td>
                              <td style="text-align: center;">{{_decimal(sub.stt)}}</td>
                              <td style="text-align: center;">{{_decimal(sub.savl)}}</td>
                              <td style="text-align: center;">0</td>
                              <td style="text-align: center;">{{_decimal(parseFloat(sub.savl)/parseFloat(sub.stt))}}</td>
                              <td style="text-align: center;">{{_decimal(parseFloat(sub.stt)*parseFloat(buffer)/7)}}</td>
                              <td style="text-align: center;">{{_decimal(parseFloat(sub.stt)*parseFloat(parameter_sls))}}</td>
                              <td>
                              {{
                                _decimal(
                                  _convertToZero(
                                    (parseFloat(sub.stt)*parseFloat(buffer)/7)+parseFloat(parseFloat(sub.stt)*parseFloat(parameter_sls))-parseFloat(sub.savl)
                                  )
                                )
                              }}
                              </td>
                              <td style="text-align: center;">
                                {{
                                  _decimal(
                                    (
                                      parseFloat(sub.savl)+
                                      _convertToZero(
                                        (parseFloat(sub.stt)*parseFloat(buffer)/7)+parseFloat(parseFloat(sub.stt)*parseFloat(parameter_sls))-parseFloat(sub.savl)
                                      )
                                    )
                                    /parseFloat(sub.stt)
                                  )
                                }}
                              </td>
                            </tr>
                          </template>
                          </td>
                      </template>
                    </tr>
                    <tfoot>
                      <tr>
                        <td colspan="3">&nbsp</td>
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

import jsPDF from "jspdf";
import "jspdf-autotable";
import XLSX from 'xlsx';

export default {
  name: "LaporanMonitoringStock",
  components: { FormFilter },

  data() {
    return {
      isFilter : false,
      data : [],
      buffer : 0,
      parameter_sls : 1
    };
  },

  mixins: [helper],
  computed:{
    ...mapState(['loading']),
    ...mapState('monitoring_stock', {
      data_filter  : state => state.data_filter,
      data_laporan : state => state.data_laporan  
    }),
  },

  methods: {
      ...mapActions('monitoring_stock', ['triggerFilter','getLaporan']),
      _decimal(num){
        let str = Math.round(num * 100) / 100
        str = str || 0
        str = isFinite(str) ? str : 0
        return str.toString().replace('.',',').replace(' ','')
      },
      _decimalExp(num){
        num = parseFloat(num)
        num = num || 0
        num = isFinite(num) ? num : 0
        return num
      },
      _scrollTo(id){
        document.getElementById(id).scrollIntoView()
        setTimeout(() => {
          document.getElementById(-1-id).scrollIntoView()
          document.getElementById('keyword').scrollIntoView()
        }, 800)
      },
      _convertToZero(num){
        let str = parseFloat(num)
        return str>0 ? str : 0 ;
      },
      _createExcel(){
        var wb          = XLSX.utils.book_new()
        let ws_all_data = [] 
        ws_all_data.push(['Sales Plan', this.parameter_sls])
        ws_all_data.push(['Buffer', this.buffer])
        ws_all_data.push(['Depo','Nama Barang','STT/Week','Stock', 'Git','SCW','Buffer','Sales Plan','PO','SCW Akhir'])
        for (var i = 0; i < this.data_laporan.length; i++) {
          let data = this.data_laporan[i]
          var ws_name = data[1].nama_depo
          let ws_data = []
          ws_data.push(['Sales Plan', this.parameter_sls])
          ws_data.push(['Buffer', this.buffer])
          ws_data.push(['Principal','Brand','Segmen','Scode','Nama Barang','STT/Week','Stock', 'Git','SCW','Buffer','Sales Plan','PO','SCW Akhir'])
          for (var j  = 1; j < data.length; j++) {
            let pivot = j+3
            let sub   = data[j]
            ws_all_data.push([
              sub.nama_depo,
              sub.nama_principal,
              sub.nama_brand,
              sub.nama_segmen,
              sub.kode_barang,
              sub.nama_barang,
              this._decimalExp(sub.stt),
              this._decimalExp(sub.savl),
              0,
              {f : '(H'+pivot+'+I'+pivot+')/'+'G'+pivot},
              {f : '(H'+pivot+'*$B$2)/7'},
              {f : '(G'+pivot+'*$B$1)'},
              {f : 'IF((K'+pivot+'+L'+pivot+'-H'+pivot+')>0,'+'(K'+pivot+'+L'+pivot+'-H'+pivot+')'+',0)'},
              {f : '(H'+pivot+'+I'+pivot+'+M'+pivot+')/'+'G'+pivot},
            ])
            ws_data.push([
              sub.nama_principal,
              sub.nama_brand,
              sub.nama_segmen,
              sub.kode_barang,
              sub.nama_barang,
              this._decimalExp(sub.stt),
              this._decimalExp(sub.savl),
              0,
              {f : '(G'+pivot+'+H'+pivot+')/'+'F'+pivot},
              {f : '(G'+pivot+'*$B$2)/7'},
              {f : '(F'+pivot+'*$B$1)'},
              {f : 'IF((J'+pivot+'+K'+pivot+'-G'+pivot+')>0,'+'(J'+pivot+'+K'+pivot+'-G'+pivot+')'+',0)'},
              {f : '(G'+pivot+'+H'+pivot+'+L'+pivot+')/'+'F'+pivot},
            ])
          }
          var ws     = XLSX.utils.aoa_to_sheet(ws_data)
          var wscols = [
              {wch:70},
              {wch:15},
              {wch:15},
              {wch:5}
          ];

          ws['!cols']       = wscols
          ws['!autofilter'] = {ref:"A3:M"+data.length+2};
          XLSX.utils.book_append_sheet(wb, ws, ws_name) 
        }  
        var ws     = XLSX.utils.aoa_to_sheet(ws_all_data)
        var wscols = [
          {wch:15},
          {wch:70},
          {wch:15},
          {wch:15},
          {wch:5}
        ];

        ws['!cols']       = wscols
        ws['!autofilter'] = {ref:"A3:N"+this.data_laporan.length+2};
        XLSX.utils.book_append_sheet(wb, ws, 'All Depo') 
       XLSX.writeFile(wb, 'laporan-monitoring-stock.xlsx')
      }

  },

  mounted(){
    //this._get();
  },

};
</script>
