<template>
  <div class="antialiased">

    <Sidebar/>


    <div class="page">

      <Header @change="_search" hint="Ketik nama karyawan" @refresh="paginate.currentPage = 1, dataFilter.keyword = '', _get()" :enabledRefresh="true"/>

      <div class="content">
        <div class="container">
          <!-- Page title -->
          <div class="page-header">
            <div class="row d-flex justify-content-between">
              <div class="col-auto">
                <h2 class="page-title">
                  Karyawan ({{paginate.totalRows}})
                  {{test}}
                  <form>
                    <input type="text" v-model="test">
                  </form>
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
              <div class="table-responsive" style="width: 100%">
                <table class="table table-vcenter table-hover card-table table-striped table-control">
                  <thead>
                    <tr class="text-muted">
                      <th>No</th>
                      <th>Nama</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Comp</th>
                      <th style="width: 15%">Depo</th>
                      <th style="width: 10%">Gudang</th>
                      <!-- <th>Status</th> -->
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, i) in data" :key="i" >
                      <td>{{paginate.fromPage + i}}</td>
                      <td>{{row.name}}</td>
                      <td>{{row.email}}</td>
                      <td>
                        <span v-for="(role, l) in row.roles" :key="l" v-html="role.name" class="badge bg-blue-lt mr-2"></span>
                      </td>
                      <td>
                        <span v-for="(comp, l) in row.perusahaan" :key="l" v-html="comp.kode_perusahaan" class="badge bg-blue-lt mr-2"></span>
                      </td>
                      <td>
                        <span v-for="(depo, l) in row.depo" :key="l" v-html="depo.nama_depo" class="badge bg-blue-lt mr-2"></span>
                      </td>
                      <td>
                        <span v-for="(gudang, l) in row.gudang" :key="l" v-html="gudang.nama_gudang" class="badge bg-blue-lt mr-2"></span>
                      </td>
                      <!-- <td> <span class="badge w-100" :class="row.status === 'active' ? 'bg-success' : 'bg-warning'" v-html="row.status.replace('_', ' ')"/> </td> -->
                      <td>
                        {{row.status}}
                        <!--Switch Button For Active and Non Active Users-->
                        <!--Soal Cari gimana caranya supaya jika true valuenya active jika false valuenya non
                            active karena cara kerja di switch button menggunakan true dan false-->
                          <!--Cara 1 : Pakai Ternary-->
                         <!-- <input class="switch-button-checkbox" type="checkbox" :class="row.status === 'active' ? 'true' : 'false'" v-html="row.status.replace('_', '')">  -->
                          
                          <!--Cara 2 : Pakai v-if dan v-else-if -->
                          <!-- <div v-if="row.status == 'active'">
                              true
                          </div>

                          <div v-else-if="row.status == 'non_active'">
                              false
                          </div>

                          <div v-else>
                            Nothing
                          </div> -->
                        <div class="switch-button"> 
                          <input class="switch-button-checkbox" type="checkbox" v-model="status"> 
                          <label class="switch-button-label">
                            <span class="switch-button-label-span"></span>
                          </label>
                        </div>
                      </td>
                      <!-- <td class="pos-relative">
                        <div class="btn-group option center">
                          <button class="btn btn-white btn-pill" @click="_edit(row)" v-html="ic('edit')"/>
                          <button class="btn btn-white btn-pill" @click="_password(row.id)" v-html="ic('lock')"/>
                          <button class="btn btn-white btn-pill text-danger" @click="_delete(row.id)" v-html="ic('trash')"/>
                        </div>
                      </td> -->
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
              :per-page="paginate.perPage" @change="_pageChange" />
        </div>
      </div>

    </div>

    <FormUser
      :config.sync="form.config"
      :initData="form.data" :dismiss.sync="form.dismiss"
      :isSubmit.sync="form.isSubmit"
      @submit="form.action"
    />

    <FormPassword
      :config.sync="password.config"
      :initData="password.data" :dismiss.sync="password.dismiss"
      :isSubmit.sync="password.isSubmit"
      @submit="password.action"
    />

    <Confirm :id.sync="confirm.id" :title.sync="confirm.title" :isSubmit.sync="confirm.isSubmit" @submit="confirm.action" :btnConfirm.sync="confirm.btnConfirm" :textConfirm.sync="confirm.textConfirm"/>

  </div>
</template>

<script>
import helper from "@/assets/js/helper.js";
import FormUser from "./modals/form-users.vue";
import FormPassword from "./modals/form-password.vue";

export default {
  name: "Users",
  components: { FormUser, FormPassword },

  data() {
    return {
      auth: {},

      test: 'testing',

      status: 'active',

      form: {
        config: { view: false, title: null },
        data: null, isSubmit: false,
        action: () => {}
      },

      password: {
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
        this.axios.get('user', {
          params: {
            page: this.paginate.currentPage,
            keyword: this.dataFilter.keyword,
            per_page: this.paginate.perPage
          }
        }).then(res => {
          this.loading = false;
          this.data = this.dataOri = res.data.data;

          this.paginate.totalRows = res.data.meta.total;
          this.paginate.fromPage = res.data.meta.from;
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

      _add(data){
        this.form.config = {view: true, title: 'Tambah User'}
        this.form.data = null
        this.form.action = (formData) => {
          formData.name = this.ucwords(formData.name)

          this.axios.post("user", formData).then(() => {
            this._get()
            this.toast('Berhasil ditambahkan');
            this.form.config.view = false;
          }).catch( err => {
            this.onError(err);
            this.form.isSubmit = false;
          });
        }
      },

      _edit(data){
        this.form.config = {view: true, title: 'Edit User'}
        this.form.data = data
        this.form.action = (formData) => {
          formData.name = this.ucwords(formData.name)

          this.axios.put("user/"+data.id, formData).then(() => { this._get()
            // this.findObject(this.data, 'id', data.id, (d, i) => {
            //   let _data = formData

            //   for (const key in _data) {
            //     this.data[i][key] = _data[key]
            //   }
            // });

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
        this.confirm.title = 'Yakin ingin menghapus data user ini?'
        this.confirm.action = () => {

          this.axios.delete('user/'+id).then( () => {
            this.toast('Berhasil dihapus');
            this._get()

            this.confirm.id = null
          }).catch( err => {
            this.onError(err);
            this.confirm.isSubmit = false
          });
        }
      },

      _password(id){
        this.password.config = {view: true, title: 'Edit Password'}
        this.password.action = (formData) => {

          this.axios.put('user/change_password/'+id, formData).then(() => {
            this.toast('Berhasil diperbarui');
            this.password.config.view = false;
          }).catch( err => {
            this.onError(err);
            this.password.isSubmit = false;
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

        // let k = keyword.toString().toLowerCase(); this.data = []

        // for (let i = 0; i < this.dataOri.length; i++) {
        //   if(this.dataOri[i].name.toString().toLowerCase().includes(k)){
        //     this.data.push(this.dataOri[i])
        //   }
        // }
      },

  },

  mounted(){
    this.auth = JSON.parse(localStorage.user)
    this._get()
  },

};
</script>

<style lang="scss" scoped>
.switch-button 
{
  background: #d2e1f3;
  overflow: hidden;
  width: 240px;
  text-align: center;
  font-size: 0.625rem;
  font-weight:500;
  text-transform:uppercase;
  letter-spacing: 1px;
  color: white;
  position: relative;
  padding-right: 120px;

  &-checkbox 
  {
    cursor: pointer;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    z-index: 2;

    &:checked + .switch-button-label:before 
    {
      transform: translateX(120px);
      transition: transform 300ms linear;
      background-color:#5eba00;
      content: "Active";
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      width: 120px;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 3;
      pointer-events: none;
    }

    & + .switch-button-label 
    {
      position: relative;
      padding: 15px 0;
      display: block;
      user-select: none;
      pointer-events: none;

      &:before 
      {
        content: "Non Active";
        background:#fab005;
        height: 100%;
        width: 100%;
        position: absolute;
        left: 0;
        top: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 3;
        pointer-events: none;
        transform: translateX(0);
        transition: transform 300ms;
      }

      .switch-button-label-span 
      {
        position: relative;
      }
    }
  }
}

</style>
