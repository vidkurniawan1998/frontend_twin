<template>
  <div class="antialiased">

    <Sidebar/>


    <div class="page">

      <Header @keyup="_search"/>

      <div class="content">
        <div class="container">
          <!-- Page title -->
          <div class="page-header">
            <div class="row d-flex justify-content-between">
              <div class="col-auto">
                <h2 class="page-title">
                  Stock
                </h2>
              </div>
              <div class="col-auto">
                <div class="row">
                  <div class="col-auto px-0">
                    <div class="input-icon float-left">
                      <span class="input-icon-addon"> <i class="fe fe-align-left"></i> </span>
                      <select class="form-control" v-model="paginate.perPage" @change="_get" :disabled="loading">
                        <option :value="num" v-for="(num, i) in [10,50,100,999]" :key="i" v-html="num == 999 ? 'Semua' : num"/>
                      </select>
                    </div>
                  </div>

                  <div class="col-auto">
                    <div class="btn-group">
                      <button class="btn btn-primary" @click="showForm('Tambah Data')"> Tambah </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

            <Skeleton type="table" :length="10" class="mt-3 bg-white" v-if="loading"/>

            <Nodata v-if="!loading && filter.length == 0"/>

            <div class="box" v-if="!loading && filter.length > 0">
                <div class="card">
                  <div class="table-responsive">
                      <table class="table table-vcenter table-hover card-table table-striped">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Perusahaan</th>
                                <th>Gudang</th>
                                <th>Jenis Gudang</th>
                                <th>Total Dus</th>
                                <th>Total Pcs</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(row, i) in filter" :key="i" >
                                <td>{{paginate.fromPage + i}}</td>
                                <td>
                                  <span class="badge bg-blue-lt mr-2">{{row.kode_perusahaan}}</span>
                                </td>
                                <td class="click-able" @click="_detail(row)">{{row.nama_gudang}}</td>
                                <td>{{row.jenis}}</td>
                                <td>{{ribuan(row.qty,'')}}</td>
                                <td>{{ribuan(row.qty_pcs,'')}}</td>
                                <td class="text-right">
                                    <button class="btn btn-outline-primary btn-sm" @click="_detail(row)">Detail</button>
                                    <!-- <router-link class="btn btn-white btn-sm" :to="{ name: 'detail-stok', params: { id: row.id } }">Detail</router-link> -->
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

    <DetailStock
      :config.sync="detail.config"
      :initData="detail.data" :dismiss.sync="detail.dismiss"
      :isSubmit.sync="detail.isSubmit"
      @submit="detail.action"
    />
    <FormStock/>
  </div>
</template>

<script>
import helper from "@/assets/js/helper.js";
import DetailStock from "./modals/detail-stock.vue";
import FormStock from "./modals/form-stock";
import {mapMutations} from "vuex";

export default {
  name: "Stock",
  components: { DetailStock, FormStock },

  data() {
    return {
        auth: {},

        detail: {
          config: { view: false, title: null },
          data: null,
          isSubmit: false,
          action: () => {}
        },

        loading: true,
        data: [], filter: [],

        paginate: {
            currentPage: 1,
            totalRows: 0,
            perPage: 100,
            fromPage: 0
        },

    };
  },

  mixins: [helper],

  methods: {
      ...mapMutations('stock', ['SET_FORM', 'SET_FORM_TITLE', 'CLEAR_FORM']),
      _get(){
        this.loading = true
        this.axios.get('stock?per_page='+this.paginate.perPage+'&page='+this.paginate.currentPage).then(res => {
            this.data = this.filter = res.data.data
            this.paginate.totalRows = res.data.meta.total;
            this.paginate.fromPage = res.data.meta.from;

            this.loading = false
        }).catch( err => {
            this.loading = false
            this.onError(err)
        })
      },

      _detail(data){
        this.detail.config = {view: true, title: 'Detail Stock'}
        this.detail.data = data
      },

      _pageChange(page){
        this.paginate.currentPage = page;
        this._get();
      },

      _search(keyword){
        let k = keyword.toString().toLowerCase(); this.filter = []

        for (let i = 0; i < this.data.length; i++) {
          if(this.data[i].nama_gudang.toLowerCase().includes(k)){
            this.filter.push(this.data[i])
          }
        }
      },
      showForm(val) {
        this.CLEAR_FORM()
        this.SET_FORM(true)
        this.SET_FORM_TITLE(val)
      },
  },

  mounted(){
    this.auth = JSON.parse(localStorage.user)

    this._get()
  }

};
</script>
