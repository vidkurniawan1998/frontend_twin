<template>
  <div class="antialiased">

    <Sidebar/>


    <div class="page">
      
      <Header @keyup="_search" hint="Ketik nama sales"/>

      <div class="content">
        <div class="container">
          <!-- Page title -->
          <div class="page-header">
            <div class="row d-flex justify-content-between">
              <div class="col-auto">
                <h2 class="page-title">
                  Rekapitulasi Delivery Order
                </h2>
              </div>

              <!-- <div class="col-auto">
                <div class="text-muted text-h5 mt-2">Login Pada {{auth.logged_at}}</div>
              </div> -->

              <div class="col-auto">
                <div class="row">
                  <div class="col-auto px-0">

                    <!-- <div class="input-icon">
                      <span class="input-icon-addon"> <i class="fe fe-align-left"></i> </span>
                      <select class="form-control" v-model="paginate.perPage" @change="_get" :disabled="loading">
                        <option :value="num" v-for="(num, i) in [10,50,100,999]" :key="i" v-html="num == 999 ? 'Semua' : num"/>
                      </select>
                    </div> -->

                  </div>

                  <div class="col-auto">
                    <button class="btn btn-white" v-html="ic('filter')+' Filter'" @click="_filter"> </button>
                    <button class="btn btn-primary ml-3" v-html="ic('download')+' Export PDF'" @click="_exportPDF"> </button>
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
                  <table class="table table-vcenter table-hover card-table table-striped table-no-break">

                    <thead>
                      <tr class="text-muted nowrap" >
                        <th colspan="3" rowspan="2" style="vertical-align : middle;text-align:center;" >Code</th>
                        <th rowspan="2" style="vertical-align : middle;text-align:center;">Level harga</th>
                        <th colspan="2" style="text-align:center;">Qty</th>
                        <th colspan="3" style="text-align:center;">Pengembalian</th>
                      </tr>
                      <tr class="text-muted nowrap">
                        <th>Dus</th>
                        <th>PCS</th>
                        <th>1</th>
                        <th>2</th>
                        <th>3</th>
                      </tr>
                    </thead>
                    <tbody>
                      <template v-for="(row) in data" >
                        <tr class="detail">
                          <td colspan="9"><strong>Group : </strong> {{row.nama_brand}}</td>
                        </tr>
                        
                        <template v-for="val in row.barang">
                          <tr class="detail" >
                            <td>{{val.item_code}}</td>
                            <td>{{val.kode_barang}}</td>
                            <td>{{val.nama_barang}}</td>
                            <td>{{val.tipe_harga}}</td>
                            <td>{{val.qty}}</td>
                            <td>{{val.qty_pcs}}</td>
                            <td></td>
                            <td></td>
                            <td></td>
                          </tr>
                        </template>

                        <tr class="detail" >
                          <td colspan="4" style="text-align:right;"><strong>Subtotal : </strong></td>
                          <td>{{row.subtotal_dus}}</td>
                          <td>{{row.subtotal_pcs}}</td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                      </template>
                      
                    </tbody>
                  </table>
                  <table class="table table-hover card-table table-striped table-no-break">
                    <tr >
                      <td> <strong>No.DO : </strong></td>
                      <template  v-for="(inv) in dataOri.invoice">
                        {{inv}},
                      </template>
    
                      
                    </tr>
                  </table>
                </div>
              </div>
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

  </div>
</template>

<script>
import helper from "@/assets/js/helper.js";
import FormFilter from "./modals/filter.vue";

export default {
  name: "RekapitulasiDO",
  components: { FormFilter },

  data() {
    return {
      auth: {},

      filter: {
        config: { view: false, title: null },
        data: null, isSubmit: false,
        action: () => {}
      },

      loading: true,
      data: [], dataOri:[],
  
      paginate: {
        currentPage: 1,
        totalRows: 0,
        perPage: 10,
        fromPage: 0
      },

      dataFilter: {
        id_salesman: '',
        status: 'all',
        start_date: this.dateTime('ymd'),
        end_date: this.dateTime('ymd'),
        depo: '',
        keyword:'',
      },

    };
  },

  mixins: [helper],

  methods: {

      _get(){
        this.loading = true

        let dataForm = {
          id_salesman: this.dataFilter.id_salesman,
          start_date: this.dataFilter.start_date,
          end_date: this.dataFilter.end_date,
          id_depo: this.dataFilter.depo,
          status: this.dataFilter.status,
        }
        if(this.dataFilter.id_salesman != '')
        {
          this.axios.get("report/rekapitulasi_do",{params: dataForm}).then(res => {
            this.loading = false;

            this.dataOri = res.data;
            this.data = res.data.detail
            // console.log(res.data.detail)
            // let data = res.data[0];
          //   this.data = data

          }).catch( err => {
            this.loading = false
            this.onError(err)
          });
        }
        else{
          this.loading = false;
        }
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

      _pageChange(page){
        this.paginate.currentPage = page;
        this._get();
      },

      _search(keyword){
        this.dataFilter.keyword = keyword
        this._get()
      },

      _exportPDF(){
      if(this.isPrint){
        this.toast('Mohon menunggu...')
      }else{
        this.isPrint = true;

        let data = this.dataOri;

        if (localStorage.getItem("rekapitulasiDO") === null) {
            localStorage.rekapitulasiDO = JSON.stringify(data)
        }else
        {
          localStorage.removeItem('rekapitulasiDO');
          localStorage.rekapitulasiDO = JSON.stringify(data)
        }

        localStorage.rekapitulasiDO = JSON.stringify(data)
        window.open(window.location.origin+'/dashboard/sales/print-rekapitulasiDO', '_blank')
        this.isPrint = false;
      }
    },  
  },

  mounted(){
    this.auth = JSON.parse(localStorage.user)
    this._get()
  },

};
</script>
