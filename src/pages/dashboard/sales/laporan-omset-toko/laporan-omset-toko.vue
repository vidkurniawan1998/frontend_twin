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
                  Omset Toko
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

        <Skeleton type="table" :length="10" class="mt-3 bg-white" v-if="loading"/>

        <Nodata v-if="!loading && data_laporan.data.length == 0"/> 

        <div class="box" v-if="!loading && data_laporan.data.length > 0">
            <div class="card">
              <div class="table-responsive">

                <table class="table table-vcenter table-hover card-table table-striped">
                  <thead>
                    <tr class="text-muted">
                      <th>No</th>
                      <th>Comp</th>
                      <th>Depo</th>
                      <th>No ACC</th>
                      <th>Tipe</th>
                      <th>Nama Toko</th>
                      <th>Pemilik</th>
                      <th>Penjualan</th>
                      <th style="text-align: right;">Omset</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <!-- @click="detailOmset(row)"--> <!-- @click="getDetailOmset()" -->
                    <tr v-for="(row, i) in data_laporan.data" :key="i">
                      <td>{{i+1}}</td>
                      <td><span  style="text-align: center;" class="badge bg-blue-lt mr-2">{{row.kode_perusahaan}}</span></td>
                      <td>{{row.nama_depo}}</td>
                      <td>{{row.no_acc}}</td>
                      <td>{{row.tipe}}</td>
                      <td>{{row.nama_toko}}</td>
                      <td>{{row.pemilik}}</td>
                      <td @click="detailOmset(row)">{{row.banyak_penjualan}}</td>
                      <td @click="detailOmset(row)" style="text-align: right;">{{row.total | currency}}</td>
                      <td class="p-0" style="text-transform: capitalize;">
                        <b-dropdown dropleft variant="link" size="lg" no-caret>
                          <template slot="button-content"> <i class="fe fe-more-vertical"></i> </template>
                          <b-dropdown-item @click="getDetailOmset(row)">Rincian</b-dropdown-item>
                        </b-dropdown>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
        </div>
        <!-- <b-pagination
            v-if="!loading && data_laporan.data.length"
            align="center"
            class="mt-5"
            :total-rows="data_laporan.meta.total"
            v-model="data_filter.page"
            v-on:input="getLaporan"
            :per-page="data_filter.per_page" /> -->
        <FormFilter/>
        <DetailOmset/>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
import helper from "@/assets/js/helper.js";
import FormFilter from "./modals/filter.vue";
import DetailOmset from "./modals/detail-omset-toko.vue";
import { mapState, mapActions, mapMutations } from 'vuex'
export default {
  name: "LaporanOmsetToko",
  components: { FormFilter, DetailOmset },
  data() {
    return {
    };
  },
  mixins: [helper],
  computed:{
    ...mapState(['loading']),
    ...mapState('omset_toko',{
      data_filter  : state => state.data_filter,
      data_detail  : state => state.data_detail,
      data_laporan : state => state.data_laporan,
    }),
  },
  methods: {
    ...mapActions('omset_toko', ['getLaporan','getDetail']),
    detailOmset(data){
      this.data_detail.data=data;
      this.data_filter.id_active = data.id;
      this.getDetail();
      this.data_detail.form=true;
    },
    getDetailOmset(data){
      this.data_filter.id_active = data.id;
      const url = '/omset_toko/detail';
      this.axios.get(url, {
        params: this.data_filter
      }).then((response) => {
        let omset_toko = {
          data   : data,
          items  : response.data,
          filter : this.data_filter,
        }
        if (localStorage.getItem("omsetToko") === null) {
          localStorage.omsetToko = JSON.stringify(omset_toko)
        }else
        {
          localStorage.removeItem('semuaInvoice');
          localStorage.omsetToko = JSON.stringify(omset_toko)
        }
        window.open(window.location.origin+'/dashboard/sales/detail-omset-toko', '_blank')
      }).catch(err => {
        this.onError(err)
      })
    }
  },
  mounted(){
  },
  created(){
    this.getLaporan();
  },  
};
</script>
<style scoped="scss">
  td{
    text-transform: uppercase
  }
</style>