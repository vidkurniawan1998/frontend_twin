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
                 Laporan KPI
                </h2>
              </div>

              <div class="col-auto">
                <div class="row">
                  <div class="col-auto btn-group">
                    <button class="btn btn-outline-primary ml-3" @click="_createExcel"  :disabled="loading" 
                    v-html="loading ? spin() : ic('download')+' Export Excel'"> </button>
                  </div>
                  <div class="col-auto">
                    <button class="btn btn-white mr-3" v-html="ic('filter')+' Filter'" @click="triggerFilter"> </button>
                    <div class="btn-group">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        <div class="alert alert-info" v-if="!loading">
          <i class="fe fe-info mr-2"></i> Pilih filter untuk memuat KPI
        </div>
        <Skeleton type="table" :length="10" class="mt-3 bg-white" v-if="loading || data_filter.is_filter"/>
        <Nodata v-if="!loading && data_laporan.data.length == 0 && !data_filter.is_filter"/> 
        <div class="box" v-if="!loading && data_laporan.data.length>0 && !data_filter.is_filter" style="overflow: auto;">
          <div class="card">
            <div class="table-responsive">
              <table class="table table-vcenter table-hover card-table table-striped">
                <thead>
                  <th>Depo</th>
                  <th>Tim</th>
                  <th>Principal</th>
                  <th>Brand</th>
                  <th>Qty</th>
                  <th>Penjualan</th>
                  <th>Kunjungan</th>
                  <th>Subtotal</th>
                  <th>Discount</th>
                  <th>DPP</th>
                </thead>
                <template>
                  <tr v-for="(row, i) in data_laporan.data">
                    <td>{{row.nama_depo}}</td>
                    <td>{{row.nama_tim}}</td>
                    <td>{{row.nama_principal}}</td>
                    <td>{{row.nama_brand}}</td>
                    <td>{{row.qty | currency}}</td>
                    <td>{{row.banyak_nota | currency}}</td>
                    <td>{{row.banyak_toko | currency}}</td>
                    <td>{{row.subtotal | currency}} </td>
                    <td>{{(parseFloat(row.discount_rupiah)+parseFloat(row.discount_persen)) | currency}} </td>
                    <td>{{(parseFloat(row.subtotal) - (parseFloat(row.discount_rupiah) + parseFloat(row.discount_persen))) | currency}} </td>
                  </tr>
                </template>
              </table>
            </div>
          </div>
        </div>
     
        <FormFilter/>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
import helper from "@/assets/js/helper.js";
import FormFilter from "./modals/filter.vue";
import { mapState, mapActions, mapMutations } from 'vuex'
export default {
  name: "LaporanKpi",
  components: { FormFilter},
  data() {
    return {
    };
  },
  mixins: [helper],
  computed:{
    ...mapState(['loading']),
    ...mapState('kpi',{
      data_filter  : state => state.data_filter,
      data_laporan : state => state.data_laporan,
    }),
  },
  methods: {
    ...mapActions('kpi', ['getLaporan','triggerFilter']),
    _createExcel(){
      let dataExcel = []
      for (let i = 0; i < this.data_laporan.data.length; i++) {
        let pivot = i+2
        let data  = this.data_laporan.data[i]
        let res   = {
          'Depo'            : data.nama_depo,
          'Tim'             : data.nama_tim,
          'Principal'       : data.nama_principal,
          'Brand'           : data.nama_brand,
          'Qty'             : parseFloat(data.qty),
          'Penjualan'       : parseFloat(data.banyak_nota),
          'kunjungan'       : parseFloat(data.banyak_toko),
          'Subtotal'        : parseFloat(data.subtotal),
          'Discount'        : parseFloat(data.discount_persen)+parseFloat(data.discount_rupiah),
          'DPP'             : {f : 'H'+pivot+'-'+'I'+pivot}
        }
        dataExcel.push(res)
      }
      this.createExcel({data: dataExcel, filename: 'laporan-kpi-'+this.data_filter.start_date+' - '+this.data_filter.end_date})  
    }
  },
  mounted(){
  },
  created(){
  },  
};
</script>
<style scoped="scss">

</style>