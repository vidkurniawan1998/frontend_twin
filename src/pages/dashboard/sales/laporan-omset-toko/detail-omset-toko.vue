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
                  Detail Omset Toko
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
                          <div><b>Nama Toko</b></div> <span>{{data_detail.nama_toko}}</span>
                        </li>
                        <li class="list-group-item">
                          <div><b>Pemilik  </b></div> <span>{{data_detail.pemilik}}</span>
                        </li>
                        <li class="list-group-item">
                          <div><b>Omset  </b></div> <span>{{data_detail.total | currency}}</span>
                        </li>
                        <li class="list-group-item">
                            <b>Detail Penjualan</b>
                        </li>
                      </ul>
                    </transition>
                    <table class="table">
                      <thead>
                        <th style="font-size: 12px">brand</th>
                        <th>Kode Barang</th>
                        <th style="font-size: 12px">Barang</th>
                        <th style="font-size: 12px; text-align: center;">Qty</th>
                        <th style="text-align: right;">Sub Total</th>
                        <th style="text-align: right;">Discount</th>
                        <th style="text-align: right;">DPP</th>
                        <th style="text-align: right;">PPN</th>
                        <th style="font-size: 12px; text-align: right;">Omset</th>
                      </thead>
                      <tbody>
                         <template v-for="(row, i) in data_items">
                            <tr v-if="row.tipe=='item'" class="bg-light">
                              <td>{{row.nama_brand}}</td>
                              <td>{{row.kode_barang}}</td>
                              <td>{{row.nama_barang}}</td>
                              <td style="text-align: center;">{{row.total_qty | currency}} / {{row.total_qty_pcs | currency}}</td>
                              <td style="text-align: right;">{{row.subtotal | currency}}</td>
                              <td style="text-align: right;">{{row.discount | currency}}</td>
                              <td style="text-align: right;">{{row.dpp | currency}}</td>
                              <td style="text-align: right;">{{row.ppn | currency}}</td>
                              <td style="text-align: right;">{{row.total | currency}}</td>
                            </tr>
                            <tr v-else>
                              <td colspan="9">{{row.nama_brand}}</td>
                            </tr>
                         </template>
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
  name: "DetailOmsetToko",
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
      let omsetToko = JSON.parse(localStorage.omsetToko);
      let items = omsetToko.items;
      var detail_items = [];
      var temp_brand = 0;
      for (var i = 0; i < items.length; i++) {
        if(items[i].id_brand!=temp_brand){
          temp_brand = items[i].id_brand; 
          detail_items.push({tipe : 'brand', nama_brand: items[i].nama_brand});
        }
        var total_qty = Math.floor(items[i].total_qty);
        var qty_sisa = items[i].total_qty-total_qty;
        var temp = {
          tipe             : 'item',
          nama_barang      : items[i].nama_barang,
          kode_barang      : items[i].kode_barang,
          total_qty_pcs    : qty_sisa*items[i].isi,
          total_qty        : total_qty,
          subtotal         : items[i].subtotal,
          discount         : items[i].discount,
          dpp              : items[i].dpp,
          ppn              : items[i].ppn,
          total            : items[i].total,
        };
        detail_items.push(temp);
      }
      this.data_filter  = omsetToko.filter;
      this.data_detail  = omsetToko.data;
      this.data_items   = detail_items;
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