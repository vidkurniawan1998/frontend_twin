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
                  Ranking Barang
                </h2>
              </div>

              <div class="col-auto">
                <div class="row">

                  <!-- <div class="col-auto px-0">
                    <div class="input-icon">
                      <span class="input-icon-addon"> <i class="fe fe-align-left"></i> </span>
                      <select class="form-control" v-model="data_filter.per_page" @change="getLaporan()" :disabled="loading">
                        <option :value="num" v-for="(num, i) in [10,50,100,999]" :key="i" v-html="num === 999 ? 'Semua' : num"/>
                      </select>
                    </div>
                  </div> -->

                  <div class="col-auto">
                    <button class="btn btn-white mr-3" v-html="ic('filter')+' Filter'" @click="data_filter.form=true"> </button>
                    <div class="btn-group">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        <div class="alert alert-info" v-if="!loading">
          <i class="fe fe-info mr-2"></i> Pilih filter untuk memuat Ranking Barang
        </div>
        <Skeleton type="table" :length="10" class="mt-3 bg-white" v-if="loading || data_filter.is_filter"/>
        <Nodata v-if="!loading && data_item.data.length == 0 && !data_filter.is_filter"/> 
        <div class="box" v-if="!loading && data_item.data.length>0 && !data_filter.is_filter" style="overflow: auto;">
            <div class="card">
              <div class="table-responsive">
                <table class="table table-vcenter table-hover card-table table-striped">
                  <thead>
                    <th style="min-width: 150px;">Kode Barang</th>
                    <th style="min-width: 200px;">Barang</th>
                    <th v-for="(row, i) in data_depo.data" :key="i">{{row.nama_depo}}</th>
                    <th style="text-align: center;">Qty</th>
                    <th style="text-align: right;">Grand Total</th>
                  </thead>
                  <template v-for="(row, i) in data_item.data">
                    <tr v-if="row.brand_section">
                      <td colspan="2">{{row.brand_section}}</td>
                      <td :colspan="data_depo.data.length+2"></td>
                    </tr>
                    <tr v-else class="bg-light">
                      <td @click="_getDetailRanking(row)">{{row.kode_barang}}</td>
                      <td>{{row.nama_barang}}</td>
                      <td v-for="(data, j) in data_depo.data" :key="j">
                        {{(data_laporan.data[data.id+'-'+row.id]) | currency}}
                      </td>
                      <td style="text-align: center;">{{data_laporan.qty[row.id]}} </td>
                      <td style="text-align: right;">{{data_laporan.total[row.id] | currency}} </td>
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
  name: "LaporanOmsetToko",
  components: { FormFilter},
  data() {
    return {
    };
  },
  mixins: [helper],
  computed:{
    ...mapState(['loading']),
    ...mapState('ranking_barang',{
      data_filter  : state => state.data_filter,
      data_laporan : state => state.data_laporan,
      data_item    : state => state.data_item,
      data_depo    : state => state.data_depo,
    }),
  },
  methods: {
    ...mapActions('ranking_barang', ['getLaporan']),
    _getDetailRanking(data){
      const url = '/ranking_barang/detail'
      this.axios.get(url, {
        params: {
          id_barang     : data.id,
          start_date    : this.data_filter.start_date,
          end_date      : this.data_filter.end_date,
          id_depo       : this.data_filter.depo.length > 0 ? this.data_filter.depo : null,
          id_salesman   : this.data_filter.id_salesman != '' ? this.data_filter.id_salesman : null,
          id_perusahaan : this.data_filter.id_perusahaan.length > 0 ? this.data_filter.id_perusahaan : null
        }
      }).then((response) => {
        let ranking_barang = {
          data   : data,
          items  : response.data,
          filter : this.data_filter,
        }
        if (localStorage.getItem("rankingBarang") === null) {
          localStorage.rankingBarang = JSON.stringify(ranking_barang)
        }
        else{
          localStorage.removeItem('rankingBarang');
          localStorage.rankingBarang = JSON.stringify(ranking_barang)
        }
        window.open(window.location.origin+'/dashboard/sales/detail-ranking-barang', '_blank')
      }).catch(err => {
        this.onError(err)
      })
    }
  },
  mounted(){
  },
  created(){
    //this.getLaporan();
  },  
};
</script>
<style scoped="scss">

</style>