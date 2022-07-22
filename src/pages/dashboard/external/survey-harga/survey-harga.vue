<template>
  <div class="antialiased">

    <Sidebar/>

    <div class="page">
      
      <Header @keyup="_search" hint="Ketik nama toko" @refresh="paginate.currentPage = 1, dataFilter.keyword = '', _get()" :enabledRefresh="true"/>

      <div class="content">
        <div class="container">
          <!-- Page title -->
          <div class="page-header">
            <div class="row d-flex justify-content-between">
              <div class="col-auto">
                <h2 class="page-title">
                  Survey Harga
                </h2>
              </div>

              <!-- <div class="col-auto">
                <div class="text-muted text-h5 mt-2">Login Pada {{auth.logged_at}}</div>
              </div> -->

              <div class="col-auto">
                <div class="row">
                  <div class="col-auto px-0">

                    <div class="input-icon">
                      <span class="input-icon-addon"> <i class="fe fe-align-left"></i> </span>
                      <select class="form-control" v-model="paginate.perPage" @change="_get" :disabled="true">
                        <option :value="num" v-for="(num, i) in [10,50,100,999]" :key="i" v-html="num == 999 ? 'Semua' : num"/>
                      </select>
                    </div>

                  </div>

                  <div class="col-auto">
                    <button class="btn btn-primary" @click="_export" :disabled="dataOri.length == 0 || loading"> Export Excel </button>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <Skeleton type="table" :length="10" class="mt-3 bg-white" v-if="loading"/>

          <Nodata v-if="!loading && data.length == 0"/>

          <div class="box" v-if="!loading && data.length > 0">
            <div class="card">
              <div class="table-respon sive">
                <table class="table table-vcenter table-hover card-table table-striped table-control">

                  <thead>
                    <tr class="text-muted">
                      <th>No</th>
                      <th>Toko</th>
                      <th>Alamat</th>
                      <th>Dibuat</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, i) in data" :key="i" >
                      <td>{{i + 1}}</td>
                      <td class="click-able" @click="_detail(row)">{{row.store}}</td>
                      <td class="click-able" @click="_toMap(row.gps)">{{row.location}}</td>
                      <td v-html="dateFormat(row.created.at)"></td>
                      <!-- <td>{{row.gps}}</td> -->
                      <td class="pos-relative">
                        <div class="btn-group option center">
                          <button class="btn btn-white btn-pill" @click="_detail(row)" v-html="ic('eye')"/>
                          <button class="btn btn-white btn-pill" @click="_edit(row)" v-html="ic('edit')"/>
                          <button class="btn btn-white btn-pill text-danger" @click="_delete(row.id)" v-html="ic('trash')"/>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                  
                </table>
              </div>
            </div>
          </div>

          <b-pagination v-if="data.length > 0 && !loading" align="center" class="mt-5" :total-rows="paginate.totalRows" v-model="paginate.currentPage" :per-page="paginate.perPage" @change="_pageChange" />

        </div>
      </div>

    </div>

    <DaftarItem :config.sync="detail.config" :initData="detail.data" />
    <ExportExcel :config.sync="exportExcel.config" :initData="exportExcel.data" />

  </div>
</template>

<script>
import helper from "@/assets/js/helper.js";
import DaftarItem from "./modals/daftar-item.vue";
import ExportExcel from "./modals/export-all.vue";

const fb = require('@/dbsurga.js');

export default {
  name: "SurveyHarga",
  components: { DaftarItem, ExportExcel },

  data() {
    return {
      auth: {},

      exportExcel: {
        config: { view: false, title: null }, data: null
      },

      detail: {
        config: { view: false, title: null }, data: null
      },

      loading: true,
      data: [], dataOri: [],
  
      paginate: {
        currentPage: 1,
        totalRows: 0,
        perPage: 999,
        fromPage: 0
      },

      dataFilter: {
        keyword: ''
      },

    };
  },

  mixins: [helper],

  methods: {

    _get(){
      this.loading = true;
      fb.firestore.collection('stores').onSnapshot((snapshot) => {
        let temp = []

        snapshot.forEach((doc) => {
          let data = doc.data();
              data.id = doc.id

          temp.push(data)
        })

        this.data = this.dataOri = temp
        this.loading = false
      });
    },

    _toMap(gps){
      window.open('https://www.google.com/maps/search/?api=1&query='+gps.lat+','+gps.lon);
    },

    _detail(data){
      this.detail.config = {view: true, title: data.store}
      this.detail.data = data
    },

    _export(){
      this.exportExcel.config = {view: true, title: 'Export Barang'}
      this.exportExcel.data = this.dataOri
    },

    _pageChange(page){
      this.paginate.currentPage = page;
      this._get();
    },

    _search(keyword){
      let k = keyword.toString().toLowerCase(); this.data = []

      for (let i = 0; i < this.dataOri.length; i++) {
        if(this.dataOri[i].store.toString().toLowerCase().includes(k)){
          this.data.push(this.dataOri[i])
        }
      }
    },

  },

  mounted(){
    this.auth = JSON.parse(localStorage.user)
    this._get()
  },

};
</script>
