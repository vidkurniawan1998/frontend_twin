<template>
  <div class="antialiased">

    <Sidebar/>


    <div class="page">
      
      <Header hint="Cari" :enabled="false"/>

      <div class="content">
        <div class="container">
          <!-- Page title -->
          <div class="page-header">
            <div class="row d-flex justify-content-between">
              <div class="col-auto">
                <h2 class="page-title">
                  Export Data Penjualan
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
                    <!-- <button class="btn btn-primary ml-3" v-html="ic('download')+' Export Excel'" @click="_exportExcel"> </button> -->
                  </div>
                </div>

              </div>
            </div>
          </div>

          <Skeleton type="table" :length="10" class="mt-3 bg-white" v-if="loading"/>

          <Nodata v-if="!loading && data.length == 0 && isFilter"/>
          <div class="alert alert-info" v-if="!isFilter && !loading">
            <i class="fe fe-info mr-2"></i> Pilih filter untuk memuat data Sales To Trade
          </div>

          <div class="text-center my-6" v-if="!loading && data.length > 0">
            
            <img :src="asset('doc.png')" alt="" style="width: 200px; opacity: .5">
            <h3 class="my-3" v-html="data.length+' Data'"></h3>

            <div class="btn-group">
              <button class="btn btn-outline-primary" @click="_createPdf">Export PDF</button>
              <button class="btn btn-primary" @click="_createExcel">Export Excel</button>
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

import jsPDF from "jspdf";
import "jspdf-autotable";

export default {
  name: "LaporanSTT",
  components: { FormFilter },

  data() {
    return {
      auth: {},

      filter: {
        config: { view: false, title: null },
        data: null, isSubmit: false,
        action: () => {}
      },

      loading: true, isFilter: false,
      data: [],
  
      dataFilter: {
        id_depo: 'all',
        id_salesman: 'all', salesman: '', tim: '',
        start_date: this.dateTime('ymd'),
        end_date: this.dateTime('ymd'),
        tipe_pembayaran: 'all'
      },

    };
  },

  mixins: [helper],

  methods: {

      _get(){
        this.loading = true

        let url = 'penjualan?per_page=all&page=1&id_salesman='+this.dataFilter.id_salesman+'&id_depo='+this.dataFilter.id_depo+'&start_date='+this.dataFilter.start_date+'&end_date='+this.dataFilter.end_date+'&tipe_pembayaran='+this.dataFilter.tipe_pembayaran+'&status=fixed';
        this.axios.get(url).then(res => {
          this.loading = false;

          if(res.data.length != 0){
            this.data = res.data.data
          }
        }).catch( err => {
          this.loading = false
          this.onError(err)
        });
      },

      _filter(){
        this.filter.config = {view: true, title: 'Filter'}
        this.filter.action = (formData) => {
          this.isFilter = true

          for (const key in formData) {
            this.dataFilter[key] = formData[key]
          }

          this._get()
        }
      },

      _createPdf(){
        let doc = new jsPDF('p'), user = JSON.parse(localStorage.user);
        let styles = { fillColor: [255, 255, 255], cellPadding: 0, lineColor: 0 }

        // title
        doc.autoTable(this.pdfHeader(''))

        doc.autoTable({ // header
          theme: 'plain', styles: styles, margin: { top: 10, left: 10, right: 10 },
          body: [
            ['Tipe Pembayaran : '+this.dataFilter.tipe_pembayaran, 'Salesman : '+this.dataFilter.salesman],
            ['Tanggal : '+this.dataFilter.start_date+' - '+this.dataFilter.end_date, 'Tim : '+this.dataFilter.tim]
          ],
        })

        let header = [['No. Po','No. Invoice','No. Akun','Nama Toko','Subtotal','Diskon','PPN','Grand Total']], temp = [], tSubtotal = 0, tDiskon = 0, tPpn = 0, tGrandT = 0;

        this.data.forEach((o, i) => {
          temp.push(o.id)
          temp.push(o.no_invoice)
          temp.push(o.toko[0].no_acc)
          temp.push(o.toko[0].nama_toko)
          // temp.push(o.salesman[0].tim)
          // temp.push(o.salesman[0].nama_salesman)
          // temp.push(o.tanggal)
          // temp.push(o.tipe_pembayaran)
          temp.push(this.ribuan(o.total))
          temp.push(this.ribuan(o.disc_total))
          temp.push(this.ribuan(o.ppn))
          temp.push(this.ribuan(o.grand_total))

          // tipe = o.tipe_pembayaran;
          // sales = o.salesman[0].nama_salesman;
          // tim = o.salesman[0].tim;

          tSubtotal += o.total
          tDiskon += o.disc_total
          tPpn += o.ppn
          tGrandT += o.grand_total

          header.push(temp)
          temp = []
        });

        header.push([
          { content: 'Total', colSpan: 4, styles: { halign: 'center' } }, this.ribuan(tSubtotal+'|,2'), this.ribuan(tDiskon+'|,2'), this.ribuan(tPpn), this.ribuan(tGrandT)
        ])

        styles['cellPadding'] = 2;

        doc.autoTable({ // body
          theme: 'grid', styles: styles, margin: { top: 10, left: 10, right: 10 },
          bodyStyles: { valign: "top", fillColor: [255, 255, 255], textColor: [0,0,0], fontSize: 9, lineWidth: .1, lineColor: 1 },
          body: header
        })

        this.pdfDownload([ doc.output() ])
      },

      _createExcel(){

        let count = {}, result = [], // jika result = this.dataForExcel; jika ada perubahan pada result, this.dataForExcel akan ikut berubah
          countBy = ['id','no_invoice','']
      
          // set key pada count
          countBy.forEach((k, i) => { count[k] = 0 })

          let subTotal = 0, diskon = 0, ppn = 0, grantT = 0;

          // jumlahkan
          this.data.forEach((o) => { 
            result.push({
              'no. po': o.id,
              'no. invoice': o.no_invoice,
              'no acc': o.toko[0].no_acc,
              'toko': o.toko[0].nama_toko,
              'tim': o.salesman[0].tim,
              'salesman': o.salesman[0].nama_salesman,
              'tanggal': o.tanggal,
              'tipe pembayaran': o.tipe_pembayaran,
              'status': o.status,
              'subtotal': o.total,
              'diskon': o.disc_total,
              'ppn': o.ppn,
              'grand total': o.grand_total
            });

            subTotal += o.total;
            diskon += o.disc_total;
            ppn += o.ppn;
            grantT += o.grand_total;
          })

          result.push({
            'no. po': '',
            'no. invoice': '',
            'toko': '',
            'salesman': '',
            'tanggal': '',
            'tipe pembayaran': '',
            'status': 'total',
            'subtotal': subTotal,
            'diskon': diskon,
            'ppn': ppn,
            'grand total': grantT
          });
        
        this.createExcel({data: result, filename: 'data-penjualan-'+this.dataFilter.start_date+' - '+this.dataFilter.end_date})
      }
    
  },

  mounted(){
    this.auth = JSON.parse(localStorage.user)
    this._get()
  },

};
</script>
