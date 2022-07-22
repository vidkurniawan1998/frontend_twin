<template>
  <div class="antialiased">

    <Sidebar/>


    <div class="page">
      
      <Header @keyup="_search" hint="Cari invoice"/>

      <div class="content">
        <div class="container">
          <!-- Page title -->
          <div class="page-header">
            <div class="row d-flex justify-content-between">
              <div class="col-auto">
                <h2 class="page-title">
                  Rekapitulasi Penagihan
                </h2>
              </div>

              <!-- <div class="col-auto">
                <div class="text-muted text-h5 mt-2">Login Pada {{auth.logged_at}}</div>
              </div> -->

              <div class="row mt-3">
                <div class="col-md-3">
                  <div class="form-group" ref="sales">
                    <label for="salesman" class="form-label">Mitra</label>
                    <selectize id="mitra" v-model="id_mitra" data-placeholder="Pilih Mitra" required :disabled="loading">
                      <option :value="d.id" v-for="(d, i) in mitra" :key="i"> {{d.perusahaan}} </option>
                    </selectize>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="form-group" ref="sales">
                    <label for="salesman" class="form-label">Pilih Salesman</label>
                    <selectize id="salesman" v-model="id_salesman" data-placeholder="Pilih Salesman" required :disabled="loading">
                      <option :value="d.id" v-for="(d, i) in salesman" :key="i"> {{d.nama_salesman}} ({{d.tim}}) </option>
                    </selectize>
                  </div>
                </div>

                <div class="col-md-3">
                  <div class="form-group">
                    <label for="tanggal" class="form-label">Tanggal</label>
                    <input id="tanggal" type="date" class="form-control" required v-model="tanggal" ref="date">
                  </div>
                </div>

                <div class="col-md-2">
                  <div class="form-group">
                    <label for="hari" class="form-label">Hari</label>
                    <selectize
                      data-placeholder="Pilih Hari"
                      id="hari"
                      v-model="hari_selected"
                      :disabled="loading"
                      required
                    >
                    <option :value="row" v-for="(row, i) in list_hari" :key="i">
                      {{ row }}
                    </option>
                  </selectize>
                  </div>
                </div>
                <div class="col-md-1"> <label for="" class="form-label">&nbsp;</label>
                  <button class="btn btn-white" @click="_get" :disabled="loading"> <i class="la la-lg la-search mr-1"></i> Cari </button>
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
                        <th>No Invoice</th>
                        <th>Toko</th>
                        <th>Tanggal Terkirim</th>
                        <th>Tanggal Jatuh Tempo</th>
                        <th>Total</th>
                        <th>Sisa</th>
                        <th>Minggu</th>
                        <th>Hari</th>
                        <th class="pos-relative">
                          <label class="form-check" style="position: absolute; top: 4px; right: 10px">
                            <input class="form-check-input" type="checkbox" :checked="data.length == checkeds.length" @click="_checkUncheck">
                            <span class="form-check-label"></span>
                          </label>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(row, i) in filter" :key="i" @click="_check(row.id)" style="cursor: default">
                        <td v-html="row.no_invoice == null ? '' : row.no_invoice"></td>
                        <td v-html="row.nama_toko"></td>
                        <td v-html="row.delivered_at"></td>
                        <td v-html="row.due_date"></td>
                        <td v-html="ribuan(row.jumlah_pembayaran)"></td>
                        <td v-html="ribuan(row.jumlah_belum_bayar)"></td>
                        <td v-html="row.minggu"></td>
                        <td>{{row.hari_jatuh_tempo}}</td>
                        <td class="text-right pos-relative">
                          <label class="form-check" style="position: absolute; top: 50%; transform: translate(0, -50%); right: 10px">
                            <input class="form-check-input" type="checkbox" :value="row.id" v-model="checkeds">
                            <span class="form-check-label"></span>
                          </label>
                        </td>
                      </tr>
                    </tbody>

                  </table>
                </div>
              </div>
          </div>

          <b-pagination v-if="data.length > 0 && !loading" align="center" class="mt-5" :total-rows="paginate.totalRows" v-model="paginate.currentPage" :per-page="paginate.perPage"/>

        </div>
      </div>

      <transition name="slide-fade-y">
        <button class="btn btn-primary btn-pill btn-fixed" @click="_print" v-if="checkeds.length > 0"> <i class="la la-lg la-print mr-1"></i> Cetak {{checkeds.length}} Penagihan</button>
      </transition>

    </div>

  </div>
</template>
<script>
import helper from "@/assets/js/helper.js";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {mapActions} from "vuex";

export default {
  name: "RekapitulasiPenagihan",
  components: {  },

  data() {
    return {
      auth: {},

      salesman: [], id_salesman: null, id_mitra: 1,

      request: false, loading: false,
      data: [], filter: [], mitra: [],
      
      hari_selected : '',
      list_hari : [
        'minggu',
        'senin',
        'selasa',
        'rabu',
        'kamis',
        'jumat',
        'sabtu'
      ],

      paginate: {
        currentPage: 1,
        totalRows: 0,
        perPage: 10,
        fromPage: 0
      },

      tanggal: this.dateTime('ymd'),
      checkeds: []
    };
  },

  mixins: [helper],

  methods: {
    ...mapActions('mitra', ['getListMitra']),
    ...mapActions('salesman', ['getListSalesman']),
    _check(id){
      let io = this.checkeds.indexOf(id)
      
      if(this.checkeds.indexOf(id) > -1){
        this.checkeds.splice(io, 1)
      }else{
        this.checkeds.push(id)
      }

      // document.getElementById('tsearch').focus()
    },

    _checkUncheck(){
      if(this.checkeds.length != this.data.length){
        this.checkeds = []
        
        for (let i = 0; i < this.data.length; i++) {
          let item = this.data[i]
          this.checkeds.push(item.id)        
        }
      }else{
        this.checkeds = []
      }
    },

    _getSalesman(){
      this.getListSalesman({}).then( res => {
        this.salesman = res
      })
    },

    _getMitra() {
      this.getListMitra({}).then( res => {
        this.mitra = res
      })
    },

    _get(){
      if(this.id_salesman == null){
        this.$refs.sales.getElementsByTagName('input')[0].focus()
        this.toast('Pilih salesman'); return
      }

      this.loading = true
      let hari = this.hari_selected;
      this.axios.get('pelunasan_penjualan', {
        params: {
          per_page: 'all',
          id_salesman: this.id_salesman,
          status:'belum_lunas',
          hari: hari,
          id_mitra: this.id_mitra
        }
      })
      .then(res => {
        this.loading = false;

        // this.paginate.totalRows = res.data.meta.total;
        this.data = this.filter = res.data.data;
      }).catch( err => {
        this.loading = false
        this.onError(err)
      });
    },

    _search(keyword){
      let k = keyword.toString().toLowerCase()
      this.filter = []

      for (let i = 0; i < this.data.length; i++) {
        let item = this.data[i]

        if(item.no_invoice.toString().toLowerCase().includes(k)){
          this.filter.push(item)
        }
      }
    },

  _print(){
      if(this.tanggal == null){
        this.toast('Inputkan tanggal penagihan')
        return
      }

      this.axios.post(`pelunasan_penjualan/riwayat_penagihan`, {
        id_penjualan : this.checkeds,
        id_salesman : this.id_salesman,
        tanggal_penagihan : this.tanggal,
      })  
      .catch(function (error) {
        console.log(error);
      });

      let doc = new jsPDF('l')
      let styles = { fillColor: [255, 255, 255], cellPadding: 0, lineColor: 0 }
      let data0 = this.data.find(el => el.id == this.checkeds[0])
      let kode_mitra = data0.kode_mitra !== '' ?  `(${data0.kode_mitra})` : '';
      doc.autoTable({
        theme: 'plain',
        styles: { fillColor: [255, 255, 255], cellPadding: 0, lineColor: 0, fontSize: 15 },
        margin: { top: 10, left: 10, right: 10 },
        columnStyles: { 1: { halign: 'center', fontSize: 18 } },
        
        head: [[`Rekapitulasi Tagihan Kolektor ${kode_mitra}`,'']],
      })

      let sales = this.salesman.find((item) => item.id == this.id_salesman)

      doc.autoTable({
        theme: 'plain', styles: styles, margin: { top: 0, left: 10, right: 10 },
        body: [
          ['SALESMAN : '+sales.nama_salesman],
          ['TANGGAL : '+this.dFormat(this.tanggal, 'dMY')],
          ['PRINT : '+this.dateTime('datetime')],
        ],
      })

      function _row(params = {}){
        return { content: params.title, rowSpan: params.row || 2, styles: { halign: 'center', valign: 'middle', fontStyle: 'bold' } }
      }

      // get data checked
      let invoices = [
        [
          _row({title: 'No. Inv'}), _row({title: 'Tgl. Deliver'}), _row({title: 'Nama'}), _row({title: 'Total'}), _row({title: 'Sisa'}), { content: 'Tunai', rowSpan: 2, styles: { halign: 'center', valign: 'middle', fontStyle: 'bold', cellWidth: 30 } },
          { content: 'Cheque / BG', colSpan: 4, styles: { halign: 'center', fontStyle: 'bold' } }, _row({title: 'Return'}),_row({title: 'Transfer'}),_row({title: 'Total'}),_row({title: 'Ket'})
        ],
        
        [
          _row({title: 'BG', row: 1}),
          _row({title: 'NoBG', row: 1}),
          _row({title: 'Jt', row: 1}),
          _row({title: 'Bank', row: 1})
        ],

      ]

      let total = 0

      for (let i = 0; i < this.data.length; i++) {
        let item = this.data[i]

        if(this.checkeds.indexOf(item.id) > -1){
          // invoices.push(item)
          invoices.push(
            [
              item.no_invoice,
              item.delivered_at,
              item.nama_toko,
              this.ribuan(item.jumlah_pembayaran),
              this.ribuan(item.jumlah_belum_bayar),
            ]
          )

          total += +item.jumlah_belum_bayar
        }
      }
      function _noBorder(text){
        return { content: text, styles: { lineWidth: 0 } }
      }

      invoices.push(
        [
          _noBorder(''),  _noBorder(''),  _noBorder(''),  _noBorder(''),
           _noBorder(this.ribuan(total)),  _noBorder(''), _noBorder(''),  _noBorder(''), _noBorder(''), _noBorder(''), _noBorder(''), _noBorder(''), _noBorder(''), _noBorder(''),
         
        ]
      )

      doc.autoTable({
        theme: 'grid',
        styles: { fillColor: [255, 255, 255], cellPadding: 2, lineColor: 0 },
        margin: { top: 10, left: 10, right: 10 },
        body: invoices,
      })

      doc.autoTable({
        theme: 'plain',
        styles: { fillColor: [255, 255, 255], cellPadding: 2, lineColor: 0 },
        margin: { top: 10, left: 10, right: 10 },
        body: [
          ['Open File', 'SPV Salesman','Salesman'],
          [''],[''],
          ['(                                                )','(                                                )','(                                                )']
        ],
      })

      this.pdfDownload([ doc.output() ])
    }

  },

  mounted(){
    this.auth = JSON.parse(localStorage.user)
    this._getSalesman()
    this._getMitra()
  },

};
</script>

<style lang="scss" scoped>

  .btn-fixed{
    position: fixed;
    right: 15px;
    bottom: 15px;
  }

</style>