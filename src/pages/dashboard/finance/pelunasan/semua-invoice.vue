<template>
  <div class="antialiased">

    <Sidebar/>


    <div class="page">

      <Header @change="_search" hint="Ketik no. acc"/>

      <div class="content">
        <div class="container">
          <!-- Page title -->
          <div class="page-header">
            <div class="row d-flex justify-content-between">
              <div class="col-auto">
                <h2 class="page-title">
                  Pembayaran
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

                    <div class="btn-group">
                      <button class="btn btn-outline-primary" @click="_createExcel" :disabled="isExcelRequest" v-html="isExcelRequest ? spin() : ic('download')+' Export Excel'"> </button>
                      <button class="btn btn-outline-primary" @click="_createPdf" :disabled="isPdfRequest" v-html="isPdfRequest ? spin() : ic('download')+' Export PDF'"> </button>
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
                <div class="table-respon sive">
                  <table class="table table-hover table-control card-table table-striped">

                    <thead>
                      <tr class="text-muted">
                        <th>No.</th>
                        <th>Toko</th>
                        <th>Tanggal Pelunasan</th>
                        <th>Salesman</th>
                        <th>Pembayaran</th>
                        <th>Diinput Pada</th>
                        <th>Status</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(row, i) in data" :key="i">
                        <td>{{row.no_invoice}} <br> {{row.id_penjualan}}</td>
                        <td>{{row.nama_toko}} <br> {{row.no_acc}} <br> {{row.cust_no}} </td>
                        <td>{{ dFormat(row.tanggal, 'dMY')}}</td>
                        <td>{{row.nama_salesman}} <br> {{row.nama_tim}}</td>

                        <td>
                          <div v-if="row.tipe == 'tunai'">
                            Tunai <span class="pull-right">{{'Rp '+ribuan(row.nominal)}}</span>
                          </div>
                          <div v-if="row.tipe == 'transfer'">
                            Transfer <span class="pull-right">{{'Rp '+ribuan(row.nominal)}}</span> <br>
                            {{row.bank}}
                            <span class="pull-right">{{row.no_rekening}}</span>
                          </div>
                          <div v-if="row.tipe == 'bilyet_giro'">
                            Bilyet Giro <span class="pull-right">{{'Rp '+ribuan(row.nominal)}}</span> <br>
                            {{row.bank}} <span class="pull-right">{{row.no_bg}}</span> <br>
                            <span class="pull-right">{{row.jatuh_tempo_bg}}</span>
                          </div>
                          <div v-if="row.tipe == 'saldo_retur'">
                            Saldo Retur <span class="pull-right">{{'Rp '+ribuan(row.nominal)}}</span>
                          </div>

                          <div v-if="row.tipe == 'lainnya'">
                            Lainnya <span class="pull-right">{{'Rp '+ribuan(row.nominal)}}</span> <br>
                            <span class="pull-right">{{row.keterangan}}</span>
                          </div>
                        </td>

                        <td v-html="dateFormat(row.created_at).split(' ').join('<br>')"></td>
                        <td> <span class="badge w-100" :class="row.status == 'waiting' ? 'bg-warning' : row.status == 'rejected' ? 'bg-danger' : 'bg-success'" v-html="row.status"></span> </td>
                        <td class="text-right p-0 pos-relative">
                          <div class="btn-group">
                            <button
                                title="Lihat Detail"
                                class="btn btn-white btn-pill"
                                v-html="ic('eye')" @click="_detail(row)"></button>
                            <button
                                title="Batal Kofirmasi"
                                class="btn btn-white btn-pill"
                                :disabled="isConfirm"
                                v-html="indexConfirm == i && isConfirm ? spin() : ic('undo')"
                                v-if="row.status == 'approved' || row.status == 'rejected'"
                                @click="_cancelConfirm(row, i)"></button>

                            <button
                                title="Edit"
                                class="btn btn-white btn-pill"
                                :disabled="isConfirm"
                                v-if="row.status == 'waiting'"
                                @click="_edit(row)"
                                v-html="ic('edit')"> </button>
                            <button
                                title="Hapus"
                                class="btn btn-white btn-pill"
                                :disabled="isConfirm"
                                v-if="row.status == 'waiting'"
                                @click="_delete(row.id)" v-html="ic('trash')"> </button>

                            <button
                                title="Setujui"
                                class="btn btn-white btn-pill text-success"
                                :disabled="isConfirm"
                                v-if="row.status == 'waiting'"
                                @click="_confirm(row, 1, i)"
                                v-html="indexConfirm == 1+i && isConfirm ? spin() : ic('check')"> </button>
                            <button
                                title="Batal Setujui"
                                class="btn btn-white btn-pill text-danger"
                                :disabled="isConfirm"
                                v-if="row.status == 'waiting'"
                                @click="_confirm(row, 0, i)"
                                v-html="indexConfirm == 0+i && isConfirm ? spin() : ic('close')"> </button>
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
      :config.sync="filter.config"
      :initData="filter.data" :dismiss.sync="filter.dismiss"
      :isSubmit.sync="filter.isSubmit"
      @submit="filter.action"
    />

    <PrintInvoice
      :config.sync="invoice.config"
      :initData="invoice.data" :dismiss.sync="invoice.dismiss"
      :isSubmit.sync="invoice.isSubmit"
      @submit="invoice.action"
    />

    <FormPelunasan
      :config.sync="form.config"
      :initData="form.data"
      :isSubmit.sync="form.isSubmit"
      @submit="form.action"
    />

    <Confirm
        :id.sync="confirm.id"
        :title.sync="confirm.title"
        :isSubmit.sync="confirm.isSubmit"
        @submit="confirm.action"
        :btnConfirm.sync="confirm.btnConfirm"
        :textConfirm.sync="confirm.textConfirm"/>

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
import PrintInvoice from "./modals/print-invoice.vue";
import FormFilter from "./modals/filter-invoice.vue";
import FormPelunasan from "./modals/form-semua-invoice.vue";
import DetailPelunasan from "./modals/detail-semua-invoice.vue";

import jsPDF from "jspdf";
import "jspdf-autotable";

export default {
  name: "SemuaInvoice",
  components: { PrintInvoice, FormFilter, FormPelunasan, DetailPelunasan},

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
        id_salesman: 'all',
        tipe: 'tunai',
        status: 'semua',
        keyword: '',
        start_date: this.dateTime('ymd'),
        end_date: this.dateTime('ymd'),
        date_bg: '',
        depo: [],
        per_page:'',
        page:'',
        id_mitra: 'exclude'
      },

      isConfirm: false, indexConfirm: 0, isPdfRequest: false, isExcelRequest: false
    };
  },

  mixins: [helper],

  methods: {
    _get(){
      this.loading = true

      this.dataFilter.page = this.paginate.currentPage;
      this.dataFilter.per_page = this.paginate.perPage;

      this.axios.get("detail_pelunasan_penjualan",{params: this.dataFilter}).then(res => {
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

    _printInvoice(){
      this.invoice.config = {view: true, title: 'Cetak Invoice Penjualan'}
    },

    _edit(data){
      this.form.config = {view: true, title: 'Edit Pelunasan'}
      this.form.data = data
      this.form.action = (formData) => {
        this.axios.put('detail_pelunasan_penjualan/'+data.id, formData).then(res => {
          this.toast('Berhasil diperbarui');

          this.findObject(this.data, 'id', data.id, (d, i) => {
            for (const key in formData) {
              this.data[i][key] = res.data.data[key]
            }
          })

          this.form.config.view = false;
        }).catch( err => {
          this.onError(err);
          this.form.isSubmit = false;
        });
      }
    },

    _delete(id){
      this.confirm.id = id
      this.confirm.title = 'Yakin ingin menghapus data invoice ini?'
      this.confirm.action = () => {
        this.axios.delete('detail_pelunasan_penjualan/'+id).then(() => {
          this.toast('Berhasil dihapus');

          this.findObject(this.data, 'id', id, (d, i) => {
            this.data.splice(i, 1)
          })

          this.confirm.id = null
        }).catch( err => {
          this.onError(err);
          this.confirm.isSubmit = false
        });

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

    _confirm(data, action, i){
      this.indexConfirm = action+i // spiner

      this.isConfirm = true
      let url = action == 1 ? 'detail_pelunasan_penjualan/approve/'+data.id : 'detail_pelunasan_penjualan/reject/'+data.id;
      this.axios.post(url).then(() => {
        this.findObject(this.data, 'id', data.id, (d, i) => {
          this.data[i].status = action == 1 ? 'approved' : 'rejected'
        })

        this.isConfirm = false
      }).catch( err => {
        this.onError(err);
        this.isConfirm = false
      });
    },

    _cancelConfirm(data, i){
      this.indexConfirm = i

      this.isConfirm = true
      this.axios.post('detail_pelunasan_penjualan/cancel_approval/'+data.id).then(() => {
        this.findObject(this.data, 'id', data.id, (d, i) => {
          this.data[i].status = 'waiting'
        })

        this.isConfirm = false
      }).catch( err => {
        this.onError(err);
        this.isConfirm = false
      });
    },


    _createPdf(){
      if(this.dataFilter.tipe == 'semua' || this.dataFilter.tipe == '')
      {
        let doc = new jsPDF('l'), user = JSON.parse(localStorage.user);
        let styles = { fillColor: [255, 255, 255], cellPadding: 0, lineColor: 0 }

        // title
        // doc.autoTable(this.pdfHeader(''))
        doc.autoTable({
          theme: 'plain',
          styles: { fillColor: [255, 255, 255], cellPadding: 0, lineColor: 0 },
          margin: { top: 10, left: 10, right: 10 },
          columnStyles: { 1: { halign: 'center', fontSize: 18 } },

          head: [['PT. Kembar Putra Makmur']],
          body: [
            ['Jl. Kargo Permai No. 77 Ubung Kaja, Denpasar Bali', { rowSpan: 2, styles: { halign: 'right' } }],
            ['Phone (0361) 430858-430854, Fax (0361) 430855-430857', ],
            ['Indonesia'],
          ],
        })
        doc.setDrawColor(0, 0, 0);
        doc.line(10, 31, 410, 31);
        doc.setLineWidth(0.5);
        doc.line(10, 30, 410, 30);

        this.isPdfRequest = true;

        let filter_pdf = {
          id_salesman: this.dataFilter.id_salesman,
          date_bg: this.dataFilter.date_bg,
          per_page:'all',
          tipe: this.dataFilter.tipe,
          status : this.dataFilter.status,
          start_date:this.dataFilter.start_date,
          end_date:this.dataFilter.end_date,
          keyword:this.dataFilter.keyword,
          depo : this.dataFilter.depo,
          id_mitra : this.dataFilter.id_mitra,
        }

        this.axios.get('/detail_pelunasan_penjualan', {
          params: filter_pdf
        }).then(res => {
          let pdf = [], nominal = 0
          let keys = ['no_invoice','no_acc','cust_no','nama_toko','nama_tim','tipe','nominal','bank','no_rekening','no_bg','jatuh_tempo_bg','status']

          let data = res.data.data, labels = []

          for (let i = 0; i < keys.length; i++) {
            labels.push(
              { content: this.ucwords(keys[i].split('_').join(' ')), styles: { fontStyle: 'bold'} }
            )
          }

          pdf.push(labels)

          data.forEach(o => {
            let temp = []

            keys.forEach(k => {
              if(k == 'nominal'){
                temp.push( { content: this.ribuan(o[k]), styles: { cellWidth: 25, halign: 'right', textColor: [0, 0, 0] } } )
              } else if (k == 'nama_toko') {
                temp.push({ content: o[k].toUpperCase(), styles: { textColor: [0, 0, 0] }})
              } else if (k == 'tipe' && o[k] == 'lainnya'){
                temp.push({ content: o[k]+' ('+o['keterangan']+')' || '', styles: { textColor: [0, 0, 0] }})
              } else {
                temp.push({ content: o[k] || '', styles: { textColor: [0, 0, 0] }})
              }
            })

            pdf.push(temp)
            temp = []

            nominal += +o.nominal
          })

          this.isPdfRequest = false

          styles['cellPadding'] = 2;

          let total = 0

          for (let i = 0; i < data.length; i++) {
            let item = data[i]

            total += +item.nominal
          }

          function _noBorder(text){
            return { content: text, styles: { halign: 'right', textColor: [0, 0, 0]}}
          }

          pdf.push(
            [
              _noBorder(''),  _noBorder(''),  _noBorder(''),  _noBorder(''), _noBorder(''), _noBorder(''),
              _noBorder(this.ribuan(total)),  _noBorder(''), _noBorder(''),  _noBorder(''), _noBorder(''), _noBorder('')
            ]
          )

          doc.autoTable({ // body
            theme: 'grid', styles: styles, margin: { top: 10, left: 10, right: 10 },
            body: pdf,
          })

          this.pdfDownload([ doc.output() ])
        }).catch(err => {
          this.onError(err)
          this.isPdfRequest = false
        })
      }
      else
      {
        let filter_pdf = {
          id_salesman: this.dataFilter.id_salesman,
          date_bg: this.dataFilter.date_bg,
          per_page:'all',
          tipe: this.dataFilter.tipe,
          status : this.dataFilter.status === 'semua' ? 'all' : this.dataFilter.status,
          start_date:this.dataFilter.start_date,
          end_date:this.dataFilter.end_date,
          keyword:this.dataFilter.keyword,
          depo : this.dataFilter.depo,
          id_mitra : this.dataFilter.id_mitra,
        }

        this.isPdfRequest = true;

        this.axios.get('/detail_pelunasan_penjualan/get/report_pembayaran/custom', {
          params: filter_pdf
        }).then(res => {
          let data = {
            items : res.data.data,
            judul : res.data.judul,
            tipe : res.data.tipe,
            total : res.data.total,
            start_date:this.dataFilter.start_date,
            end_date:this.dataFilter.end_date,
            terbilang: res.data.terbilang,
            team: res.data.team,
            perusahaan: res.data.nama_perusahaan
          }
          console.log(data);

          if (localStorage.getItem("semuaInvoice") === null) {
            localStorage.semuaInvoice = JSON.stringify(data)
          }else
          {
            localStorage.removeItem('semuaInvoice');
            localStorage.semuaInvoice = JSON.stringify(data)
          }

          window.open(window.location.origin+'/dashboard/finance/pelunasan/print', '_blank')

          this.isPdfRequest = false;

        }).catch(err => {
          this.onError(err)
          this.isPdfRequest = false
        })



      }
    },

    _createExcel(){
      this.isExcelRequest = true

      // let tipe = this.dataFilter.tipe == 'semua' ? '' : this.dataFilter.tipe
      // let status = this.dataFilter.status == 'semua' ? '' : this.dataFilter.status

      // let url = 'detail_pelunasan_penjualan?id_salesman='+this.dataFilter.id_salesman+'&per_page=all&page=1&tipe='+tipe+'&date='+this.dataFilter.start_date+'&status='+status+'&keyword='+this.dataFilter.keyword;
      this.axios.get('detail_pelunasan_penjualan/get/report_pembayaran', {params: this.dataFilter}).then(res => {
        window.open(res.data)

        // let excel = [], nominal = 0
        // let keys = ['no_invoice','no_acc','nama_toko','cust_no','nama_salesman','nama_tim','tipe','nominal','bank','no_rekening','no_bg','jatuh_tempo_bg','status']

        // res.data.data.forEach((o) => {
        //   excel.push(
        //     this.fillK({keys: keys, o: o})
        //   )

        //   nominal += Number(o.nominal);
        // })

        // excel.push(
        //   this.fillK({keys: keys, fill: ['tipe','nominal'], value: ['Total', nominal]})
        // )

        // this.createExcel({data: excel,filename: 'pembayaran-'+this.dataFilter.start_date})
        this.isExcelRequest = false
      }).catch(err => {
        this.onError(err)
        this.isExcelRequest = false
      })

    }
  },

  mounted(){
    this.auth = JSON.parse(localStorage.user)
    this._get()
  },


};
</script>

<style lang="scss" scoped src="./pelunasan.scss"/>
