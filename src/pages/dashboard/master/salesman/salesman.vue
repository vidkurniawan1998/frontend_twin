<template>
  <div class="antialiased">

    <Sidebar/>


    <div class="page">

      <Header @change="_search" hint="Ketik nama salesman"/>

      <div class="content">
        <div class="container">
          <!-- Page title -->
          <div class="page-header">
            <div class="row d-flex justify-content-between">
              <div class="col-auto">
                <h2 class="page-title">
                  Salesman
                </h2>
              </div>

              <!-- <div class="col-auto">
                <div class="text-muted text-h5 mt-2">Login Pada {{auth.logged_at}}</div>
              </div> -->

              <div class="col-auto">
                <div class="row">
                  <div class="col-auto p-0">

                    <div class="input-icon">
                      <span class="input-icon-addon"> <i class="fe fe-align-left"></i> </span>
                      <select class="form-control" v-model="paginate.perPage" @change="paginate.currentPage = 1; _get()" :disabled="loading">
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
                      <tr class="text-muted">
                        <th>No</th>
                        <th>Perusahaan</th>
                        <th>Nama Salesman</th>
                        <th>Tipe</th>
                        <th>No. Telepon</th>
                        <th>Tim</th>
                        <th>Depo</th>
                        <th>Gudang</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(row, i) in filter" :key="i" >
                        <td>{{paginate.fromPage + i}}</td>
                        <td><span class="badge bg-blue-lt mr-2"> {{ row.kode_perusahaan }} </span></td>
                        <td class="click-able" @click="_detail(row)">{{row.nama_salesman}}</td>
                        <td>{{row.tipe}}</td>
                        <td>{{row.phone}}</td>
                        <td>{{row.tim}} <span v-if="row.kode_eksklusif"> | {{ row.kode_eksklusif }}</span></td>
                        <td>{{row.depo}}</td>
                        <td>{{row.gudang}}</td>
                        <td class="p-0">
                          <div class="btn-group">
                            <button class="btn btn-white btn-sm" @click="_edit(row)" v-html="ic('edit')"></button>
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

    <FormFilter
      :config.sync="filters.config"
      :initData="filters.data" :dismiss.sync="filter.dismiss"
      :isSubmit.sync="filters.isSubmit"
      @submit="filters.action"
    />

    <FormSalesman
      :config.sync="form.config"
      :initData="form.data" :dismiss.sync="form.dismiss"
      :isSubmit.sync="form.isSubmit"
      @submit="form.action"
    />

    <DetailSalesman
      :config.sync="detail.config"
      :initData="detail.data" :dismiss.sync="detail.dismiss"
      :isSubmit.sync="detail.isSubmit"
      @submit="detail.action"
    />

    <Confirm :id.sync="confirm.id" :title.sync="confirm.title" :isSubmit.sync="confirm.isSubmit" @submit="confirm.action"/>

  </div>
</template>

<script>
import helper from "@/assets/js/helper.js";
import FormSalesman from "./modals/form-salesman.vue";
import DetailSalesman from "./modals/detail-salesman.vue";
import FormFilter from "./modals/filter.vue";

export default {
  name: "Salesman",
  components: { FormSalesman, DetailSalesman, FormFilter },

  data() {
    return {
        auth: {},

        form: {
          config: { view: false, title: null },
          data: null, isSubmit: false,
          action: () => {}
        },

        detail: {
          config: { view: false, title: null },
          data: null, isSubmit: false,
          action: () => {}
        },

        filters: {
          config: { view: false, title: null },
          data: null, isSubmit: false,
          action: () => {}
        },

        confirm: {
          id: null, title: null, isSubmit: false, action: () => {}
        },

        loading: true,
        data: [], filter: [],

        paginate: {
          currentPage: 1,
          totalRows: 0,
          perPage: 10,
          fromPage: 0
        },

        dataFilter: {
          keyword: '',
          depo: [],
          page:'',
          per_page:''
        }

    };
  },

  mixins: [helper],

  methods: {

      _get(params){
        this.loading = params == null ? true : !params.silent

        this.dataFilter.page = this.paginate.currentPage;
        this.dataFilter.per_page = this.paginate.perPage;

        this.axios.get("salesman",{params: this.dataFilter}).then(res => {
          this.loading = false;

          this.paginate.totalRows = res.data.meta.total;
          this.paginate.fromPage = res.data.meta.from
          this.data = this.filter = res.data.data;
        }).catch( err => {
          this.loading = false
          this.onError(err)
        });
      },

      _add(data){
        this.form.config = {view: true, title: 'Tambah Salesman'}
        this.form.data = null
        this.form.action = (formData) => {

          this.axios.post("salesman", formData).then(() => {

            this._get({silent: true})

            this.toast('Berhasil ditambahkan');
            this.form.config.view = false;
          }).catch( err => {
            this.onError(err);
            this.form.isSubmit = false;
          });
        }
      },

      _edit(data){
        this.form.config = {view: true, title: 'Edit Salesman'}
        this.form.data = data
        this.form.action = (formData) => {

          this.axios.put("salesman/"+data.id, formData).then(() => {

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
        this.confirm.title = 'Yakin ingin menghapus data kendaraan ini?'
        this.confirm.action = () => {

          this.axios.delete('kendaraan/'+id).then(() => {
            this.toast('Berhasil dihapus');
            this._get({silent: true})
            this.confirm.id = null
          }).catch( err => {
            this.onError(err);
            this.confirm.isSubmit = false
          });

        }
      },
      _filter(){
        this.filters.config = {view: true, title: 'Filter'}
        this.filters.action = (formData) => {
          for (const key in formData) {
            this.dataFilter[key] = formData[key]
          }

          this._get()
        }
      },

      _detail(data){
        this.detail.config = {view: true, title: data.nama_salesman}
        this.detail.data = data
      },

      _pageChange(page){
        this.paginate.currentPage = page;
        this._get();
      },

      _search(keyword){
        this.dataFilter.keyword = keyword
        this._get()
        // let k = keyword.toString().toLowerCase(); this.filter = []
        // for (let i = 0; i < this.data.length; i++) {
        //   if(this.data[i].nama_salesman.toLowerCase().includes(k)){
        //     this.filter.push(this.data[i])
        //   }
        // }
      },

  },

  mounted(){
    this.auth = JSON.parse(localStorage.user)
    this._get()
  }

};
</script>

<style lang="scss" scoped>
  hr{
    margin: 0 !important
  }
</style>
