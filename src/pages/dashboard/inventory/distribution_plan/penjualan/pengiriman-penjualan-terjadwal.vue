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
                  Pengiriman Penjualan Terjadwal
                </h2>
              </div>

              <div class="col-auto">
                <div class="row">

                  <div class="col-auto">
                    <div class="input-icon float-left">
                      <span class="input-icon-addon"> <i class="fe fe-align-left"></i> </span>
                      <select class="form-control" v-model="paginate.perPage" @change="reload = 0; _get()" :disabled="loading">
                        <option :value="num" v-for="(num, i) in [10,50,100,999]" :key="i" v-html="num === 999 ? 'Semua' : num"/>
                      </select>
                    </div>

                    <button class="btn btn-white ml-3" v-html="ic('filter')" @click="_filter"> </button>

                  </div>
                </div>

              </div>
            </div>
          </div>

          <div>
            <b-nav tabs>
              <b-nav-item >
                <router-link to="../distribution-plan">  Distribusi Penjualan </router-link>
              </b-nav-item>
              <b-nav-item active>
                 <router-link to="pengiriman-penjualan-terjadwal"> Pengiriman Penjualan Terjadwal </router-link>
              </b-nav-item>
            </b-nav>
          </div>

          <div style="margin-top: 20px;">
            <Skeleton type="table" :length="10" class="mt-3 bg-white" v-if="loading"/>

            <Nodata v-if="!loading && data.length === 0"/>

            <div class="box" v-if="!loading && data.length > 0">
              <div class="card">
                <div class="table-respon sive">
                  <table class="table table-vcenter table-hover card-table table-striped">

                    <thead>
                      <tr class="text-muted">
                        <th>No</th>
                        <th>No. Invoice</th>
                        <th>Toko</th>
                        <th>Tim</th>
                        <th>Status</th>
                        <th class="text-center">Pengiriman</th>
                        <th>Tgl PO</th>
                        <th>Tgl Jadwal</th>
                        <th>Print</th>
                        <th class="pos-relative">
                          <label class="form-check" style="position: absolute; top: 4px; right: 10px">
                            <input class="form-check-input" type="checkbox" :checked="data.length === checkeds.length" @click="_checkUncheck">
                            <span class="form-check-label"></span>
                          </label>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(row, i) in data" :key="i" :class="i === 0 && paginate.currentPage === 1 ? animate : ''">
                        <td v-html="i + paginate.fromPage"></td>
                        <td class="click-able text-primary" @click="_detail(row)">
                          <div>{{row.no_invoice}}</div>
                          <hr style="margin: 2px"/>
                          <div class="text-muted"> PO:{{ row.id }}</div>
                        </td>
                        <td :class="row.toko[0].status_verifikasi === 'N' ? 'text-danger' : ''">
                          <div>[{{row.toko[0].no_acc}}] {{row.toko[0].nama_toko}}</div>
                          <hr style="margin: 2px">
                          <div class="text-muted">{{row.toko[0].alamat}}</div>
                        </td>
                        <td>{{row.salesman[0].tim}}</td>
                        <td>{{row.tipe_pembayaran}}</td>
                        <td>
                          <div>D: {{row.nama_driver}}</div>
                          <hr style="margin: 2px"/>
                          <div class="text-muted">C: {{row.nama_checker}}</div>
                        </td>
                        <td>{{dateFormat(row.tanggal)}}</td>
                        <td>{{dateFormat(row.tanggal_jadwal)}}</td>
                        <td>{{ row.print_count }}</td>
                        <td class="text-right pos-relative" @click="_check(row.id)">
                          <label class="form-check" style="position: absolute; top: 50%; transform: translate(0, -50%); right: 10px">
                            <input class="form-check-input" type="checkbox" :value="row.id" v-model="checkeds">
                            <span class="form-check-label"></span>
                          </label>
                        </td>
                      </tr>
                    </tbody>

                  </table>
                </div>
              </div>
            </div>

            <b-pagination
                v-if="data.length > 0 && !loading"
                align="center" class="mt-5"
                :total-rows="paginate.totalRows"
                v-model="paginate.currentPage"
                :per-page="paginate.perPage"
                @change="_pageChange"
            />

            <transition name="slide-fade-y">
              <button
                  :disabled="loading"
                  class="btn btn-danger btn-pill btn-fixed"
                  style="right:720px"
                  @click="_setForceClose"
                  v-if="checkeds.length > 0">
                <i class="la la-lg la-clock-o"></i>
                Force Close {{checkeds.length}} Jadwal
              </button>
            </transition>

            <transition name="slide-fade-y">
              <button
                  :disabled="loading"
                  class="btn btn-danger btn-pill btn-fixed"
                  style="right:530px"
                  @click="_batal_jadwal"
                  v-if="checkeds.length > 0">
                <i class="la la-lg la-clock-o"></i>
                Batalkan {{checkeds.length}} Jadwal
              </button>
            </transition>

            <transition name="slide-fade-y">
              <button
                  :disabled="loading"
                  class="btn btn-info btn-pill btn-fixed"
                  style="right:256px"
                  @click="_jadwalkan_ulang"
                  v-if="checkeds.length > 0">
                <i class="la la-lg la-clock-o mr-1"></i>
                Jadwalkan Ulang {{checkeds.length}} Pengiriman
              </button>
            </transition>

            <transition name="slide-fade-y">
              <button
                  :disabled="loading"
                  class="btn btn-primary btn-pill btn-fixed"
                  @click="_tandai_terkirim"
                  v-if="checkeds.length > 0">
                <i class="la la-lg la-truck mr-1"></i>
                {{checkeds.length}} Tandai Sebagai Terkirim
              </button>
            </transition>
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
        @submit="confirm.action"
        :btnConfirm.sync="confirm.btnConfirm"
        :textConfirm.sync="confirm.textConfirm"
    />

    <DetailPenjualan
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

    <MarkSent
        :config.sync="mark_sent.config"
        :initData="mark_sent.data" :dismiss.sync="mark_sent.dismiss"
        :isSubmit.sync="mark_sent.isSubmit"
        @submit="mark_sent.action"
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
import FormFilter from "./modals/filter-terjadwal.vue";
import DetailPenjualan from "./modals/detail-penjualan.vue";
import DetailClose from "./modals/detail-force-close.vue";
import ScheduleSent from "./modals/schedule-sent.vue";
import MarkSent from "./modals/mark-sent";
import { mapState } from 'vuex';

const fb = require('@/db.js');

export default {
  name: "PengirimanPenjualanTerjadwal",
  components: { FormFilter, DetailPenjualan, ScheduleSent, MarkSent, DetailClose },

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

      mark_sent: {
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

      close: {
        config: { view: false, title: null },
        data: null, isSubmit: false,
        action: () => {}
      },

      loading: false,
      data: [],checkeds:[],

      paginate: {
        currentPage: 1,
        totalRows: 0,
        perPage: 999,
        fromPage: 0
      },

      dataFilter: {
        status: 'loaded',
        id_salesman: 'all',
        start_date: '2020-08-01', //this.dateTime('ymd'),
        end_date: this.dateTime('ymd'),
        tipe_pembayaran: 'all',
        keyword: '',
        depo:[],
        page:'',
        per_page:'',
        penjualan_terjadwal:''
      },

      fireTrigger: null

    };
  },

  mixins: [helper],

  methods: {

      _check(id){
        let io = this.checkeds.indexOf(id)

        if(this.checkeds.indexOf(id) > -1){
          this.checkeds.splice(io, 1)
        }else{
          this.checkeds.push(id)
        }
      },

      _checkUncheck(){
        if(this.checkeds.length !== this.data.length){
          this.checkeds = []

          for (let i = 0; i < this.data.length; i++) {
            let item = this.data[i]
            this.checkeds.push(item.id)
          }
        }else{
          this.checkeds = []
        }
      },

      _get(params){
        this.loading = params == null ? true : !params.silent

        this.dataFilter.page = this.paginate.currentPage;
        this.dataFilter.per_page = this.paginate.perPage;
        this.dataFilter.status = 'loaded';

        this.axios.get("penjualan/distribusi/report",{params: this.dataFilter}).then(res => {
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
          this.loading = true

          this.axios.put(`penjualan/${id}/schedule`, formData).then(res => {
            this.toast('Jadwal Pengiriman Berhasil ditambahkan')
            this._get();
            this.mark.isSubmit = false
            this.loading = false
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
      _jadwalkan_ulang(){
        let id = this.checkeds;
        this.mark.config = {view: true, title: 'Jadwal Pengiriman'}
        this.mark.data = id
        this.mark.action = (formData) => {
          this.mark.isSubmit = true
          this.loading = true;

          this.axios.post(`penjualan/reschedule`, formData).then(res => {
            this.toast('Jadwal Pengiriman Berhasil diUpdate')
            this.checkeds = []
            this.loading = false;
            this.mark.isSubmit = false
            this._get();
          }).catch( err => {
            this.onError(err)
            this.mark.isSubmit = false
            this.loading = false;
          });
        }
      },

      _batal_jadwal(){
        this.loading = true;
        let id =this.checkeds;
        this.mark.isSubmit = true

        this.axios.post(`penjualan/unschedule`, {id:id}).then(res => {
          this.toast('Jadwal Pengiriman Berhasil dibatalkan')
          this.checkeds = []
          this._get();
          this.mark.isSubmit = false
          this.loading = false;
        }).catch( err => {
          this.onError(err)
          this.mark.isSubmit = false
        });
      },

      _tandai_terkirim() {
        let id = this.checkeds;
        this.mark_sent.config = {view: true, title: 'Penjualan Terkirim'}
        this.mark_sent.data = id
        this.mark_sent.action = (formData) => {
          this.mark_sent.isSubmit = true

          this.axios.post(`penjualan/distribusi/bulk_deliver`, formData).then(res => {
            this.toast('Penjualan berhasil dikirim')
            this.checkeds = []
            this._get();
            this.mark_sent.isSubmit = false
          }).catch( err => {
            this.onError(err)
            this.mark_sent.isSubmit = false
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
      }
  },

  mounted(){
    this.auth = JSON.parse(localStorage.user)
    // this._get();
  },

  created(){
  },

  watch: {
    // fireTrigger(){
    //   this._get({silent: true})
    // },
  }

};
</script>
<style lang="scss" scoped>

  .btn-fixed{
    position: fixed;
    right: 15px;
    bottom: 15px;
    z-index: 1000;
  }

</style>
