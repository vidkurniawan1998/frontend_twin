<template>
  <div class="antialiased">

    <Sidebar/>


    <div class="page">
      
      <Header @change="_search" hint="Ketik nama segmen"/>

      <div class="content">
        <div class="container">
          <!-- Page title -->
          <div class="page-header">
            <div class="row d-flex justify-content-between">
              <div class="col-auto">
                <h2 class="page-title">
                  Segmen
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
                <div class="table-responsive">
                  <table class="table table-vcenter table-hover card-table table-striped">

                    <thead>
                      <tr class="text-muted">
                        <th>No</th>
                        <th>Nama Segmen</th>
                        <th>Nama Brand</th>
                        <th>Nama Principal</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(row, i) in filter" :key="i">
                        <td>{{paginate.fromPage + i}}</td>
                        <td>{{row.nama_segmen}}</td>
                        <td>{{row.nama_brand}}</td>
                        <td>{{row.nama_principal}}</td>
                        <td class="p-0">
                          <div class="btn-group">
                            <button class="btn btn-white btn-sm" @click="_edit(row)" v-html="ic('edit')"></button>
                            <button class="btn btn-white btn-sm text-danger" @click="_delete(row.id)" v-html="ic('trash')"></button>
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

    <FormSegmen
      :config.sync="form.config"
      :initData="form.data" :dismiss.sync="form.dismiss"
      :isSubmit.sync="form.isSubmit"
      @submit="form.action"
    />

    <Confirm :id.sync="confirm.id" :title.sync="confirm.title" :isSubmit.sync="confirm.isSubmit" @submit="confirm.action"/>

  </div>
</template>

<script>
import helper from "@/assets/js/helper.js";
import FormSegmen from "./modals/form-segmen.vue";

export default {
  name: "Segmen",
  components: { FormSegmen },

  data() {
    return {
        auth: {},

        form: {
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
          keyword: ''
        }

    };
  },

  mixins: [helper],

  methods: {

      _get(params){
        this.loading = params == null ? true : !params.silent

        this.axios.get('segmen?per_page='+this.paginate.perPage+'&page='+this.paginate.currentPage+'&keyword='+this.dataFilter.keyword).then(res => {
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
        this.form.config = {view: true, title: 'Tambah Segmen'}
        this.form.data = null
        this.form.action = (formData) => {

          this.axios.post('segmen?per_page='+this.paginate.perPage+'&page='+this.paginate.currentPage, formData).then(res => {
            
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
        this.form.config = {view: true, title: 'Edit Segmen'}
        this.form.data = data
        this.form.action = (formData) => {

          this.axios.put('segmen/'+data.id+'?per_page='+this.paginate.perPage+'&page='+this.paginate.currentPage, formData).then(res =>{
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
        this.confirm.title = 'Yakin ingin menghapus data segmen ini?'
        this.confirm.action = () => {
          this.axios.delete('segmen/'+id+'?per_page='+this.paginate.perPage+'&page='+this.paginate.currentPage).then(res => {
            this.toast('Berhasil dihapus');
            this._get({silent: true})
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
        // let k = keyword.toString().toLowerCase(); this.filter = []
        // for (let i = 0; i < this.data.length; i++) {
        //   if(this.data[i].nama_segmen.toLowerCase().includes(k)){
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