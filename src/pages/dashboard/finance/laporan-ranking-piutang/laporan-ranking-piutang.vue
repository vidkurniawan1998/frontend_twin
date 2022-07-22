<template>
  <div class="antialiased">

    <Sidebar/>


    <div class="page">
      
      <Header hint="Cari"  @change="search" :enabled="!loading"/>

      <div class="content">
        <div class="container">
          <!-- Page title -->
            <div class="page-header">
            <div class="row d-flex justify-content-between">
              <div class="col-auto">
                <h2 class="page-title">
                  Ranking Piutang
                </h2>
              </div>

              <div class="col-auto">
                <div class="row">
                  <div class="col-auto">
                    <button class="btn btn-white mr-3" v-html="ic('filter')+' Filter'" @click="triggerFilter"> </button>
                    <div class="btn-group">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        <Skeleton type="table" :length="10" class="mt-3 bg-white" v-if="loading"/>
        <Nodata v-if="!loading && data_laporan.data.length == 0"/> 
        <div class="box" v-if="!loading && data_laporan.data.length > 0" style="overflow: auto;">
            <div class="card">
              <div class="table-responsive">
                <table class="table table-vcenter table-hover card-table table-striped">
                  <thead>
                    <th>No</th>
                    <th>No Acc</th>
                    <th>Toko</th>
                    <th>Pemilik</th>
                    <th>Alamat</th>
                    <th>Pembayaran</th>
                    <th>Piutang</th>
                  </thead>
                  <tbody>
                    <tr v-for="(row, i) in data_laporan.data">
                      <td>{{i+1}}</td>
                      <td>
                        <span class="click-able text-blue"  @click="getDetailPiutang(row)">{{row.data.no_acc || ''}}</span>
                      </td>
                      <td>{{row.data.nama_toko}}</td>
                      <td>{{row.data.pemilik}}</td>
                      <td>{{row.data.alamat}}</td>
                      <td style="white-space: nowrap;">Rp {{row.jumlah_lunas | currency}}</td>
                      <td style="white-space: nowrap;">Rp {{row.jumlah_belum_bayar | currency}}</td>
                    </tr>
                  </tbody>
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
  name: "LaporanRankingPiutang",
  components: { FormFilter},
  data() {
    return {
    };
  },
  mixins: [helper],
  computed:{
    ...mapState(['loading']),
    ...mapState('ranking_piutang',{
      data_filter  : state => state.data_filter,
      data_laporan : state => state.data_laporan,
      data_detail  : state => state.data_detail,
    }),
  },
  methods: {
    ...mapActions('ranking_piutang', ['getLaporan','triggerFilter']),
    getDetailPiutang(data){
      const url = '/ranking_piutang';
      this.data_filter.id_toko = data.id_toko;
      this.axios.get(url, {
        params: this.data_filter
      }).then((response) => {
        this.data_filter.id_toko = null;
        let piutang_toko = {
          data   : data,
          filter : this.data_filter,
          items  : response.data,
        }
        if (localStorage.getItem("rankingPiutang") === null) {
          localStorage.piutangToko = JSON.stringify(piutang_toko)
        }
        else {
          localStorage.removeItem("rankingPiutang");
          localStorage.piutangToko = JSON.stringify(piutang_toko)
        }
        window.open(window.location.origin+'/dashboard/finance/detail-ranking-piutang', '_blank')
      }).catch(err => {
        this.onError(err)
      })
    },
    search(keyword){
      this.data_filter.keyword = keyword
      this.getLaporan()
    },
  },
  mounted(){
  },
  created(){
    this.getLaporan();
  },  
};
</script>
<style scoped="scss">
</style>