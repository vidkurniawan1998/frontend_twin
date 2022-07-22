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
                  Detail Ranking Barang
                </h2>
                <div>{{data_filter.start_date+' - '+data_filter.end_date}}</div>
              </div>
            </div>
          </div>
        <Skeleton type="table" :length="10" class="mt-3 bg-white" v-if="loading"/>

        <Nodata v-if="!loading && data_items.length == 0"/> 
        <div class="box" v-if="!loading && data_items.length > 0">
            <div class="card-tabs mb-0">
              <div class="card tab-pane">
                <div class="card-body p-0">
                  <transition name="slide-up">
                    <Skeleton type="list" :length="8" class="mt-3 bg-white m-2" v-if="loading"/>
                      <ul class="list-group list-stripped list-borderless">
                        <li class="list-group-item">
                          <div><b>Kode Barang</b></div> <span>{{data_detail.kode_barang}}</span>
                        </li>
                        <li class="list-group-item">
                          <div><b>Nama Barang</b></div> <span>{{data_detail.nama_barang}}</span>
                        </li>
                        <li class="list-group-item" v-if="salesman.nama_salesman">
                          <div><b>Salesman</b></div> <span>{{salesman.nama_salesman}}</span>
                        </li>
                        <li class="list-group-item" v-if="depo.length>0">
                          <div><b>Depo</b></div> 
                          <span v-for="(row, i) in depo">
                            {{row.nama_depo}}
                          </span>
                        </li>
                        <li class="list-group-item">
                            <b>Detail Penjualan</b>
                        </li>
                      </ul>
                    </transition>
                    <table class="table">
                      <thead>
                        <th >Nama Toko</th>
                        <th>Tipe</th>
                        <th>Kode Outlet</th>
                        <th >Alamat</th>
                        <th style="text-align: right;">Qty</th>
                        <th style="text-align: right;">Qty Carton</th>
                        <th style="text-align: right;">Qty Pcs</th>
                      </thead>
                      <tbody>
                         <tr v-for="(row, i) in data_items">
                            <td>{{row.nama_toko}}</td>
                            <td>{{row.tipe}}</td>
                            <td>{{row.no_acc}}</td>
                            <td>{{row.alamat}}</td>
                            <td style="text-align: right;">{{row.total_qty }}</td>
                            <td style="text-align: right;">{{row.qty }}</td>
                            <td style="text-align: right;">{{row.qty_pcs }}</td>
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

    </div>

  </div>
</template>

<script>
import helper from "@/assets/js/helper.js";
import { mapState, mapActions, mapMutations } from 'vuex'
export default {
  name: "DetailRankingBarang",
  components: {},
  data() {
    return {
      data_detail : [],
      data_items  : [],
      data_filter : [],
      salesman : [],
      depo : []
    };
  },
  mixins: [helper],
  computed:{
    ...mapState(['loading']),
  },
  methods: {
    ...mapActions('depo', ['getListDepoById']),
    _getData(){ 
      let RankingBarang = JSON.parse(localStorage.rankingBarang);
      this.data_filter  = RankingBarang.filter;
      this.data_detail  = RankingBarang.data;
      this.data_items   = RankingBarang.items;
      this._getSalesman(this.data_filter.id_salesman)
      this._getDepo(this.data_filter.depo)
    },
    _getSalesman(id){
      const url = '/salesman/'+id
      this.axios.get(url).then((response) => {
        this.salesman = response.data.data
      }).catch(err => {
        this.onError(err)
      })
    },
    _getDepo(id){
      this.getListDepoById({
        id_depo: id
      }).then(res=>{
        this.depo = res
      });
    }
  },    
  mounted(){
    this._getData()
  },
  created(){
  
  },  
};
</script>
<style scoped="scss">
  td{
    text-transform: uppercase
  }
</style>