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
                  Report Realisasi DO
                </h2>
              </div>

              <div class="col-auto">
                <div class="row">
                  <div class="col-auto px-0">
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
                        <th colspan="1" rowspan="2" style="vertical-align : middle;text-align:center; width: 10%" >DSKU</th>
                        <th colspan="1" rowspan="2" style="vertical-align : middle;text-align:center; width: 20%" >Kode Barang</th>
                        <th colspan="2" style="text-align:center;">Qty</th>
                        <th colspan="3" style="text-align:center;">Remark</th>
                      </tr>
                      <tr class="text-muted nowrap">
                        <th class="text-center">Dus</th>
                        <th class="text-center">PCS</th>
                        <th colspan="3"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <template  v-for="(row) in data" >
                        <tr class="detail">
                          <td colspan="7"><strong>Group : </strong> {{row.nama_brand}}</td>
                        </tr>

                        <template v-for="val in row.barang">
                          <tr class="detail" >
                            <td>{{val.item_code}}</td>
                            <td>{{val.kode_barang}}</td>
                            <td class="text-center">{{val.qty}}</td>
                            <td class="text-center">{{val.qty_pcs}}</td>
                            <td colspan="3"></td>
                          </tr>
                        </template>

                        <tr class="detail" >
                          <td colspan="2" style="text-align:right;"><strong>Subtotal : </strong></td>
                          <td class="text-center"><strong>{{row.subtotal_dus}}</strong></td>
                          <td class="text-center"><strong>{{row.subtotal_pcs}}</strong></td>
                          <td colspan="3"></td>
                        </tr>
                      </template>
                      <tr class="detail" style="padding: 12px !important;" >
                          <td colspan="2" style="text-align:right;"><strong>Grand Total : </strong></td>
                          <td class="text-center"><strong>{{dataOri.grand_total_dus}}</strong> </td>
                          <td class="text-center"><strong>{{dataOri.grand_total_pcs}}</strong></td>
                          <td colspan="3"></td>
                      </tr>

                    </tbody>
                  </table>
                  <table class="table table-hover card-table table-striped table-no-break">
                    <tr >
                      <td style="width: 10%"> <strong>No.Invoice : </strong></td>
                      <template  v-for="(inv) in dataOri.invoice">
                        {{inv}},
                      </template>
                    </tr>
                    <tr>
                      <td style="width: 10%"> <strong>Total Invoice : {{dataOri.num_invoice}}</strong></td>
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
  name: "RealisasiDO",
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
        driver_id: '',
        status: 'delivered',
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
          driver_id: this.dataFilter.driver_id,
          start_date: this.dataFilter.start_date,
          end_date: this.dataFilter.end_date,
          id_depo: this.dataFilter.depo,
          status: this.dataFilter.status,
        }
        if(this.dataFilter.driver_id != '')
        {
          this.axios.get("report/report_jadwal_pengiriman",{params: dataForm}).then(res => {
            this.loading = false;

            this.dataOri = res.data;
            this.data = res.data.detail

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
          console.log(formData)
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

          if (localStorage.getItem("reportRekapitulasiDO") === null) {
              localStorage.reportRekapitulasiDO = JSON.stringify(data)
          }else
          {
            localStorage.removeItem('reportRekapitulasiDO');
            localStorage.reportRekapitulasiDO = JSON.stringify(data)
          }

          localStorage.reportRekapitulasiDO = JSON.stringify(data)
          window.open(window.location.origin+'/dashboard/inventory/realisasi-do/print', '_blank')
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
