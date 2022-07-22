<template>
  <div class="antialiased">
    <Sidebar/>
    <div class="page">
      <Header @change="_search"/>
      <div class="content">
        <div class="container">
          <!-- Page title -->
          <div class="page-header">
            <div class="row d-flex justify-content-between">
              <div class="col-auto">
                <h2 class="page-title">
                  Penerimaan Barang
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
                      <select class="form-control" v-model="paginate.perPage" @change="_get" :disabled="loading">
                        <option :value="num" v-for="(num, i) in [10,50,100,999]" :key="i" v-html="num == 999 ? 'Semua' : num"/>
                      </select>
                    </div>

                  </div>

                  <div class="col-auto">
                    <button class="btn btn-white mr-3" v-html="ic('filter')" @click="_filter"> </button>
                    <button class="btn btn-primary" @click="_add"> Tambah </button>
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
                          <tr>
                            <th>No PB</th>
                            <th>Nama Gudang</th>
                            <th>Terima Dari</th>
                            <th>No SJ</th>
                            <th>Tanggal Bongkar</th>
                            <th>Status</th>
                            <th></th>
                          </tr>
                      </thead>
                      <tbody>
                          <tr v-for="(row, i) in data" :key="i">
                            <td><router-link to="" @click.native="_detail(row)"> {{row.no_pb}} </router-link> <br> {{row.no_invoice}}</td>
                            <td>{{row.nama_gudang}}</td>
                            <td>{{row.nama_principal}}</td>
                            <td>{{row.no_do}}</td>
                            <td>{{row.tgl_bongkar}}</td>
                            <td> <span v-html="row.is_approved == 0 ? 'menunggu' : 'disetujui'" class="badge w-100" :class="row.is_approved == 0 ? 'bg-orange' : 'bg-green'"></span> </td>
                            <td class="p-0">
                                <b-dropdown variant="link" size="lg" dropleft no-caret>
                                  <template slot="button-content"> <i class="fe fe-more-vertical"></i> </template>
                                  <b-dropdown-item @click="_detail(row)"> Rincian </b-dropdown-item>
                                  <b-dropdown-item v-if="row.is_approved == 0" @click="_edit(row)">Edit</b-dropdown-item>
                                  <b-dropdown-item v-if="row.is_approved == 0" @click="_delete(row.id)">Hapus</b-dropdown-item>
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

    <FormPenerimaanBarang
      :config.sync="form.config"
      :initData="form.data" :dismiss.sync="form.dismiss"
      :isSubmit.sync="form.isSubmit"
      @submit="form.action"
    />

    <Confirm :id.sync="confirm.id" :title.sync="confirm.title" :isSubmit.sync="confirm.isSubmit" @submit="confirm.action"/>

    <DetailPenerimaanBarang
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
import FormPenerimaanBarang from "./modals/form-penerimaan-barang.vue";
import DetailPenerimaanBarang from "./modals/detail-penerimaan-barang.vue";

export default {
  name: "PenerimaanBarang",
  components: { FormFilter, FormPenerimaanBarang, DetailPenerimaanBarang },

  data() {
    return {
        auth: {},

        filter: {
          config: { view: false, title: null },
          data: null, isSubmit: false,
          action: () => {}
        },

        form: {
          config: { view: false, title: null },
          data: null, isSubmit: false,
          action: () => {}
        },

        confirm: {
          id: null, title: null, isSubmit: false, action: () => {}
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
          id_gudang: 'all',
          status: 'all',
          start_date: this.dateTime('ymd'),
          end_date: this.dateTime('ymd'),
          keyword: ''
        },

    };
  },

  mixins: [helper],

  methods: {

      _get(){
        this.loading = true
        this.axios.get('penerimaan_barang', {
          params: {
            per_page  : this.paginate.perPage,
            page      : this.paginate.currentPage,
            id_gudang : this.dataFilter.id_gudang,
            status    : this.dataFilter.status,
            start_date: this.dataFilter.start_date,
            end_date  : this.dataFilter.end_date,
            keyword   : this.dataFilter.keyword
          }
        }).then(res => {
          this.loading = false;
          this.paginate.totalRows = res.data.meta.total;
          this.data = res.data.data;
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

      _add(){
        this.form.config = {view: true, title: 'Tambah Penerimaan Barang'}
        this.form.action = (formData) => {

          this.axios.post('penerimaan_barang', formData).then(res => {
            this._get();
            this.data = res.data.data;
            this.toast('Berhasil ditambahkan');
            this.form.config.view = false;
          }).catch( err => {
            this.onError(err);
            this.form.isSubmit = false;
          });
        }
      },

      _edit(data){
        this.form.config = {view: true, title: 'Edit Penerimaan Barang'}
        this.form.data = data
        this.form.action = (formData) => {

          this.axios.put('penerimaan_barang/'+data.id, formData).then(res => {
            this._get()
            this.findObject(this.data, 'id', data.id, (d, i) => {
              let _data = res.data.data

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
        this.confirm.title = 'Yakin ingin menghapus data pengiriman ini?'
        this.confirm.action = () => {

          this.axios.delete('penerimaan_barang/'+id+'?per_page='+this.paginate.perPage+'&page='+this.paginate.currentPage).then(res => {
            this.data = res.data.data;
            this.toast('Berhasil dihapus');

            this.confirm.id = null
          }).catch( err => {
            this.onError(err);
            this.confirm.isSubmit = false
          });

        }
      },

      _detail(data){
        this.detail.config = {view: true, title: 'Detail Penerimaan Barang'}
        this.detail.data = data
      },

      _pageChange(page){
        this.paginate.currentPage = page;
        this._get();
      },

      _search(keyword){
        this.dataFilter.keyword = keyword
        this._get()
      }

  },

  mounted(){
    this.auth = JSON.parse(localStorage.user)
    this._get()
  }

};
</script>
