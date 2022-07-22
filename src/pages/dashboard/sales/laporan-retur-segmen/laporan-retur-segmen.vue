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
                  Laporan Retur Segmen
                </h2>
              </div>

              <div class="col-auto">

                 <div class="row">
                  <div class="col-auto">
                    <button class="btn btn-white" v-html="ic('filter')" @click="data_filter.form=true"> </button>
                    <button class="btn btn-primary ml-3" v-html="ic('download')+' Export PDF'" @click="exportPDF()"> </button>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <Skeleton type="table" :length="10" class="mt-3 bg-white" v-if="loading"/>

          <div class="alert alert-info" v-if="!loading">
            <i class="fe fe-info mr-2"></i> Pilih filter untuk memuat data Retur Segmen<!--  <br>{{data_laporan}} -->
          </div>
          <Nodata v-if="!loading && data_laporan.data.length == 0"/> 

          <div class="text-center" v-if="!loading && data_laporan.data.length > 0">

            <div class="card">
              <div class="table-responsive">
                <table class="table table-vcenter table-hover card-table table-striped table-control">
                  <thead>
                    <tr class="text-muted">
                      <th colspan="2"></th>
                      <th>Kode</th>
                      <th>Qty (Dus/Pcs)</th>
                      <th>Harga</th>
                      <th>Sub Total</th>
                      <th>Disc</th>
                      <th>Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    <template v-for="(row, i) in data_laporan.data">
                      <tr style="text-align: left;"  class="bg-light"  v-if="row.tipe=='banner'">
                        <th>{{row.banner}}</th>
                        <th colspan="8"><span style="text-transform: uppercase;" >: {{row.banner_val}}</span>
                        </th>
                      </tr>
                      <tr v-else>
                        <td></td>
                        <td style="text-align: left;">{{ row.item_code}}</td>
                        <td>{{ row.nama_barang }}</td>
                        <td>{{row.qty_dus | currency}} / {{row.qty_pcs | currency}}</td>
                        <td>{{row.harga | currency}}</td>
                        <td>{{row.subtotal | currency}}</td>
                        <td>{{row.disc_nominal | currency}}</td>
                        <td>{{(row.subtotal-row.disc_nominal) | currency}}</td>
                      <tr/>
                   </template>
                   <template>
                    <tr class="bg-light"><td colspan="8"></td></tr>
                     <tr>
                       <td colspan="3" style="text-align: right; font-size: 18px; font-weight: 700;">
                         <b>Grand Total</b>
                       </td>
                       <td>{{data_grand_total['qty_pcs']| currency }} / {{data_grand_total['qty_dus']| currency }}</td>
                        <td>{{data_grand_total['harga']| currency }}</td> 
                       <td>{{data_grand_total['subtotal']| currency }}</td>
                       <td>{{data_grand_total['disc_nominal']| currency }}</td>
                       <td>{{(data_grand_total['subtotal']-data_grand_total['disc_nominal'])| currency }}</td>
                     </tr>
                   </template>
                  </tbody>
                </table>
              </div>
            </div>
                
          </div> 
        </div>
      </div>


    <FormFilter/> 
    </div>

  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import $axios from "@/api";
import helper from "@/assets/js/helper.js";
import FormFilter from "./modals/filter.vue";
export default {
  name: "LaporanReturSegmen",
  components: { FormFilter },
  mixins: [helper],
  computed:{
    ...mapState(['loading']),
    ...mapState('retur_segmen', {
      data_filter : state => state.data_filter,
      data_laporan : state => state.data_laporan,
      data_grand_total : state => state.data_grand_total,
    }),
  },
  data(){
    return{
      data_print : {},
    }
  },

  methods:{
    ...mapActions('retur_segmen', ['getLaporan']),
    exportPDF(){
      let data             = this.data_print;
          data.filter      = this.data_filter;
          data.laporan     = this.data_laporan.data;
          data.grand_total = this.data_grand_total;
      if (localStorage.getItem("retur_segmen") === null) {
          localStorage.retur_segmen = JSON.stringify(data);
      }else
      {
        localStorage.removeItem('retur_segmen');
        localStorage.retur_segmen = JSON.stringify(data);
      }
      localStorage.retur_segmen = JSON.stringify(data);
      if(this.data_laporan.data.length>0){
        window.open(window.location.origin+'/dashboard/sales/print-retur-segmen', '_blank');
      }
    },
  },
  created(){
    this.getLaporan();
  },
};
</script>
