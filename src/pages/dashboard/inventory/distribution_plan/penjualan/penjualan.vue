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
                  Distribution Plan
                </h2>
              </div>

              <div class="col-auto">
                <div class="row">

                  <div class="col-auto">
                    <button
                        class="btn btn-info ml-3"
                        v-html="loading ? spin() : ic('refresh')"
                        @click="_get"
                        :disabled="loading"
                    >
                    </button>
                    <button class="btn btn-white ml-3" v-html="ic('filter')" @click="_filter"> </button>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div>
            <b-nav tabs>
              <b-nav-item active>
                <router-link to="distribution-plan">  Daftar Invoice Pending </router-link>
              </b-nav-item>
              <b-nav-item>
                 <router-link to="distribution-plan/jadwal"> Daftar Jadwal Pengiriman </router-link>
              </b-nav-item>
              <b-nav-text class="info" style="text-align: right;">
                <button class="btn btn-outline-info" style="max-width: 250px; margin: 5px;">Qty : {{qty_selected.total}} / {{qty_selected.total_pcs}}</button>
                <b-button variant="info">
                  <b-badge> {{ data.length }} </b-badge>&nbsp;Belum Terjadwal
                </b-button>
              </b-nav-text>
            </b-nav>
          </div>

          <div style="margin-top: 20px;">
            <Skeleton type="table" :length="10" class="mt-3 bg-white" v-if="loading"/>
            <Nodata v-if="!loading && data.length == 0"/>
            <div class="box" v-if="!loading && data.length > 0">
              <div class="card">
                <div class="table-responsive">
                  <table class="table table-vcenter table-hover card-table table-striped">
                    <thead>
                      <tr class="text-muted">
                        <th>No</th>
                        <th>Tgl PO</th>
                        <th>No. Invoice</th>
                        <th>Qty</th>
                        <th>Value</th>
                        <th style="max-width: 20%">Toko</th>
                        <th>Salesman</th>
                        <th>Pembayaran</th>
                        <th class="pos-relative">
                          <label class="form-check" style="position: absolute; top: 4px; right: 10px">
                            <input class="form-check-input" type="checkbox" :checked="data.length == checkeds.length" @click="_checkUncheck">
                            <span class="form-check-label"></span>
                          </label>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <template v-for="(row, i) in data" :class="i == 0 && paginate.currentPage == 1 ? animate : ''">
                        <tr class="bg-light" style="border: none;" v-if="_setBanner(row)">
                          <td colspan="10" style="height: 20px;"></td>
                        </tr>
                        <tr>
                          <td> {{ i+1 }} </td>
                          <td>{{dateFormat(row.tanggal)}}</td>
                          <td class="click-able text-primary" @click="_detail(row)">
                            <div>{{row.no_invoice}}</div>
                            <hr style="margin: 2px"/>
                            <div class="text-muted"> PO:{{ row.id }}</div>
                          </td>
                          <td style="font-size: 20px;font-weight: bold">
                            <span class="badge bg-blue" :class="{ 'bg-danger': row.sum_qty < 3, 'bg-blue': row.sum_qty >= 3 }">
                              {{ row.total_qty }} / {{ row.total_pcs }}
                            </span>
                          </td>
                          <td>
                            <div style="float: right;padding-right: 5px">
                              {{ ribuan(row.grand_total.toFixed(0)) }}
                            </div>
                          </td>
                          <td @click="_check(row.id)" :class="row.status_verifikasi === 'N' ? 'text-danger' : ''">
                            <div>[{{row.no_acc}}] {{row.nama_toko}}</div>
                            <hr style="margin: 2px"/>
                            <div class="text-muted">{{ row.alamat }}</div>
                          </td>
                          <td :title="row.nama_salesman">{{row.nama_tim}}</td>
                          <td>{{row.tipe_pembayaran}}</td>
                          <td class="text-right pos-relative" @click="_check(row)">
                            <label class="form-check" style="position: absolute; top: 50%; transform: translate(0, -50%); right: 10px">
                              <input class="form-check-input" type="checkbox" :value="row.id" v-model="checkeds">
                              <span class="form-check-label"></span>
                            </label>
                          </td>
                        </tr>
                      </template> 
                    </tbody>

                  </table>
                </div>
              </div>
            </div>

            <transition-group class="btn-position" name="slide-fade-y" >
               <button
                  class="btn btn-danger btn-pill"
                  style="margin-right: 10px;"
                  @click="_setForceClose"
                  v-if="checkeds.length > 0" 
                  :disabled="loading"
                  :key="1"
                  >
                <i class="la la-lg la-clock-o mr-1"></i> Force Close {{checkeds.length}} Pengiriman
              </button>
              <button
                  class="btn btn-primary btn-pill"
                  @click="_setSchedule" 
                  v-if="checkeds.length > 0" 
                  :disabled="loading" 
                  :key="2">
                <i class="la la-lg la-clock-o mr-1"></i> 
                Jadwalkan {{checkeds.length}} Pengiriman
                qty : {{qty_selected.total}} / {{qty_selected.total_pcs}}
              </button>
            </transition-group>

          </div>
        </div>
      </div>

    </div>

    <FormFilter
      :config.sync="filter.config"
      :initData="filter.data" :dismiss.sync="filter.dismiss"
      :isSubmit.sync="filter.isSubmit"
      @submit="filter.action"
    />

    <Confirm
        :id.sync="confirm.id"
        :title.sync="confirm.title"
        :subTitle.sync="confirm.subTitle"
        :isSubmit.sync="confirm.isSubmit"
        @submit="confirm.action" :btnConfirm.sync="confirm.btnConfirm"
        :textConfirm.sync="confirm.textConfirm"
    />

    <DetailPengiriman
      :config.sync="detail.config"
      :initData="detail.data" :dismiss.sync="detail.dismiss"
      :isSubmit.sync="detail.isSubmit"
      @submit="detail.action"
    />

    <ScheduleSent
      :config.sync="mark.config"
      :initData="mark.data" :dismiss.sync="mark.dismiss"
      :isSubmit.sync="mark.isSubmit"
      @submit="mark.action"
    />

    <DetailClose
      :config.sync="close.config"
      :initData="close.data" :dismiss.sync="close.dismiss"
      :isSubmit.sync="close.isSubmit"
      @submit="close.action"
    />

  </div>
</template>

<script>
import helper from "@/assets/js/helper.js";
import FormFilter from "./modals/filter.vue";
import DetailPengiriman from "./modals/detail-pengiriman.vue";
import DetailClose from "./modals/detail-force-close.vue";
import ScheduleSent from "./modals/schedule-sent.vue";
import { mapState, mapActions, mapMutations } from 'vuex';

const fb = require('@/db.js');

export default {
  name: "Penjualan",
  components: { FormFilter, DetailPengiriman,  DetailClose, ScheduleSent },

  computed: {
    ...mapState('distribution_plan', {
      data_close : state => state.data_close
    }),
  },

  data() {
    return {
      auth: {}, animate: null, reload: 0,

      filter: {
        config: { view: false, title: null },
        data: null, isSubmit: false,
        action: () => {}
      },

      mark: {
        config: { view: false, title: null },
        data: null, isSubmit: false,
        action: () => {}
      },

      close: {
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

      loading: false,
      data: [],checkeds:[],

      paginate: {
        currentPage: 1,
        totalRows: 0,
        perPage: 20,
        fromPage: 0
      },

      dataFilter: {
        status: 'approved',
        id_salesman: 'all',
        start_date: '2020-08-18', //this.dateTime('ymd'),
        end_date: this.dateTime('ymd'),
        tipe_pembayaran: 'all',
        qty: 0,
        operator: '>=',
        keyword: '',
        depo:[],
        distribusi_penjualan:''
      },

      fireTrigger: null,

      qty_selected : {
        total      : 0,
        total_pcs  : 0,
      },

    };
  },

  mixins: [helper],

  methods: {
      _check(data){
        let id  = data.id
        let res = {...data} 
        let qty = {...this.qty_selected}
        let io  = this.checkeds.indexOf(id)

        if(this.checkeds.indexOf(id) > -1){
          this.checkeds.splice(io, 1)
          this.qty_selected.total     = qty.total-res.total_qty
          this.qty_selected.total_pcs = qty.total_pcs-res.total_pcs
        }else{
          this.checkeds.push(id)
          this.qty_selected.total     = qty.total+res.total_qty
          this.qty_selected.total_pcs = qty.total_pcs+res.total_pcs
        }
      },

      _checkUncheck(){
        let qty = {
          total     : 0,
          total_pcs : 0
        }
        if(this.checkeds.length != this.data.length){
          this.checkeds = []
          for (let i = 0; i < this.data.length; i++) {
            let item = this.data[i]
            let res = {...item} 
            this.checkeds.push(item.id)
            qty.total     = qty.total+res.total_qty
            qty.total_pcs = qty.total_pcs+res.total_pcs
          }
          this.qty_selected = qty
        }else{
          this.checkeds = []
          this.qty_selected = qty
        }
      },

      _get(params){
        this.loading = params == null ? true : !params.silent
        this.loading = true
        this.axios.get("penjualan/distribusi/penjualan",{params: this.dataFilter}).then(res => {
          switch (this.dataFilter.operator) {
            case "<":
              this.data = res.data.data.filter( obj => obj.sum_qty < this.dataFilter.qty);
              break;
            case "=":
              this.data = res.data.data.filter( obj => obj.sum_qty === this.dataFilter.qty);
              break;
            case ">=":
              this.data = res.data.data.filter( obj => obj.sum_qty >= this.dataFilter.qty);
              break;
            case "<=":
              this.data = res.data.data.filter( obj => obj.sum_qty <= this.dataFilter.qty);
              break;
            default:
              this.data = res.data.data.filter( obj => obj.sum_qty > this.dataFilter.qty);
              break;
          }

          this.loading = false;
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
          if(this.dataFilter.id_salesman === '')
          {
            this.dataFilter.id_salesman = 'all'
          }

          this._get()
        }
      },
      setSchedule(data) {
        let id = data.id
        this.mark.config = {view: true, title: 'Jadwal Pengiriman'}
        this.mark.data = data
        this.mark.action = (formData) => {
          this.mark.isSubmit = true

          this.axios.put(`penjualan/${id}/schedule`, formData).then(res => {
            this.toast('Jadwal Pengiriman Berhasil ditambahkan')
            this._get();
            this.mark.isSubmit = false
          }).catch( err => {
            this.onError(err)
            this.mark.isSubmit = false
          });
        }
      },

      _detail(data){
        this.detail.config = {view: true, title: 'Detail Penjualan'}
        this.detail.data = data
      },

      _pageChange(page){
        this.paginate.currentPage = page;
        this._get();
      },

      _search(keyword){
        this.dataFilter.keyword = keyword
        this._get()
      },
      _setSchedule(){
        let id =this.checkeds;
        this.mark.config = {view: true, title: 'Jadwal Pengiriman'}
        this.mark.data = id
        this.mark.action = (formData) => {
          this.loading = true;
          this.mark.isSubmit = true

          this.axios.post(`penjualan/schedule`, formData).then(res => {
            this.toast('Jadwal Pengiriman Berhasil ditambahkan')
            this.checkeds = []
            this._get();
            this.mark.isSubmit = false
            this.loading = false;
          }).catch( err => {
            this.onError(err)
            this.mark.isSubmit = false
          });
        }
      },
      _setForceClose(){
        let id = this.checkeds;
        this.data_close.checkeds = id;
        this.data_close.form=true;
        this.close.action = (formData) => {
          this._get();
          this.checkeds = [];
        }
      },
      _setBanner(data){
        //console.log(this.checker)
        let res     = {...data}
        if(this.checker != res.nama_kelurahan){
          this.checker = res.nama_kelurahan
          return true
        }
        else{
          return false
        }
      }
  },

  mounted(){
    this.auth = JSON.parse(localStorage.user)
    // this._get();
  },

  created(){
    this.checker = 0;
    // this._get({silent: true})
  }

};
</script>
<style lang="scss" scoped>
  .btn-position{
    position: fixed;
    right: 15px;
    bottom: 15px;
  }

  .navbar-text {
    padding-top: 0.5rem!important;
  }

  .nav-item {
    width: 20%;
  }

  .navbar-text.info {
    width: 60%;
  }

  .btn-pill-left{
    border-top-left-radius: 20px 20px; 
    border-bottom-left-radius: 20px 20px; 
    border-top-right-radius: 0px 0px; 
    border-bottom-right-radius: 0px 0px;
  }
  .btn-pill-right{
    border-top-left-radius: 0px 0px; 
    border-bottom-left-radius: 0px 0px; 
    border-top-right-radius: 20px 20px; 
    border-bottom-right-radius: 20px 20px;  }
  .fade-in-table {
  animation: fadeIn 1s;
    -webkit-animation: fadeIn 1s;
    -moz-animation: fadeIn 1s;
    -o-animation: fadeIn 1s;
    -ms-animation: fadeIn 1s;
  }
  @keyframes fadeIn {
    0% {opacity:0;}
    100% {opacity:1;}
  }

  @-moz-keyframes fadeIn {
    0% {opacity:0;}
    100% {opacity:1;}
  }

  @-webkit-keyframes fadeIn {
    0% {opacity:0;}
    100% {opacity:1;}
  }

  @-o-keyframes fadeIn {
    0% {opacity:0;}
    100% {opacity:1;}
  }

  @-ms-keyframes fadeIn {
    0% {opacity:0;}
    100% {opacity:1;}
  }
</style>
