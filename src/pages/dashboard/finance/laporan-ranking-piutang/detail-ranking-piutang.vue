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
                  Detail Ranking Piutang
                </h2>
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
                          <div><b>Nama Toko</b></div> <span>{{data_detail.data.nama_toko}}</span>
                        </li>
                        <li class="list-group-item">
                          <div><b>Alamat  </b></div> <span>{{data_detail.data.alamat}}</span>
                        </li>
                        <li class="list-group-item">
                          <div><b>Piutang  </b></div> <span>{{data_detail.jumlah_belum_bayar | currency}}</span>
                        </li>
                        <li class="list-group-item">
                            <b>Detail Piutang</b>
                        </li>
                      </ul>
                    </transition>
                    <table class="table">
                      <thead>
                        <th>No Invoice</th>
                        <th>Jatuh Tempo</th>
                        <th>Salesman</th>
                        <th>Jumlah Pembayaran</th>
                        <th>Piutang</th>
                      </thead>
                      <tbody>
                         <tr v-for="(row, i) in data_items">
                           <td>
                            {{row.id+'&emsp; '}}{{row.no_invoice}}
                           </td>
                           <td>{{dateFormat(row.due_date)}}</td>
                           <td>
                            {{row.nama_salesman}}  
                            ({{row.tim}})
                          </td>
                          <td>Rp {{row.jumlah_lunas | currency}}</td>
                          <td>Rp {{row.jumlah_belum_bayar | currency}}</td>
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
  name: "Detail Ranking Piutang",
  components: {},
  data() {
    return {
      data_detail : [],
      data_items  : [],
      data_filter : [],
    };
  },
  mixins: [helper],
  computed:{
    ...mapState(['loading']),
  },
  methods: {
    getData(){ 
      let piutangToko = JSON.parse(localStorage.piutangToko);
      this.data_filter  = piutangToko.filter;
      this.data_detail  = piutangToko.data;
      this.data_items   = piutangToko.items;
    },
  },    
  mounted(){
    this.getData()
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