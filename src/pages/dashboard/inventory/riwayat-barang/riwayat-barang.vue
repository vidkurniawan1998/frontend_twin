<template>
  <div class="antialiased">

    <Sidebar/>


    <div class="page">
      
      <Header @keyup="_search" hint="Cari" :disabledSearch="true"/>

      <div class="content">
        <div class="container">
          <!-- Page title -->
          <div class="page-header">
            <div class="row d-flex justify-content-between">
              <div class="col-auto">
                <h2 class="page-title">
                  Riwayat Barang
                </h2>
              </div>

              <!-- <div class="col-auto">
                <div class="text-muted text-h5 mt-2">Login Pada {{auth.logged_at}}</div>
              </div> -->

              <div class="col-auto">
                <div class="row">
                  <div class="col-auto">

                  </div>

                  <div class="col-auto">
                    <button class="btn btn-primary" @click="_filter" v-html="ic('filter')+' Filter'"> Filter </button>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <Skeleton type="table" :length="10" class="mt-3 bg-white" v-if="loading"/>

          <div class="alert alert-info" v-if="!hasLoaded && !loading">
            <i class="fe fe-info mr-2"></i> Pilih filter untuk menampilkan data.
          </div>

          <Nodata v-if="!loading && data.length == 0 && hasLoaded"/>

          <div class="mb-2" v-if="!loading && data.length > 0">
            {{dataFilter.nama_gudang}} <span class="float-right">Stock Terakhir : {{stock.qty+' / '+stock.qty_pcs}}</span>
          </div>

          <div class="box" v-if="!loading && data.length > 0">
              <div class="">
                <div class="table-respon sive">
                  <table class="table table-vcenter table-hover card-table table-striped mb-2" v-for="(row, i) in data" :key="i" style="border: 1px #ddd solid">
                    <thead>
                      <tr class="text-muted">
                        <th v-html="header[i]+' - '+( row[0].kode_barang || '-' )+' - '+row[0].nama_barang" colspan="5" width="300">No</th>
                        <th width="100">Masuk</th>
                        <th width="100">Keluar</th>
                        <th class="text-right">
                          <button class="btn btn-white btn-sm" @click="expanded = expanded == i ? -1 : i"> <i class="fe " :class="expanded == i ? 'fe-minus' : 'fe-plus'"></i> </button>
                        </th>
                      </tr>
                    </thead>
                    <tbody v-show="expanded == i ? true : false">
                      <tr v-for="(item, l) in row" :key="l">
                        <td v-html="l + 1"></td>
                        <td v-html="item.tim"></td>
                        <td v-html="item.no">-</td>
                        <td v-html="item.tanggal"></td>
                        <td v-html="item.note"></td>
                        <td v-html="item.in">100/0</td>
                        <td v-html="item.out">90/0</td>
                        <td></td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colspan="5">Total Penjualan</td>
                        <td colspan="3">{{total[i]}}</td>
                      </tr>
                    </tfoot>

                  </table>
                </div>
              </div>
          </div>

        </div>
      </div>

    </div>

    <FormFilter
      :config.sync="filter.config"
      :initData="filter.data" :dismiss.sync="filter.dismiss"
      :isSubmit.sync="filter.isSubmit"
      @onSubmit="filter.action"
    />

    <!-- <Confirm :id.sync="confirm.id" :title.sync="confirm.title" :isSubmit.sync="confirm.isSubmit" @submit="confirm.action"/> -->

  </div>
</template>

<script>
import helper from "@/assets/js/helper.js";
import FormFilter from "./modals/filter";

export default {
  name: "RiwayatBarang",
  components: { FormFilter },

  data() {
    return {
        auth: {},

        filter: {
          config: { view: false, title: null },
          data: null, isSubmit: false,
          action: () => {}
        },

        loading: false, hasLoaded: false,
        data: [], header: [], expanded: 0, stock: {},
    
        dataFilter: {
          id_barang: '8',
          id_gudang: '1',
          nama_gudang: null,
          tanggal_awal: this.dateTime('ymd'),
          tanggal_akhir: this.dateTime('ymd')
        },

        total: [

        ]

    };
  },

  mixins: [helper],

  methods: {

      _get(params){
        this.loading = params == null ? true : !params.silent

        this.axios.get('riwayat_barang', {
          params: this.dataFilter
        }).then(res => {
          this.data = []
          this.header = []
          this.expanded = 0

          this.loading = false;
          this.hasLoaded = true

          let data = res.data.data
          this.stock = res.data.stock

          if(data.length == 0){
            return
          }

          this.total = []

          for (const key in data) {
            let qty = 0, pcs = 0

            for (let i = 0; i < data[key].length; i++) {
              let item = data[key][i]
              qty += +item.qty
              pcs += +item.qty_pcs
            }

            this.total.push(qty+'/'+pcs)
          }

          for (const key in data) {
            this.header.push(key)
            this.data.push(data[key])
          }
        }).catch( err => {
          this.loading = false
          this.onError(err)
        });
      },

      _filter(){
        this.filter.config = {view: true, title: 'Filter'}
        this.filter.action = (formData) => {
          for (const key in formData) {
            this.dataFilter[key] = formData[key]
          }

          this._get()
        }
      },

      _search(keyword){
        let k = keyword.toString().toLowerCase(); this.filter = []
        for (let i = 0; i < this.data.length; i++) {
          if(this.data[i].nama_driver.toLowerCase().includes(k)){
            this.filter.push(this.data[i])
          }
        }
      },
    
  },

  mounted(){
    this.auth = JSON.parse(localStorage.user)
    // this._get()
  }

};
</script>

<style lang="scss" scoped>
  hr{
    margin: 0 !important
  }
</style>