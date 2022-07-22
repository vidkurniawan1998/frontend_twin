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
                  Laporan Gross Profit
                </h2>
              </div>
              <div class="col-auto">
                <div class="row">
                  <div class="col-auto px-0">

                  </div>

                  <div class="col-auto">
                    <button class="btn btn-white" v-html="ic('filter')+' Filter'" @click="triggerFilter"> </button>
                    <button class="btn btn-outline-primary ml-3" @click="_createExcel"  :disabled="loading" 
                    v-html="loading ? spin() : ic('download')+' Export Excel'"> </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
          <Skeleton type="table" :length="10" class="mt-3 bg-white" v-if="loading"/>
          <div>
            <div class="alert alert-info" v-if="!data_filter.request && !loading">
              <i class="fe fe-info mr-2"></i> Pilih filter untuk memuat data Retur Penjualan
            </div>
            <Nodata v-if="!loading && data_laporan.data.length == 0 && data_filter.request"/>
            <div class="box" v-if="!loading && data_filter.request && data_laporan.data.length > 0">

              <div class="card">
                <div class="table-responsive">
                  <table class="table table-vcenter table-hover card-table table-striped table-control">
                    <thead>
                      <tr class="text-muted" style="white-space: nowrap">
                        <template v-for="(cop, i) in data_laporan.tipe_group">
                          <th>{{'Nama '+cop}}</th>
                          <th v-if="typeof data_laporan.data[0]['kode_'+cop.toLowerCase()] != 'undefined'">{{'Kode '+cop}}</th>
                        </template>
                        <th>Subtotal Penjualan</th>
                        <th>Disc Persen</th>
                        <th>Disc Rupiah</th>
                        <th>Disc Total</th>
                        <th>Retur Penjualan</th>
                        <th>DPP</th>
                        <th>Subtotal Pembelian</th>
                        <th>Retur Stock</th>
                        <th>Retur BS</th>
                        <th>Retur Baik</th>
                        <th>HPP</th>
                        <th>Gross Profit</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(row, i) in data_laporan.data">
                        <template v-for="(cop, j) in data_laporan.tipe_group">
                          <td>{{data_laporan.data[i]['nama_'+cop.toLowerCase()]}}</td>
                          <td v-if="typeof data_laporan.data[i]['kode_'+cop.toLowerCase()] != 'undefined'">
                          {{data_laporan.data[i]['kode_'+cop.toLowerCase()]}}
                        </td>
                        </template>
                        <td>{{row.subtotal_penjualan | currency}}</td>
                        <td>{{row.disc_persen_penjualan | currency}}</td>
                        <td>{{row.disc_rupiah_penjualan | currency}}</td>
                        <td>{{parseFloat(row.disc_persen_penjualan)+parseFloat(row.disc_rupiah_penjualan) | currency}}</td>
                        <td>{{row.subtotal_retur_penjualan | currency}}</td>
                        <td>{{_dpp(row) | currency}}</td>
                        <td>{{row.subtotal_pembelian | currency}}</td>
                        <td>{{row.subtotal_retur_stock | currency}}</td>
                        <td>{{row.subtotal_retur_stock_bs | currency}}</td>
                        <td>{{row.subtotal_retur_stock_non_bs | currency}}</td>
                        <td>{{_hpp(row) | currency}}</td> 
                        <td>{{row.dpp - row.hpp | currency}}</td>
                      <tr/>
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
        ...mapState('gross_profit', {
          data_filter  : state => state.data_filter,
          data_laporan : state => state.data_laporan,
        }),
      },
      methods: {
        ...mapActions('gross_profit', ['triggerFilter','getLaporan']),
        _numColumn(num){
          let s = '', t;
          while (num > 0) {
            t = (num - 1) % 26;
            s = String.fromCharCode(65 + t) + s;
            num = (num - t)/26 | 0;
          }
          return s || undefined;
        },
        _dpp(data){
          return data.dpp = parseFloat(data.subtotal_penjualan)
                -parseFloat(data.disc_persen_penjualan)
                -parseFloat(data.disc_rupiah_penjualan)
                -parseFloat(data.subtotal_retur_penjualan)
        },
        _hpp(data){
          return data.hpp = parseFloat(data.subtotal_pembelian)
                -parseFloat(data.subtotal_retur_stock)
        },
        _createExcel(){
          let dataExcel = [];
          let pivot = 1
          let data  = [...this.data_laporan.data]
          for (var i = 0; i < data.length; i++) {
            let row  = data[i]
            let res  = {}
            let cell = 5 
            pivot++

            if(this.data_filter.tipe_group.length>0){
              for (var j = 0; j < this.data_filter.tipe_group.length; j++) {
                let tipe = this.data_filter.tipe_group[j]
                res[tipe] = row['nama_'+tipe.toLowerCase()]
                if(typeof row['kode_'+tipe.toLowerCase()] != 'undefined'){
                  res['Kode '+tipe] = row['kode_'+tipe.toLowerCase()]
                  cell++
                } 
                cell++
              }
            }

            res['Subtotal Penjualan'] = {v: parseFloat(row.subtotal_penjualan), t: "n", z: "#,##0"}
            res['Disc Persen']        = {v: parseFloat(row.disc_persen_penjualan), t: "n", z: "#,##0"}
            res['Disc Rupiah']        = {v: parseFloat(row.disc_rupiah_penjualan), t: "n", z: "#,##0"}
            res['Retur Penjualan']    = {v: parseFloat(row.subtotal_retur_penjualan), t: "n", z: "#,##0"}
            res['DPP']                = {f: this._numColumn(cell-4)+pivot+'-'+
                                            this._numColumn(cell-3)+pivot+'-'+
                                            this._numColumn(cell-2)+pivot+'-'+
                                            this._numColumn(cell-1)+pivot, t: "n", z: "#,##0"}
            res['Subtotal Pembelian'] = {v: parseFloat(row.subtotal_pembelian), t: "n", z: "#,##0"}
            res['Retur Stock']        = {v: parseFloat(row.subtotal_retur_stock), t: "n", z: "#,##0"}
            res['Retur Bad Stock']    = {v: parseFloat(row.subtotal_retur_stock_bs), t: "n", z: "#,##0"}
            res['Retur Non Bad Stock']= {v: parseFloat(row.subtotal_retur_stock_non_bs), t: "n", z: "#,##0"}
            res['HPP']                = {f: this._numColumn(cell+1)+pivot+'-'+
                                            this._numColumn(cell+2)+pivot, t: "n", z: "#,##0"}
            res['Gross Profit']       = {f: this._numColumn(cell)+pivot+'-'+
                                            this._numColumn(cell+5)+pivot, t: "n", z: "#,##0"}
            res['Persentase']         = {f: 'IFERROR('+this._numColumn(cell+6)+pivot+'/'+
                                            this._numColumn(cell)+pivot+',0)', z: '0.00%'}

            //DEBUG
            // res['ID Barang']     = row.id_barang
            // res['ID Segmen']     = row.id_segmen
            // res['ID Brand']      = row.id_brand
            // res['ID Principal']  = row.id_principal
            // res['ID Toko']       = row.id_toko
            // res['ID Tim']        = row.id_tim
            // res['ID Depo']       = row.id_depo
            // res['ID Perusahaan'] = row.id_perusahaan

            dataExcel.push(res)
          }
          this.createExcel({data: dataExcel, 
          filename: 'laporan-gross-profit-'+this.data_filter.start_date+' - '+this.data_filter.end_date},
          false)
        },
      },

      mounted(){

      },

    }
  </script>
