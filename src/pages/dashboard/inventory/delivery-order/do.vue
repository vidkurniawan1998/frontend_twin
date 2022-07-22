<template>
  <div class="antialiased">

    <Sidebar/>


    <div class="page">
      
      <Header @keyup="_search" hint="Ketik no. invoice"/>

      <div class="content">
        <div class="container">
          <!-- Page title -->
          <div class="page-header">
            <div class="row d-flex justify-content-between">
              <div class="col-auto">
                <h2 class="page-title">
                  Delivery Order
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
                    <button class="btn btn-white" v-html="ic('filter') +' Filter'"> Filter </button>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-lg-6">
              <div class="card">
                <div class="card-header px-4">
                  <h4 class="card-title">Daftar Invoice</h4>
                </div>
                <div class="card-body p-0">

                  <Skeleton type="list-1" :length="10" class="bg-white" v-if="loading"/>

                  <ul class="list-group borderless" v-if="!loading && invoiceApproved.length > 0">
                    <li class="list-group-item px-4" v-for="(row, i) in invoiceApproved" :key="i" @click="_detail(row)">
                      <i class="la la-lg la-file-alt"></i>
                      <b v-html="row.no_invoice"></b>
                      <div>
                        <span v-html="row.toko[0].nama_toko"></span>
                      </div>
                    </li>
                  </ul>

                </div>
              </div>

              <b-pagination v-if="invoiceApproved.length > 0 && !loading" align="center" class="mt-2" :total-rows="paginate.totalRows" v-model="paginate.currentPage" :per-page="paginate.perPage" @change="_pageChange" />

            </div>

            <div class="col-lg-6">
              <div class="card">
                <div class="card-header">
                  <h4 class="card-title">Loading</h4>
                </div>
                <div class="card-body">
                  
                </div>
              </div>
            </div>
          </div>

          <!-- <Skeleton type="table" :length="10" class="mt-3 bg-white" v-if="loading"/>

          <Nodata v-if="!loading && data.length == 0"/>

          <div class="box" v-if="!loading && data.length > 0">
              <div class="card">
                <div class="table-respon sive">
                  <table class="table table-vcenter table-hover card-table table-striped">

                    <thead>
                      <tr class="text-muted">
                        <th>No</th>
                        <th>No Plat</th>
                        <th>No Body</th>
                        <th>Jenis</th>
                        <th>Merk</th>
                        <th>Peruntukan</th>
                        <th>Samsat</th>
                        <th>Tahun</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(row, i) in filter" :key="i" :id="'tr'+row.id">
                        <td>{{paginate.fromPage + i}}</td>
                        <td>{{row.no_pol_kendaraan}}</td>
                        <td>{{row.body_no}}</td>
                        <td>{{row.jenis}}</td>
                        <td>{{row.merk}}</td>
                        <td>{{row.peruntukan}}</td>
                        <td>{{row.samsat}}</td>
                        <td>{{row.tahun}}</td>
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

          <b-pagination v-if="data.length > 0 && !loading" align="center" class="mt-5" :total-rows="paginate.totalRows" v-model="paginate.currentPage" :per-page="paginate.perPage" @change="_pageChange" /> -->

        </div>
      </div>

    </div>

    <FormDo
      :config.sync="form.config"
      :initData="form.data" :dismiss.sync="form.dismiss"
      :isSubmit.sync="form.isSubmit"
      @submit="form.action"
    />

    <DetailInvoice
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
import FormDo from "./modals/form-do.vue";
import DetailInvoice from "./modals/detail-invoice.vue";

export default {
  name: "DeliveryOrder",
  components: { FormDo, DetailInvoice },

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

        filter: {
          status: 'approved',
          start_date: this.dateTime('ymd'),
          end_date: this.dateTime('ymd'),
          per_page: 10,
          page: 1
        },

        invoiceApproved: []

    };
  },

  mixins: [helper],

  methods: {
    _getInvoice(){
      this.loading = true

      this.axios.get('penjualan', {params: this.filter}).then(res => { console.log(res.data.data)
        this.invoiceApproved = res.data.data
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.onError(err)
      })
    },

    _detail(data){
      this.form.config = {view: true, title: data.no_invoice+' - '+data.toko[0].nama_toko}
      this.form.data = data
    },

      _pageChange(page){
        this.paginate.currentPage = page;
        this._get();
      },

      _search(keyword){
        let k = keyword.toString().toLowerCase(); this.filter = []
        for (let i = 0; i < this.data.length; i++) {
          if(this.data[i].no_pol_kendaraan.toLowerCase().includes(k)){
            this.filter.push(this.data[i])
          }
        }
      },
    
  },

  mounted(){
    this.auth = JSON.parse(localStorage.user)
    this._getInvoice()
  }

};
</script>

<style lang="scss" scoped>
  .borderless{
    li{
      border-left: none;
      border-right: none;

      i{
        position: absolute;
        right: 0px; opacity: 0;
        top: 50%; transition: .2s;
        transform: translate(-10px, -50%);
      }

      &:first-child{
        border-top: none;
      }

      &:last-child{
        border-bottom: none;
      }

      transition: .2s;
      position: relative;

      &:hover{
        background-color: #f5f5f5;
        cursor: pointer;

        i{
          right: 10px;
          opacity: 1;
        }
      }

    }
  }
</style>