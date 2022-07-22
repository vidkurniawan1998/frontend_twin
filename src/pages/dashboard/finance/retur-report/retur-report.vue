<template>
  <div class="antialiased">

    <Sidebar/>

    <div class="page">

      <Header @change="_search" hint="Ketik no. invoice"/>

      <div class="content">
        <div class="container">
          <!-- Page title -->
          <div class="page-header">
            <div class="row d-flex justify-content-between">
              <div class="col-auto">
                <h2 class="page-title">
                  Laporan Klaim Retur
                </h2>
              </div>

              <div class="col-auto">
                <div class="row">

                  <div class="col-auto">
                    <div class="input-icon float-left">
                      <span class="input-icon-addon"> <i class="fe fe-align-left"></i> </span>
                      <select class="form-control" v-model="paginate.perPage" @change="reload = 0; _get()" :disabled="loading">
                        <option :value="num" v-for="(num, i) in [10,50,100,999]" :key="i" v-html="num == 999 ? 'Semua' : num"/>
                      </select>
                    </div>

                    <button class="btn btn-white ml-3" v-html="ic('filter')" @click="_filter"> </button>

                    <div class="btn-group">
                      <button class="btn btn-outline-primary ml-3" @click="_createExcel" :disabled="isExcelRequest" v-html="isExcelRequest ? spin() : ic('download')+' Export Excel'"> </button>
                    </div>

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
                <table
                  class="table table-vcenter table-hover card-table table-striped"
                >
                  <thead>
                    <tr class="text-muted">
                      <th>Comp</th>
                      <th>No</th>
                      <th>Toko</th>
                      <th>Tim & Gudang</th>
                      <th>Tgl. Input</th>
                      <th>Tgl. Klaim</th>
                      <th>Kat. Retur</th>
                      <th>Grand Total</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, i) in data" :key="i">
                      <td>
                        <span class="badge bg-blue-lt mr-2"> {{ row.kode_perusahaan }} </span>
                      </td>
                      <td>
                        <span class="link-primary cursor-pointer" @click="_detail(row)">
                          {{ row.id }}
                        </span>
                      </td>
                      <td>
                        {{ row.nama_toko }} <br/>
                        {{ row.no_acc_toko }}
                      </td>
                      <td>
                        {{ row.nama_tim }} ({{ row.tipe_tim}})
                        <br>
                        {{ row.nama_gudang }}
                      </td>
                      <td>{{ dateFormat(row.sales_retur_date) }}</td>
                      <td>
                        {{ row.claim_date == null ? "-" : dateFormat(row.claim_date) }}
                      </td>
                      <td>{{ row.tipe_barang }}</td>
                      <td>
                        <div style="float: right">
                          Rp {{ ribuan(Math.round(row.grand_total)) }}
                        </div>
                      </td>
                      <td>
                        <span
                          v-html="
                            row.status == 'waiting' ? 'menunggu' : 'disetujui'
                          "
                          class="badge w-100"
                          :class="
                            row.status == 'waiting' ? 'bg-orange' : 'bg-green'
                          "
                        ></span>
                      </td>
                      <td class="p-0">
                        <b-dropdown dropleft variant="link" size="lg" no-caret>
                          <template slot="button-content">
                            <i class="fe fe-more-vertical"></i>
                          </template>
                          <b-dropdown-item @click.native="_detail(row)"
                            >Rincian</b-dropdown-item
                          >
                        </b-dropdown>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <b-pagination
            v-if="data.length > 0 && !loading"
            align="center"
            class="mt-5"
            :total-rows="paginate.totalRows"
            v-model="paginate.currentPage"
            :per-page="paginate.perPage"
            @change="_pageChange"
          />

        </div>
      </div>

    </div>

    <FormFilter
      :config.sync="filter.config"
      :initData="filter.data" :dismiss.sync="filter.dismiss"
      :isSubmit.sync="filter.isSubmit"
      @submit="filter.action"
    />

    <DetailRetur
      :config.sync="detail.config"
      :initData="detail.data"
      :dismiss.sync="detail.dismiss"
      :isSubmit.sync="detail.isSubmit"
      @submit="detail.action"
    />

    <Confirm :id.sync="confirm.id" :title.sync="confirm.title" :subTitle.sync="confirm.subTitle" :isSubmit.sync="confirm.isSubmit" @submit="confirm.action" :btnConfirm.sync="confirm.btnConfirm" :textConfirm.sync="confirm.textConfirm"/>

  </div>
</template>

<script>
import helper from "@/assets/js/helper.js";
import FormFilter from "./modals/filter.vue";
import DetailRetur from "./modals/detail-retur-penjualan.vue";

const fb = require('@/db.js');

export default {
  name: "Retur-Klaim",
  components: { FormFilter, DetailRetur },

  data() {
    return {
      auth: {}, animate: null, reload: 0,

      filter: {
        config: { view: false, title: null },
        data: null, isSubmit: false,
        action: () => {}
      },

      confirm: {
        id: null, title: null, isSubmit: false, action: () => {}, subTitle: 'Penghapusan ini bersifat permanen', btnConfirm: 'btn-danger', textConfirm: 'Hapus Sekarang'
      },

      detail: {
        config: { view: false, title: null },
        data: null, isSubmit: false,
        action: () => {}
      },

      loading: true,
      data: [],

      paginate: {
        currentPage: 1,
        totalRows: 0,
        perPage: 10,
        fromPage: 0
      },

      dataFilter: {
        id_perusahaan: '',
        id_salesman: 'all',
        start_date: '2020-08-18', //this.dateTime('ymd'),
        end_date: this.dateTime('ymd'),
        keyword: '',
        depo:[],
        page:'',
        per_page:''
      },

      fireTrigger: null,isExcelRequest: false

    };
  },

  mixins: [helper],

  methods: {

      _get(params){
        this.loading = params == null ? true : !params.silent

        this.dataFilter.page = this.paginate.currentPage;
        this.dataFilter.per_page = this.paginate.perPage;

        this.axios.get("retur_penjualan/klaim_retur",{params: this.dataFilter}).then(res => {
          this.data = res.data.data;
          this.loading = false;

          this.paginate.totalRows = res.data.meta.total;
          this.paginate.fromPage = res.data.meta.from;

          // animasi penjualan baru
          if(this.reload > 1){
            this.animate = 'animate bounceIn'
            setTimeout(() => { this.animate = '' }, 1000);
          }

          if(this.reload < 2){
            this.reload += 1
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

      _detail(data) {
        this.detail.config = { view: true, title: "Detail Retur Penjualan" };
        this.detail.data = data;
      },

      _pageChange(page){
        this.paginate.currentPage = page;
        this._get();
      },

      _search(keyword){
        this.dataFilter.keyword = keyword
        this._get()
      },

      _createExcel(){
        this.isExcelRequest = true

        this.axios.get('report/report_klaim_retur', {params: this.dataFilter}).then(res => {
          window.open(res.data)

          this.isExcelRequest = false
        }).catch(err => {
          this.onError(err)
          this.isExcelRequest = false
        })

      }
  },

  mounted(){
    this.auth = JSON.parse(localStorage.user)
    this._get();
  }
};
</script>
