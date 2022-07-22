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
                  Penjualan
                </h2>
              </div>

              <!-- <div class="col-auto">
                <div class="text-muted text-h5 mt-2">Login Pada {{auth.logged_at}}</div>
              </div> -->

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

                    <div class="btn-group ml-3">
                      <button class="btn btn-outline-primary" @click="_printInvoice"> Cetak Invoice </button>
                      <button class="btn btn-primary" @click="_add"> Tambah </button>
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
                <div class="table-responsive">
                  <table class="table table-vcenter table-hover card-table table-striped">

                    <thead>
                      <tr class="text-muted">
                        <th>No</th>
                        <th>Comp</th>
                        <th>No. Nota</th>
                        <th>Toko</th>
                        <th>Salesman</th>
                        <th>Tgl PO</th>
                        <th>Tgl Deliver</th>
                        <th>Tipe Pembayaran</th>
                        <th class="text-center">Status</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(row, i) in data" :key="i" :class="i == 0 && paginate.currentPage == 1 ? animate : ''">
                        <td v-html="i + paginate.fromPage"></td>
                        <td>
                          <span class="badge bg-blue-lt mr-2">{{row.kode_perusahaan}}</span>
                        </td>
                        <td class="click-able text-primary" @click="_detail(row)">
                          PO: {{row.id}} <br>
                          {{row.no_invoice}}
                        </td>
                        <td :class="{ 'text-danger': row.toko[0].status_verifikasi == 'N', 'text-primary': row.id_mitra != 0}">
                          [{{row.toko[0].no_acc}}] {{row.toko[0].nama_toko}} <span class="badge bg-danger" v-if="row.pending_status !== null">{{ row.pending_status }}</span>
                        </td>
                        <td>{{row.nama_tim}} - {{row.salesman[0].nama_salesman.slice(0,10)}}</td>
                        <td>{{dateFormat(row.tanggal)}}</td>
                        <td>{{row.delivered_at != '' ? dFormat(row.delivered_at, 'dmY') : '-'}}</td>
                        <td>{{row.tipe_pembayaran}}</td>
                        <td> <span v-html="row.status" class="badge w-100" :class="row.status == 'waiting' ? 'bg-orange' : row.status == 'approved' ? 'bg-green' : row.status == 'closed' ? 'bg-danger':'bg-info'"></span> </td>
                        <td class="p-0">
                            <b-dropdown variant="link" size="lg" dropleft no-caret>
                              <template slot="button-content"> <i class="fe fe-more-vertical"></i> </template>
                              <b-dropdown-item @click.native="_detail(row)">Rincian</b-dropdown-item>
                              <b-dropdown-item @click="_markAsSent(row.id)" v-if="row.status =='approved' || row.status =='loaded'">Tandai Sebagai Terkirim</b-dropdown-item>
                              <b-dropdown-item @click="_cancelAsSent(row.id)" v-if="row.status =='delivered'">Batalkan Status Terkirim</b-dropdown-item>
                              <b-dropdown-item @click="_editDueDate(row)" v-if="row.status =='delivered'">Update Due Date</b-dropdown-item>
                              <b-dropdown-item @click="_edit(row)" v-if="row.status =='waiting'">Edit</b-dropdown-item>
                              <b-dropdown-item @click="_closed(row)" v-if="row.status =='waiting'">Batalkan</b-dropdown-item>
                              <b-dropdown-item @click="_delete(row.id)" v-if="row.status =='waiting'">Hapus</b-dropdown-item>
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

    <PrintInvoice
      :config.sync="invoice.config"
      :initData="invoice.data" :dismiss.sync="invoice.dismiss"
      :isSubmit.sync="invoice.isSubmit"
      @submit="invoice.action"
    />

    <FormPenjualanBaru
      :config.sync="penjualan.config"
      :initData="penjualan.data" :dismiss.sync="penjualan.dismiss"
      :isSubmit.sync="penjualan.isSubmit"
      @submit="penjualan.action"
    />

    <FormPenjualanBarang
      :config.sync="form.config"
      :initData="form.data" :dismiss.sync="form.dismiss"
      :isSubmit.sync="form.isSubmit"
      @submit="form.action"
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
      @approved="_setApproved"
      @submit="detail.action"
    />

    <MarkSent
      :config.sync="mark.config"
      :initData="mark.data" :dismiss.sync="mark.dismiss"
      :isSubmit.sync="mark.isSubmit"
      @submit="mark.action"
    />

    <DueDate
        :config.sync="due.config"
        :initData="due.data" :dismiss.sync="due.dismiss"
        :isSubmit.sync="due.isSubmit"
        @submit="due.action"
    />

    <Closed
        :config.sync="closed.config"
        :initData="closed.data" :dismiss.sync="closed.dismiss"
        :isSubmit.sync="closed.isSubmit"
        @submit="closed.action"
    />

  </div>
</template>

<script>
import helper from "@/assets/js/helper.js";
import PrintInvoice from "./modals/print-invoice.vue";
import FormFilter from "./modals/filter.vue";
import FormPenjualanBarang from "./modals/form-penjualan-barang.vue";
import FormPenjualanBaru from "./modals/form-penjualan-baru.vue";
import DetailPenjualan from "./modals/detail-penjualan.vue";
import MarkSent from "./modals/mark-sent.vue";
import DueDate from "./modals/due-date.vue";
import Closed from "./modals/closed";

const fb = require('@/db.js');

export default {
  name: "Penjualan",
  components: {
    PrintInvoice,
    FormFilter,
    FormPenjualanBarang,
    FormPenjualanBaru,
    DetailPenjualan,
    MarkSent,
    DueDate,
    Closed
  },
  data() {
    return {
      auth: {}, animate: null, reload: 0,

      filter: {
        config: { view: false, title: null },
        data: null, isSubmit: false,
        action: () => {}
      },

      invoice: {
        config: { view: false, title: null },
        data: null, isSubmit: false,
        action: () => {}
      },

      form: {
        config: { view: false, title: null },
        data: null, isSubmit: false,
        action: () => {}
      },

      penjualan: {
        config: { view: false, title: null },
        data: null, isSubmit: false,
        action: () => {}
      },

      mark: {
        config: { view: false, title: null },
        data: null, isSubmit: false,
        action: () => {}
      },

      due: {
        config: { view: false, title: null },
        data: null, isSubmit: false,
        action: () => {}
      },

      closed: {
        config: { view: false, title: null },
        data: null, isSubmit: false,
        action: () => {}
      },

      confirm: {
        id: null,
        title: null,
        isSubmit: false,
        action: () => {},
        subTitle: 'Penghapusan ini bersifat permanen',
        btnConfirm: 'btn-danger', textConfirm: 'Hapus Sekarang'
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
        status_pending: '-',
        status: 'all',
        id_salesman: [],
        start_date: '2020-08-01', //this.dateTime('ymd'),
        end_date: this.dateTime('ymd'),
        tipe_pembayaran: 'all',
        keyword: '',
        depo:[],
        page:'',
        per_page:'',
        id_mitra: '1',
      },

      fireTrigger: null

    };
  },

  mixins: [helper],

  methods: {

      _get(params){
        this.loading = params == null ? true : !params.silent

        this.dataFilter.page = this.paginate.currentPage;
        this.dataFilter.per_page = this.paginate.perPage;

        this.axios.get("penjualan",{params: this.dataFilter}).then(res => {
          this.data = res.data.data;
          this.loading = false;

          this.paginate.totalRows = res.data.meta.total;
          this.paginate.fromPage = res.data.meta.from;

          if(params!= null && params.po != null){
            this.penjualan.config.view = false
            let added = this.data.find(item => item['id'] == params.po)
            this._detail(added)
            this.toast('Berhasil ditambahkan')
          }

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

      _printInvoice(){
        this.invoice.config = {view: true, title: 'Cetak Invoice Penjualan'}
      },

      _add(){
        this.penjualan.config = {view: true, title: 'Penjualan Baru'}
        this.penjualan.data = null
        this.penjualan.action = (formData) => {
          this.penjualan.isSubmit = true
          this.axios.post('penjualan/web', formData).then(res => {
            this._get({silent: true, po: res.data.id})
          }).catch(err => {
            this.onError(err)
            this.penjualan.isSubmit = false
          })
        }

      },

      _edit(data){
        this.form.config = {view: true, title: 'Edit Penjualan'}
        this.form.data = data
        this.form.action = (formData) => {
          this.axios.put('penjualan/'+data.id+'?per_page='+this.paginate.perPage+'&page='+this.paginate.currentPage, formData).then(res => {

            this.findObject(this.data, 'id', data.id, (d, i) => {
              let _data = formData

              for (const key in _data) {
                this.data[i][key] = _data[key]
              }
            });

            this.toast('Berhasil diperbarui');
            this.form.config.view = false;
          }).catch( err => {
            this.onError(err);
            this.form.isSubmit = false;
          });
        }
      },

      _delete(id){
        this.confirm.id = id
        this.confirm.title = 'Yakin ingin menghapus data penjualan ini?',
        this.confirm.subTitle = 'Penghapusan ini bersifat permanen'
        this.confirm.action = () => {
          let url = 'penjualan/'+id+'?per_page='+this.paginate.perPage+'&start_date='+this.dataFilter.start_date+'&end_date='+this.dataFilter.end_date+'&id_salesman='+this.dataFilter.id_salesman;

          this.axios.delete(url).then(res => {
            this._get({silent: true})
            this.toast('Berhasil dihapus');
            this.confirm.id = null
          }).catch( err => {
            this.onError(err);
            this.confirm.isSubmit = false
          });

        }
      },

      _markAsSent(id){
        this.mark.config = {view: true, title: 'Tandai Sebagai Terkirim'}
        this.mark.data = null
        this.mark.action = (formData) => {
          this.mark.isSubmit = true

          this.axios.post('penjualan/deliver/'+id, formData).then(res => {
            this.findObject(this.data, 'id', id, (key) => {
              this.data[key].status = 'delivered'
            });

            this.toast('Ditandai terkirim');
            this.mark.isSubmit = false
          }).catch( err => {
            this.onError(err);
            this.mark.isSubmit = false
          });
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

      _editDueDate(data) {
        let id = data.id
        this.due.config = {view: true, title: 'Ubah Due Date'}
        this.due.data = data
        this.due.action = (formData) => {
          this.due.isSubmit = true
          this.axios.put(`penjualan/${id}/update_due_date`, formData).then(res => {
            this.toast('Due date berhasil diubah')
            this.due.isSubmit = false
          }).catch( err => {
            this.onError(err)
            this.due.isSubmit = false
          });
        }
      },

      _closed(data) {
        let id = data.id
        this.closed.config = {view: true, title: 'Batalkan Penjualan'}
        this.closed.data = data
        this.closed.action = (formData) => {
          this.closed.isSubmit = true
          this.axios.post(`penjualan/${id}/close`, formData).then(res => {
            this.toast('Penjualan berhasil dibatalkan')
            this._get({silent: true})
            this.closed.isSubmit = false
          }).catch( err => {
            this.onError(err)
            this.closed.isSubmit = false
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
        fb.firestore.collection('trigger_sales').doc('penjualan').onSnapshot((doc) => {
          this.fireTrigger = doc.data().trigger;
        });
      },
      _setApproved(data) {
        this.findObject(this.data, 'id', data.id, (key) => {
          this.data[key].status = data.status
        });
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
