<template>
  <div class="antialiased">

    <Sidebar/>


    <div class="page">

      <Header @change="_search" hint="Ketik nama promo"/>

      <div class="content">
        <div class="container">
          <!-- Page title -->
          <div class="page-header">
            <div class="row d-flex justify-content-between">
              <div class="col-auto">
                <h2 class="page-title">
                  Promo
                </h2>
              </div>

              <!-- <div class="col-auto">
                <div class="text-muted text-h5 mt-2">Login Pada {{auth.logged_at}}</div>
              </div> -->

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
                    <button class="btn btn-white ml-0" v-html="ic('filter')" @click="_filter"> </button>
                    <div class="btn-group ml-3">
                      <button class="btn btn-outline-primary" @click="_createExcel" v-html="ic('download')+' Export Excel'" />
                      <button class="btn btn-primary" @click="$router.push({name: 'Add Promo'})"> Tambah </button>
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
                        <th>No Proposal</th>
                        <th>Nama Promo</th>
                        <th>Diskon Rupiah</th>
                        <th>Diskon Persen</th>
                        <th>Barang Ekstra</th>
                        <th>Status</th>
                        <th>Depo</th>
                        <th>Masa Berlaku</th>
                        <th>Keterangan</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(row, i) in data" :key="i">
                        <td>{{paginate.fromPage + i}}</td>
                        <td><span class="badge bg-blue-lt mr-2">{{ row.kode_perusahaan }}</span></td>
                        <td style="width: 10%;">{{row.no_promo == null ? '-' : row.no_promo}}</td>
                        <td style="width: 15%;">{{row.nama_promo}}</td>
                        <td>{{row.disc_rupiah}}</td>
                        <td>{{parseFloat(row.disc_persen).toFixed(2)}}</td>
                        <td>{{row.nama_barang == null ? ' - ' : row.nama_barang}}</td>
                        <td>{{row.status}}</td>
                        <td> <span class="badge bg-blue-lt mr-2" v-for="(depo, l) in row.depo" :key="l" v-html="depo.nama_depo"></span> </td>
                        <td style="width: 10%">{{row.tanggal_awal == null ? '-' : dateFormat(row.tanggal_awal)+' - '+dateFormat(row.tanggal_akhir)}}</td>
                        <td style="width: 20%">{{row.keterangan == 'null' ? '-' : row.keterangan}}</td>
                        <td class="p-0">
                            <b-dropdown dropleft variant="link" size="lg" no-caret>
                              <template slot="button-content"> <i class="fe fe-more-vertical"></i> </template>
                              <b-dropdown-item @click="$router.push({name: 'Edit Promo', params: { id: row.id}})">Edit</b-dropdown-item>
                              <b-dropdown-item @click="_delete(row.id)">Hapus</b-dropdown-item>
                              <b-dropdown-item @click="_duplicate(row.id)">Duplikat</b-dropdown-item>
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
      :initData="filter.data"
      :dismiss.sync="filter.dismiss"
      :isSubmit.sync="filter.isSubmit"
      @submit="filter.action"
    />

    <Confirm
        :id.sync="duplicate.id"
        :title.sync="duplicate.title"
        :text-confirm.sync="duplicate.textConfirm"
        :sub-title.sync="duplicate.subTitle"
        :isSubmit.sync="duplicate.isSubmit" @submit="duplicate.action"/>

    <Confirm
        :id.sync="confirm.id"
        :title.sync="confirm.title"
        :isSubmit.sync="confirm.isSubmit" @submit="confirm.action"/>

  </div>
</template>

<script>
import helper from "@/assets/js/helper.js";
import FormFilter from "./modals/filter.vue";

export default {
  name: "Promo",
  components: { FormFilter },

  data() {
    return {
        auth: {},

        filter: {
          config: { view: false, title: null },
          data: null, isSubmit: false,
          action: () => {}
        },

        confirm: {
          id: null, title: null, isSubmit: false, action: () => {}
        },

        duplicate: {
          id: null, title: null, isSubmit: false, action: () => {}, textConfirm: null, subTitle: null
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
          depo: [],
          jenis_salesman: [],
          status: 'all'
        },

    };
  },

  mixins: [helper],

  methods: {

      _get(params){
        this.loading = params == null ? true : !params.silent
        this.dataFilter.page = this.paginate.currentPage;
        this.dataFilter.per_page = this.paginate.perPage;

        this.axios.get('promo', {
          params: this.dataFilter
        }).then(res => {
          this.loading = false;

          this.paginate.totalRows = res.data.meta.total;
          this.paginate.fromPage = res.data.meta.from
          this.data = res.data.data;
        }).catch( err => {
          this.loading = false
          this.onError(err)
        });
      },

      _add(){
        this.form.config = {view: true, title: 'Tambah Promo'}
        this.form.data = null
        this.form.action = (formData) => {

          this.axios.post('promo', formData).then(() => {

            this.toast('Berhasil ditambahkan');
            this._get()

            this.form.config.view = false;
          }).catch( err => {
            this.onError(err);
            this.form.isSubmit = false;
          });
        }
      },

      _edit(data){
        this.form.config = {view: true, title: 'Edit Promo'}
        this.form.data = data
        this.form.action = (formData) => {

          this.axios.post('promo/'+data.id, formData).then(() => {

            this._get({silent: true})

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
        this.confirm.title = 'Yakin ingin menghapus data promo ini?'
        this.confirm.action = () => {

          this.axios.delete('promo/'+id).then(() => {
            this.toast('Berhasil dihapus');

            // this.findObject(this.data, 'id', id, (d, i) => {
            //   this.data.splice(i, 1)
            // })
            this._get({silent: true})

            this.confirm.id = null
          }).catch( err => {
            this.onError(err);
            this.confirm.isSubmit = false
          });

        }
      },
      _duplicate(id){
        this.duplicate.id = id
        this.duplicate.title = 'Yakin ingin menduplikasi data promo ini?'
        this.duplicate.textConfirm = 'Ya, duplikat'
        this.duplicate.action = () => {

          this.axios.post(`promo/${id}/duplicate`).then(() => {
            this.toast('Berhasil diduplikat');

            // this.findObject(this.data, 'id', id, (d, i) => {
            //   this.data.splice(i, 1)
            // })
            this._get({silent: true})

            this.duplicate.id = null
          }).catch( err => {
            this.onError(err);
            this.duplicate.isSubmit = false
          });

        }
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

        let dataExcel = []
        let i = 1
        for (let dt of this.data ) {
          let nama_depo = dt.depo.map(item => item.nama_depo) || '';
          let excel = {
            'No' : i++,
            'No Proposal' : dt.no_promo,
            'Nama Promo' : dt.nama_promo,
            'Disk. Persen': dt.disc_persen,
            'Disk. Rupiah': dt.disc_rupiah,
            'Extra' : dt.nama_barang,
            'Status': dt.status,
            'Tanggal Mulai' : dt.tanggal_awal,
            'Tanggal Selesai' : dt.tanggal_akhir,
            'Status Klaim': dt.status_klaim,
            'Depo': nama_depo.toString(),
            'Keterangan' : dt.keterangan
          }

          dataExcel.push(excel)
        }

        this.createExcel({data: dataExcel, filename: 'daftar-promo-aktif'}, true)
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
  },

  mounted(){
    this.auth = JSON.parse(localStorage.user)
    this._get()
  }

};
</script>
