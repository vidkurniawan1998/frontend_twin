<template>
  <div class="antialiased">

    <Sidebar/>


    <div class="page">
      
      <Header @change="_search" hint="Ketik nama role"/>

      <div class="content">
        <div class="container">
          <!-- Page title -->
          <div class="page-header">
            <div class="row d-flex justify-content-between">
              <div class="col-auto">
                <h2 class="page-title">
                  Role
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
                        <th>Nama Role</th>
                        <th>Created At</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(row, i) in data" :key="i">
                        <td>{{paginate.fromPage + i}}</td>
                        <td>{{row.name}}</td>
                        <td>{{row.created_at}}</td>
                        <th class="text-right">
                          <div class="btn-group">
                            <button class="btn btn-white btn-sm" @click="_edit(row)" v-html="ic('edit')"/>
                            <button class="btn btn-white btn-sm text-danger" @click="_delete(row.id)" v-html="ic('trash')"/>
                          </div>
                        </th>
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

    <FormRole
      :config.sync="form.config"
      :initData="form.data" :dismiss.sync="form.dismiss"
      :isSubmit.sync="form.isSubmit"
      @submit="form.action"
    />

    <Confirm :id.sync="confirm.id" :title.sync="confirm.title" :isSubmit.sync="confirm.isSubmit" @submit="confirm.action" :btnConfirm.sync="confirm.btnConfirm" :textConfirm.sync="confirm.textConfirm"/>

  </div>
</template>

<script>
import helper from "@/assets/js/helper.js";
import FormRole from "./modals/form-role.vue";

export default {
  name: "Role",
  components: { FormRole },

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
        id: null, title: null, isSubmit: false, action: () => {}, btnConfirm: 'btn-danger', textConfirm: 'Hapus Sekarang'
      },

      detail: {
        config: { view: false, title: null },
        data: null, isSubmit: false,
        action: () => {}
      },

      loading: true,
      data: [], dataOri: [],
  
      paginate: {
        currentPage: 1,
        totalRows: 0,
        perPage: 10,
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
        this.loading = true

        let url = 'role?per_page='+this.paginate.perPage+'&page='+this.paginate.currentPage+'&keyword='+this.dataFilter.keyword;
        this.axios.get(url).then(res => {
          this.loading = false;
          this.paginate.totalRows = res.data.meta.total;
          this.paginate.fromPage = res.data.meta.from;
          this.data = this.dataOri = res.data.data;
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
        this.form.config = {view: true, title: 'Tambah Role'}
        this.form.data = null
        this.form.action = (formData) => {
          formData.name = this.ucwords(formData.name)
          
          this.axios.post('role', formData).then(() => {
            this._get()
            this.toast('Berhasil diperbarui');
            this.form.config.view = false;
          }).catch( err => {
            this.onError(err);
            this.form.isSubmit = false;
          });
        }
      },

      _edit(data){
        this.form.config = {view: true, title: 'Edit Role'}
        this.form.data = data
        this.form.action = (formData) => {
          formData.name = this.ucwords(formData.name)
          
          this.axios.put('role/'+data.id, formData).then(() => {
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
        this.confirm.title = 'Yakin ingin menghapus role ini?'
        this.confirm.action = () => {
          
          this.axios.delete('role/'+id).then(() => {
            this.toast('Berhasil dihapus');
            this._get()

            this.confirm.id = null
          }).catch( err => {
            this.onError(err);
            this.confirm.isSubmit = false
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

  },

  mounted(){
    this.auth = JSON.parse(localStorage.user)
    this._get()
  },

};
</script>
