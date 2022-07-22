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
                  Delivery Report
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
                  <table class="table table-vcenter table-hover card-table table-striped">

                    <thead>
                      <tr class="text-muted">
                        <th>No</th>
                        <th>No. PO</th>
                        <th>No. Invoice</th>
                        <th>Toko</th>
                        <th>Salesman</th>
<!--                        <th>Tgl PO</th>-->
                        <th>Tgl Deliver</th>
                        <th>Jam Sampai</th>
                        <th class="text-center">Driver</th>
                        <th>Checker</th>
                        <th>Status</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(row, i) in data" :key="i" :class="i == 0 && paginate.currentPage == 1 ? animate : ''">
                        <td v-html="i + paginate.fromPage"></td>
                        <td class="text-primary"> {{row.id}} </td>
                        <td>{{row.no_invoice}}</td>
                        <td :class="row.toko[0].status_verifikasi == 'N' ? 'text-danger' : ''"> [{{row.toko[0].no_acc}}] {{row.toko[0].nama_toko}} </td>
                        <td>{{row.salesman[0].tim}} - {{row.salesman[0].nama_salesman}}</td>
<!--                        <td>{{dateFormat(row.tanggal)}}</td>-->
                        <td>{{row.delivered_at != '' ? dFormat(row.delivered_at, 'dmY') : '-'}}</td>
                        <td>{{row.jam_sampai}}</td>
                        <td> {{row.nama_driver}} </td>
                        <td>{{row.nama_checker}}</td>
                        <td> <span v-html="row.status" class="badge w-100" :class="row.status == 'waiting' ? 'bg-orange' : row.status == 'approved' ? 'bg-green' : 'bg-info'"></span> </td>
                        <td class="p-0">
                            <b-dropdown variant="link" size="lg" dropleft no-caret>
                              <template slot="button-content"> <i class="fe fe-more-vertical"></i> </template>
                              <b-dropdown-item to="#" @click.native="_detail(row)">Rincian</b-dropdown-item>
                              <b-dropdown-item @click="setSchedule(row)" v-if="row.status =='approved'">Jadwalkan Pengiriman</b-dropdown-item>
                              <b-dropdown-item @click="_cancelAsSent(row.id)" v-if="row.status =='delivered' && _role('Unapprove Adjustment Barang')">Batalkan Status Terkirim</b-dropdown-item>
                            </b-dropdown>
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

    <FormFilter
      :config.sync="filter.config"
      :initData="filter.data" :dismiss.sync="filter.dismiss"
      :isSubmit.sync="filter.isSubmit"
      @submit="filter.action"
    />

    <Confirm :id.sync="confirm.id" :title.sync="confirm.title" :subTitle.sync="confirm.subTitle" :isSubmit.sync="confirm.isSubmit" @submit="confirm.action" :btnConfirm.sync="confirm.btnConfirm" :textConfirm.sync="confirm.textConfirm"/>

    <DetailPenjualan
      :config.sync="detail.config"
      :initData="detail.data" :dismiss.sync="detail.dismiss"
      :isSubmit.sync="detail.isSubmit"
      @submit="detail.action"
    />
  </div>
</template>

<script>
import helper from "@/assets/js/helper.js";
import FormFilter from "./modals/filter.vue";
import DetailPenjualan from "./modals/detail-penjualan.vue";

const fb = require('@/db.js');

export default {
  name: "distributionPlanDeliverReport",
  components: { FormFilter, DetailPenjualan },

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
        status: 'delivered',
        id_salesman: 'all',
        start_date: '2020-08-18', //this.dateTime('ymd'),
        end_date: this.dateTime('ymd'),
        tipe_pembayaran: 'all',
        keyword: '',
        delivery_report: '',
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

          this._get()
        }
      },
      _cancelAsSent(id){
        this.confirm.id = id
        this.confirm.title = 'Yakin ingin membatalkan penjualan ini sudah terkirim?'
        this.confirm.subTitle = 'Status penjualan akan kembali menjadi approved'
        this.confirm.btnConfirm = 'btn-primary'
        this.confirm.textConfirm = 'Batalkan Tandai Terkirim'
        this.confirm.action = () => {

          this.axios.post('penjualan/undeliver/'+id).then(res => {
            this.findObject(this.data, 'id', id, (key) => {
              this.data[key].status = 'approved'
            });

            this.toast('Ditandai terkirim dibatalkan');
            this.confirm.id = null
          }).catch( err => {
            this.onError(err);
            this.confirm.isSubmit = false
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

      _triggerFirestore(){
        fb.firestore.collection('trigger_logistik').doc('delivered').onSnapshot((doc) => {
          this.fireTrigger = doc.data().trigger;
        });
      },

      _createExcel(){
        this.isExcelRequest = true

        this.axios.get('report/get_report/delivery', {params: this.dataFilter}).then(res => {
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
  },

  created(){
    this._triggerFirestore()
  },

  watch: {
    fireTrigger(){
      this._get({silent: true})
    },
  }

};
</script>
