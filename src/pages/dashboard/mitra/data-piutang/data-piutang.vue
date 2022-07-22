<template>
  <div class="antialiased">

    <Sidebar/>

    <div class="page">

      <Header @change="_search" hint="Cari pelunasan"/>

      <div class="content">
        <div class="container">
          <!-- Page title -->
          <div class="page-header">
            <div class="row d-flex justify-content-between">
              <div class="col-auto">
                <h2 class="page-title">
                  Data Piutang
                </h2>
              </div>

              <div class="col-auto">
                <div class="row">
                  <div class="col-auto px-0">
                    <div class="input-icon">
                      <span class="input-icon-addon"> <i class="fe fe-align-left"></i> </span>
                      <select class="form-control" v-model="paginate.perPage" @change="_get" :disabled="loading">
                        <option :value="num" v-for="(num, i) in [10,50,100,999]" :key="i" v-html="num === 999 ? 'Semua' : num"/>
                      </select>
                    </div>
                  </div>

                  <div class="col-auto">
                    <button class="btn btn-white mr-3" v-html="ic('filter')" @click="_filter"> </button>
                    <div class="btn-group">
                      <button class="btn btn-outline-primary" @click="_createExcel(0)" :disabled="isExcelRequest" v-html="isExcelRequest ? spin() : ic('download')+' Export Excel'"> </button>
                      <button class="btn btn-outline-primary" @click="_createExcel(1)" :disabled="isExcelRequestLite" v-html="isExcelRequestLite ? spin() : ic('download')+' Export Excel Lite'"> </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Skeleton type="table" :length="10" class="mt-3 bg-white" v-if="loading"/>

          <Nodata v-if="!loading && data.length === 0"/>

          <div class="box" v-if="!loading && data.length > 0">
              <div class="card">
                <div class="table-respon sive">
                  <table class="table table-vcenter table-hover card-table table-striped">

                    <thead>
                      <tr class="text-muted">
                        <th>No Invoice</th>
                        <th>Toko</th>
                        <th>Jatuh Tempo</th>
                        <th>Salesman</th>
                        <th>Jumlah Pembayaran</th>
                        <th>Status</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(row, i) in data" :key="i" :class="row.over_due > 0 ? 'text-danger' : 'text-dark'">
                        <td>
                          <span class="click-able" @click="_detail(row)" :class="row.over_due > 0 ? 'text-danger' : 'text-dark'">
                            {{row.id}}
                            <br>
                            {{row.no_invoice == null ? '' : row.no_invoice}}
                          </span>
                        </td>
                        <td>
                          <span :class="row.over_due > 0 ? 'text-danger' : 'text-dark'">
                            [{{row.no_acc}}]
                            <br>
                            {{row.nama_toko}}
                          </span>
                        </td>
                        <td>
                          {{dateFormat(row.due_date)}}
                          <br>
                          ({{row.over_due}} {{row.over_due !== 'LUNAS' ? ' hari' : ''}})
                        </td>
                        <td>
                          {{row.nama_salesman}}
                          <br>
                          ({{row.tim}})
                        </td>
                        <td>{{'Rp '+ribuan(row.jumlah_pembayaran)}}</td>
                        <td v-html="row.paid_at == null ? 'Belum Lunas' : '<small>Dilunasi Pada : </small><br/>'+dateFormat(row.paid_at)"></td>
                        <td class="p-0">
                          <b-dropdown variant="link" size="lg" dropleft no-caret>
                            <template slot="button-content"> <i class="fe fe-more-vertical"></i> </template>
                            <b-dropdown-item @click.native="_detail(row)">Rincian</b-dropdown-item>
                          </b-dropdown>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
          </div>

          <b-pagination
              v-if="data.length > 0 && !loading"
              align="center"
              class="mt-5"
              :total-rows="paginate.totalRows"
              v-model="paginate.currentPage"
              :per-page="paginate.perPage"
              @change="_pageChange" />
        </div>
      </div>
    </div>

    <FormFilter
      :config.sync="filter.config"
      :initData="filter.data" :dismiss.sync="filter.dismiss"
      :isSubmit.sync="filter.isSubmit"
      @submit="filter.action"
    />

    <FormPelunasan
      :config.sync="form.config"
      :initData="form.data" :dismiss.sync="form.dismiss"
      :isSubmit.sync="form.isSubmit"
      @submit="form.action"
    />

    <Confirm :id.sync="confirm.id" :title.sync="confirm.title" :isSubmit.sync="confirm.isSubmit" @submit="confirm.action" :btnConfirm.sync="confirm.btnConfirm" :textConfirm.sync="confirm.textConfirm"/>

    <DetailPelunasan
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
import FormPelunasan from "./modals/form-pelunasan.vue";
import DetailPelunasan from "./modals/detail-pelunasan.vue";
import XLSX from "xlsx";

export default {
  name: "Pelunasan",
  components: { FormFilter, FormPelunasan, DetailPelunasan },

  data() {
    return {
      auth: {},

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

      confirm: {
        id: null, title: null, isSubmit: false, action: () => {}, btnConfirm: 'btn-danger', textConfirm: 'Hapus Sekarang'
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
        perusahaan: '',
        id_salesman: 'all',
        due_date: this.dateTime('ymd'),
        keyword: '',
        status: 'belum_lunas',
        depo: [],
        page:'',
        per_page:'',
        tipe_pembayaran: 'credit',
        id_mitra: '1'
      },

      fireTrigger: null, isExcelRequest: false, isExcelRequestLite: false

    };
  },

  mixins: [helper],

  methods: {

      _get(){
        this.loading = true
        this.dataFilter.id_salesman = this.dataFilter.id_salesman === '' ? 'all' : this.dataFilter.id_salesman;
        this.dataFilter.page = this.paginate.currentPage;
        this.dataFilter.per_page = this.paginate.perPage;

        this.axios.get("pelunasan_penjualan",{params: this.dataFilter}).then(res => {
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

      _detail(data){
        this.detail.config = {view: true, title: 'Detail Pelunasan'}
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

      _createExcel(lite=0){
        if (lite == 0) {
          this.isExcelRequest = true;
        } else {
          this.isExcelRequestLite = true
        }
        this.dataFilter.lite = lite

        this.axios.get("pelunasan_penjualan/get/report_pelunasan_excel",{params: this.dataFilter}).then(res => {
          if (lite === 1) {
            this.isExcelRequestLite = false
            let dataExcel = [];
            let rspn = res.data.data
            rspn.forEach( (data, i) => {
              dataExcel.push({
                "No": i+1,
                "Cust No": data.cust_no,
                "Nama Toko": data.nama_toko,
                "Alamat": data.alamat,
                "Tgl Order": data.tanggal_po,
                "Tgl Deliver": data.delivered_at,
                "Due Date": data.due_date,
                "No Invoice": data.no_invoice,
                "No PO": data.no_po,
                "Total": { v: data.grand_total, t: "n", w: "#.##0"},
                "Jumlah Lunas": { v:data.pembayaran, t: "n"},
                "Waiting Approve": { v:data.waiting, t: "n"},
                "Sisa": { v: data.piutang, t: "n"},
                "Over Due": data.over_due,
                "Tim": data.tim,
                "Tipe Pembayaran": data.tipe_pembayaran
              })
            })

            this.formatExcel({data: dataExcel, filename: 'laporan-piutang-'+this.dataFilter.due_date}, false)
          } else {
            window.open(res.data)
            this.isExcelRequest = false;
            this.isExport = false;
          }

        }).catch( err => {
          this.loading = false
          this.onError(err)
        });
      },
    formatExcel(params, raw = true) {
      const header = Object.keys(params.data[0]); // columns name

      var wscols = [];
      for (var i = 0; i < header.length; i++) {  // columns length added
        wscols.push({ wch: header[i].length + 5 })
      }

      var data = XLSX.utils.json_to_sheet(params.data, { raw: raw, cellDates: true, skipHeader: false})
      data["!cols"] = wscols;
      var wb = XLSX.utils.book_new() // make Workbook of Excel

      //format
      const currency = '#,##'
      for (let col of [9, 10, 11, 12]) {
        this.formatColumn(data, col, currency)
      }

      XLSX.utils.book_append_sheet(wb, data, 'Data Piutang') // sheet is name of Worksheet
      XLSX.writeFile(wb, params.filename+'.xlsx')
    },
    formatColumn(worksheet, col, fmt) {
      const range = XLSX.utils.decode_range(worksheet['!ref'])
      // note: range.s.r + 1 skips the header row
      for (let row = range.s.r + 1; row <= range.e.r; ++row) {
        const ref = XLSX.utils.encode_cell({ r: row, c: col })
        if (worksheet[ref] && worksheet[ref].t === 'n') {
          worksheet[ref].z = fmt
        }
      }
    }
  },

  mounted(){
    this.auth = JSON.parse(localStorage.user)
    this._get()
  },

  watch: {
    fireTrigger(){
      this._get()
    }
  }

};
</script>
