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
                  Laporan Pembagian Promo
                </h2>
              </div>
              <div class="col-auto">
                <div class="row">
                  <div class="col-auto px-0">

                  </div>

                  <div class="col-auto">
                    <button class="btn btn-white" v-html="ic('filter')+' Filter'" @click="triggerFilter"> </button>
                  </div>
                  <!--button & option-->
                  <div class="col-auto">
                    <button class="btn btn-primary mr-3" @click="_createExcel()" v-html="ic('download')+' Export Excel'"/>
                  </div>
                </div>

              </div>
            </div>
          </div>
          <Skeleton type="table" :length="10" class="mt-3 bg-white" v-if="loading"/>
          <div>
            <div class="alert alert-info" v-if="!data_filter.request && !loading">
              <i class="fe fe-info mr-2"></i> Pilih filter untuk memuat data pembagian promo
            </div>
            <Nodata v-if="!loading && data_laporan.data.length == 0 && data_filter.request"/>
            <div class="box" v-if="!loading && data_laporan.data.length > 0">
              <div class="card">
                <div class="table-responsive">
                  <table class="table table-vcenter table-hover card-table table-striped table-control">
                    <thead>
                      <tr class="text-muted">
                        <th width="20%" rowspan="2" class="text-center v-center">Barang</th>
                        <th width="20%" rowspan="2" class="text-center v-center">Promo</th>
                        <th width="20%" rowspan="2" class="text-center v-center">Depo</th>
                        <th rowspan="2" class="text-center">Qty</th>
                        <th rowspan="2" class="text-center">Subtotal</th>
                        <th colspan="4" class="text-center">Disk. Persen</th>
                        <th colspan="2" class="text-center">Disk. Rupiah</th>
                        <th colspan="2" class="text-center">Total</th>
                      </tr>
                      <tr>
                        <th>Distributor</th>
                        <th>(%)</th>
                        <th>Principal</th>
                        <th>(%)</th>
                        <th>Distributor</th>
                        <th>Principal</th>
                        <th>Distributor</th>
                        <th>Principal</th>
                      </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(row, i) in data_laporan.data"
                          v-bind:style="{
                            'background-color'  : row.extra == 1 ? 'rgba(53, 64, 82, 0.1)' : '',
                            'color'             : row.extra == 1 && !row.kode_barang.includes('EXT') ? 'red' : ''
                          }" :key="i">
                          <td>{{row.kode_barang+' - '+row.nama_barang}}</td>
                          <td><span v-if="row.no_promo!=''" class="text-primary">{{row.no_promo}}<br></span>{{row.nama_promo}}</td>
                          <td>{{row.nama_perusahaan+' - '+row.nama_depo}}</td>
                          <td class="text-center">{{row.qty | currency}}</td>
                          <td class="text-center">{{row.subtotal|currency}}</td>
                          <td style="text-align: right;">
                            {{row.disc_persen_distributor | currency}}
                          </td>
                          <td style="max-width: 100px;">
                            {{row.persentase_distributor*100 | currency}}%
                          </td>             
                          <td style="text-align: right;">
                            {{row.disc_persen_principal | currency}}
                          </td>
                          <td style="max-width: 100px;">
                            {{row.persentase_principal*100 | currency}}%
                          </td>
                          <td class="text-center">
                            {{row.disc_rupiah_distributor | currency}}
                          </td> 
                          <td class="text-center">  
                            {{row.disc_rupiah_principal | currency}}
                          </td>
                          <td class="text-center">
                            {{row.disc_rupiah_distributor+row.disc_persen_distributor | currency}}
                          </td> 
                          <td class="text-center">  
                            {{row.disc_rupiah_principal+row.disc_persen_distributor | currency}}
                          </td>  
                        </tr>
                    </tbody>
                  </table>
                </div>
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
    export default {
      name: "LaporanGrossProfit",
      components: { FormFilter },
      data() {
        return {
        };
      },
      mixins: [helper],
      computed: {
        ...mapState(['loading']),
        ...mapState('pembagian_promo', {
          data_filter  : state => state.data_filter,
          data_laporan : state => state.data_laporan,
        }),
      },
      methods: {
        ...mapActions('pembagian_promo', ['triggerFilter','getLaporan']),
        _getDiscPersen(data, params){
          let paramsArr         = params.split('_')
          let subtotal          = data.subtotal
          let disc_distributor  = 0
          let disc_principal    = 0
          for (var i = 1; i <= 6; i++) {
            let res     = subtotal*parseFloat(data['disc_'+i])/100
            disc_distributor  = i<=4 ? disc_distributor+res : disc_distributor
            disc_principal    = i>4  ? disc_principal+res : disc_principal
            subtotal          -= res
          }
          let disc_all = disc_principal+disc_distributor
          let res      = paramsArr[0] == 'distributor' ? disc_distributor : disc_principal
              res      = paramsArr[1] == 'persen' ? res/disc_all*100 : res
              res      = res || 0
          return res
        },
        _getDiscRupiah(data, params){
          return parseFloat(data.disc_rupiah)*parseFloat(data.qty)*parseFloat(data.disc_rupiah_distributor)/(parseFloat(data.disc_rupiah_distributor)+parseFloat(data.disc_rupiah_principal))
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
        _createExcel(){
          let dataExcel           = []
          let pivot               = 1
          for (var i = 0; i < this.data_laporan.data.length; i++) {
            pivot++
            let data = this.data_laporan.data[i]
            dataExcel.push({
              'Barang'      : data.nama_barang,
              'Kode Barang' : data.kode_barang,
              'Promo'       : data.nama_promo,
              'Qty'         : {v: data.qty, t:'n'},
              'Subtotal'    : {v: data.subtotal, t: 'n'}
            })
            let cell_distributor = ''
            let cell_principal   = ''
            for (var j  = 1; j <= 6; j++) {
              let input = '('
              for (var m = 0; m < j; m++) {
                let cell  = this._numColumn(5+(m*2))+pivot
                input = m == 0 ? input+cell : input+'-'+cell
              }
              input = input+')*'+this._numColumn(5+((j-1)*2)+1)+pivot
              dataExcel[i]['disc_'+j]        = {v : data['disc_'+j]/100, t:'n', z: '0.00%'}
              dataExcel[i]['disc_'+j+'_val'] = {f : input}

              cell_distributor  =  j<=5 ? j == 1 ? this._numColumn(5+(j*2))+pivot 
                                : cell_distributor+'+'+this._numColumn(5+(j*2))+pivot : cell_distributor
              cell_principal    =  j>5 ? j == 6 ? this._numColumn(5+(j*2))+pivot 
                                : cell_principal+'+'+this._numColumn(5+(j*2))+pivot : cell_principal
            }
            dataExcel[i]['disc_rupiah']                       = {v: data.disc_rupiah, t: 'n'}
            dataExcel[i]['disc_rupiah_distributor / carton']  = {v: data.disc_rupiah_distributor_carton, t: 'n'}
            dataExcel[i]['disc_rupiah_principal  / carton']   = {v: data.disc_rupiah_principal_carton, t: 'n'}
            dataExcel[i]['disc_persen_distributor']           = {f: cell_distributor}
            dataExcel[i]['disc_persen_pricipal']              = {f: cell_principal}
            dataExcel[i]['disc_rupiah_distributor']           = {f : 'IFERROR(D'+pivot+'*R'+pivot+'*S'+pivot+'/(S'+pivot+'+T'+pivot+'),0)'}
            dataExcel[i]['disc_rupiah_principal']             = {f : 'IFERROR(D'+pivot+'*R'+pivot+'*T'+pivot+'/(S'+pivot+'+T'+pivot+'),0)'}
            dataExcel[i]['disc_total_distributor']            = {f : 'U'+pivot+'+W'+pivot}
            dataExcel[i]['disc_total_principal']              = {f : 'V'+pivot+'+X'+pivot}
            dataExcel[i]['Kode Promo']                        = data.no_promo
            dataExcel[i]['Perusahaan']                        = data.nama_perusahaan
            dataExcel[i]['Depo']                              = data.nama_depo
          }
          this.createExcel({data: dataExcel, 
          filename: 'laporan-pembagian-promo '+this.data_filter.start_date+' - '+this.data_filter.end_date},
          false)
        }
      },
      mounted(){
      },
    };
  </script>