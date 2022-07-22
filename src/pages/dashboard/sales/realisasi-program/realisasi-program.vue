<template>
  <div class="antialiased">

    <Sidebar/>


    <div class="page">
      
      <Header @change="_search" hint="Ketik no invoice"/>

      <div class="content">
        <div class="container">
          <!-- Page title -->
          <div class="page-header">
            <div class="row d-flex justify-content-between">
              <div class="col-auto">
                <h2 class="page-title">
                  Realisasi Program
                </h2>
              </div>
              <!-- <div class="col-auto">
                <div class="text-muted text-h5 mt-2">Login Pada {{auth.logged_at}}</div>
              </div> -->

              <div class="col-auto">
                <div class="row">
                  <div class="col-auto px-0">
                  </div>

                  <div class="col-auto">
                    <button class="btn btn-white" @click="_filter" v-html="ic('filter')+' Filter'"/>
                    <button class="btn btn-outline-primary ml-3" @click="_createPdf" v-html="'Export PDF'" :disabled="Object.keys(temp).length == 0"/>
                    <button class="btn btn-outline-primary ml-3" @click="_createExcel" :disabled="Object.keys(temp).length == 0" 
                    v-html="ic('download')+' Export Excel'"> </button>
                    <button class="btn btn-outline-primary ml-3" v-html="ic('printer')+' Cetak'" @click="_print" :disabled="Object.keys(temp).length == 0"/>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <Skeleton type="table" :length="10" class="mt-3 bg-white" v-if="loading"/>

          <Nodata v-if="!loading && Object.keys(temp).length == 0"/>

          <div class="box" v-if="!loading && Object.keys(temp).length > 0">
              <div class="card">
                <div class="table-responsive">
                  <table class="table table-hover card-table table-striped">
                    <thead>
                      <tr class="text-muted">
                        <th>Team</th>
                        <th>No Invoice</th>
                        <th>No Po</th>
                        <th>Tgl</th>
                        <th>Customer</th>
                        <th>Alamat</th>
                        <th>Pengambilan</th>
                        <th>Program</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(row, i) in temp" :key="i">
                        <td>{{row.nama_tim}}</td>
                        <td>{{row.no_invoice}}</td>
                        <td>{{row.no_po}}</td>
                        <td>{{row.tgl}}</td>
                        <td>{{row.nama_toko}}</td>
                        <td>{{row.alamat}}</td>
                        <td>
                          <ul class="items">
                            <li v-for="(item, l) in row.items" :key="l">
                              <div class="row">
                                <div class="col-6">
                                  <span v-html="item.kode_barang"></span>
                                </div>

                                <div class="col-6 text-right">
                                  <span v-html="item.qty+' / '+item.qty_pcs"></span>
                                </div>
                              </div>
                              <!-- barang extra -->
                              <div style='color: royalblue' class="row" v-if="item.barang_extra != ''">
                                <div class="col-6">
                                  <span> {{item['barang_extra'].kode_barang}} </span>
                                </div>

                                <div class="col-6 text-right">
                                  <span v-html="item['barang_extra'].bonus_qty+' / '+item['barang_extra'].bonus_qty_pcs"></span>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </td>

                        <td>
                          <ul class="items">
                            <li v-for="(item, l) in row.items" :key="l">
                                <div v-html="ribuan(item.discount)" class="text-right"></div>
                            </li>
                          </ul>
                        </td>
                      </tr>
                    </tbody>

                    <tfoot>
                      <tr>
                        <td colspan="6"></td>
                        <td>
                           <div class="row">
                              <div class="col-6">
                                <span v-html="'TOTAL'"></span>
                              </div>

                              <div class="col-6 text-right">
                                <span v-html="ribuan(totalQty)+' / '+ribuan(totalPcs)"></span>
                              </div>
                            </div>
                        </td>
                        <td class="text-right" v-html="ribuan(Math.round(total))"></td>
                      </tr>

                      <tr v-if="dataFilter.barang_extra == 'include'">
                        <td colspan="6"></td>
                        <td>
                          <div class="row">
                            <div class="col-6">
                              <span v-html="'TOTAL BONUS'"></span>
                            </div>

                            <div class="col-6 text-right">
                              <span v-html="ribuan(totalQtyExtra)+' / '+ribuan(totalPcsExtra)"></span>
                            </div>
                          </div>
                        </td>
                        <td class="text-right" v-html="ribuan(0)"></td>
                      </tr>

                      <tr>
                        <td colspan="6"></td>
                        <td>
                          <span v-html="'PPn 10 %'"></span>
                        </td>
                        <td class="text-right" v-html="ribuan(Math.round(totalPpn))"></td>
                      </tr>

                      <tr>
                        <td colspan="6"></td>
                        <td>
                          <span v-html="'GRAND TOTAL'"></span>
                        </td>
                        <td class="text-right" v-html="ribuan(Math.round(grandTotal))"></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
          </div>

          <b-pagination v-if="data.length > 0 && !loading" align="center" class="mt-5" :total-rows="dataFilter.totalRows" v-model="dataFilter.currentPage" :per-page="paginate.perPage" @change="_pageChange" />

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
import XLSX from "xlsx";

export default {
  name: "RealisasiProgramm",
  components: { FormFilter },

  data() {
    return {
        auth: {},

        filter: {
          config: { view: false, title: null },
          data: null, isSubmit: false,
          action: () => {}
        },

        loading: false,
        data: [], temp: [],
    
        dataFilter: {
          id_promo: null,
          per_page : '10',
          currentPage : 1,
          id_salesman: 'all',
          start_date: null,
          end_date: null,
          barang_extra: 'exclude'
        },

        paginate: {
          currentPage: 1,
          totalRows: 0,
          perPage: 10,
          fromPage: 0
        },

        totalQty: 0, totalPcs: 0, total: 0, totalPpn: 0, grandTotal: 0, totalQtyExtra: 0, totalPcsExtra:0,

        program: null,
        remark: null,
        periode: null,
        periode_program : null,
        team: null

    };
  },

  mixins: [helper],

  methods: {

      _get(params){
        this.loading = params == null ? true : !params.silent

        this.axios.get('report/realisasi_program', {params: this.dataFilter}).then(res => {
          let data = res.data.data
          // this.loading = false;

          // this.dataFilter.totalRows = res.data.total;
          // this.dataFilter.fromPage = res.data.fromPage;

          this.data = data
          this.temp = data
          this.team = res.data.team;

          if(Object.keys(data).length != 0){
            // this.totalQty = res.data.total_qty;
            // this.totalPcs = res.data.total_qty_pcs;
            this.totalQty = 0;
            this.totalPcs = 0;
            this.total = 0;
            this.totalPpn = 0;
            this.grandTotal = 0;
            this.totalQtyExtra = 0;
            this.totalPcsExtra = 0;

            for (const key in data) {
              if(data[key].items){
                for (let i = 0; i < data[key].items.length; i++) {
                  let item = data[key].items[i]
                  let extra = data[key].items[i].barang_extra

                  this.totalQty += +item.qty
                  this.totalPcs += +item.qty_pcs
                  this.total += +item.discount
                  this.totalPpn += +item.ppn
                  this.grandTotal += +item.discount_inc_tax
                  this.totalQtyExtra += +extra.bonus_qty || 0
                  this.totalPcsExtra += +extra.bonus_qty_pcs || 0
                }
              }
            }
            
            this.program  = res.data.promo.nama_promo
            this.remark   = res.data.promo.keterangan
            this.periode  = this.dFormat(res.data.start_date,'d_M_Y')+' s/d '+ this.dFormat(res.data.end_date,'d_M_Y')
            if(res.data.promo.tanggal_awal == null){
              this.periode_program = '- s/d -'
            }
            else{
              this.periode_program = (res.data.promo.tanggal_awal == null ? '-' : this.dFormat(res.data.promo.tanggal_awal,'d_M_Y')) +' s/d '+ (res.data.promo.tanggal_akhir == null ? '-' : this.dFormat(res.data.promo.tanggal_akhir,'d_M_Y'))
            }
          }

          this.loading = false;
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

      _pageChange(page){
        this.dataFilter.currentPage = page;
        this._get();
      },

      _search(keyword){
        let k = keyword.toString().toLowerCase(), temp = []

        this.temp = []

        for (const key in this.data) {
          if(this.data[key].no_invoice.toString().includes(k)){
            temp.push(this.data[key])
          }
        }

        this.temp = temp
       
      },

      _createPdf(){

        let doc = new jsPDF('p', 'mm', [794, 1041]), user = JSON.parse(localStorage.user);
        let styles = { fillColor: [255, 255, 255], cellPadding: 0, lineColor: 0 }

        doc.autoTable({
          theme: 'plain',
          styles: { fillColor: [255, 255, 255], cellPadding: 0, lineColor: 0 },
          margin: { top: 10, left: 10, right: 10 },
          columnStyles: { 1: { halign: 'center', fontSize: 15 } },
          
          head: [[{ content: 'Laporan Realisasi Program', styles: { halign: 'center', fontSize: 15, fontStyle: 'bold' } }]],
        })

        doc.autoTable({
          theme: 'plain',
          styles: { fillColor: [255, 255, 255], cellPadding: 0, lineColor: 0 },
          margin: { top: 10, left: 10, right: 10 },
          // columnStyles: { 1: { halign: 'center', fontSize: 15 } },
          
          body: [
            [{ content: 'Program', styles: { cellWidth: 20} }, ': '+this.program],
            [{ content: 'Remark', styles: { cellWidth: 20} }, ': '+this.remark],
            [{ content: 'Periode', styles: { cellWidth: 20} }, ': '+this.periode],
            [{ content: 'Team', styles: { cellWidth: 20} }, ': '+this.team],
            [{content: 'Periode Program : '+this.periode_program , colSpan: 3, styles: { fillColor: [255, 255, 255], cellPadding: 0, lineColor: 0, cellWidth: 0, halign: 'right', fontStyle: 'bold' }}],
          ],
        })

        
        function _head(text, w = null, cs = 1){
          return {content: text, colSpan: cs, styles: { fillColor: [255, 255, 255], cellPadding: 2, lineColor: 0, cellWidth: w, halign: 'center', fontStyle: 'bold' }}
        }

        let header = [_head('No Inv'), _head('No PO'), _head('Tgl'), _head('Customer'), _head('Alamat'), _head('Pengambilan', 30, 2), _head('Program')], body = []

        body.push(header)

        let totalQty = 0, totalPcs = 0, total = 0, ppn = 0, grandTotal = 0

        for (const key in this.data) {
          let data = this.data[key]

          let items = []
          console.log(data)

          let pengambilan = '', itemQtyPcs = '', discount = ''

          if(data.items){
            for (let i = 0; i < data.items.length; i++) {
              let item = data.items[i]

              pengambilan += item.kode_barang+(i == (data.items.length - 1) ? '' : '\n')
              itemQtyPcs += (item.qty+'/'+item.qty_pcs).toString()+(i == (data.items.length - 1) ? '' : '\n')
              discount += (this.ribuan(item.discount)).toString()+(i == (data.items.length - 1) ? '' : '\n')

              totalQty += +item.qty
              totalPcs += +item.qty_pcs
              total += +item.discount
              grandTotal += +item.discount_inc_tax
              ppn += +item.ppn
            }
          }

          body.push([
            data.no_invoice,
            data.no_po,
            data.tgl,
            data.nama_toko,
            data.alamat,
            {content: pengambilan, styles: {halign: 'left', cellWidth: 25}},
            {content: itemQtyPcs, styles: {halign: 'right', cellWidth: 17}},
            {content: discount, styles: {halign: 'right', cellWidth: 25}},
          ])
        }

        body.push([
          {content: '', colSpan: 5},
          {content: 'TOTAL'},
          {content: this.ribuan(totalQty)+'/'+this.ribuan(totalPcs), styles: {halign: 'right'}},
          {content: this.ribuan(Math.round(total)), styles: {halign: 'right'}}
        ])

        body.push([
          {content: '', colSpan: 5},
          {content: 'PPn 10%', colSpan: 2},
          {content: this.ribuan(Math.round(ppn)), styles: {halign: 'right'}}
        ])

        body.push([
          {content: '', colSpan: 5},
          {content: 'GRAND TOTAL', colSpan: 2},
          {content: this.ribuan(Math.round(grandTotal)), styles: {halign: 'right'}}
        ])

        doc.autoTable({
          theme: 'grid',
          styles: { fillColor: [255, 255, 255], cellPadding: 2, lineColor: 0, halign: 'left'},
          margin: { top: 10, left: 10, right: 10 },
          // columnStyles: { 1: { halign: 'center', fontSize: 15 } },

          body: body
        })


        this.pdfDownload([ doc.output() ])
      },
      _print(){
        let doc = new jsPDF('p'), user = JSON.parse(localStorage.user);
        let styles = { fillColor: [255, 255, 255], cellPadding: 0, lineColor: 0 }
        let data = {
          team : this.team,
          totalQty: this.totalQty,
          totalPcs: this.totalPcs,
          totalQtyExtra: this.totalQtyExtra,
          totalPcsExtra: this.totalPcsExtra,
          total: this.total,
          totalPpn: this.totalPpn,
          grandTotal: this.grandTotal,
          program: this.program,
          remark: this.remark,
          periode: this.periode,
          periode_program: this.periode_program,
          items : this.data,
          barang_extra: this.dataFilter.barang_extra
        }
        localStorage.realisasi = JSON.stringify(data)
        window.open(window.location.origin+'/dashboard/sales/realisasi-program/print', '_blank')
      },

      _createExcel(){
        let dataExcel = [['Team','No Invoice','No Po','Tanggal','Customer','Alamat','Pengambilan','qty/qty_pcs','Program']];
        var num = 1;
        var height = 0;
         for (const key in this.data) {
          let data = this.data[key]
          let data_items = data.items;
            let main = [
              data.nama_tim,
              data.no_invoice,
              data.no_po,
              data.tgl,
              data.nama_toko,
              data.alamat,
            ]
          if(data_items){
            for (var i = 0; i < data_items.length; i++) {
              let main_res        = main
              let data_detail     = data_items[i]
              data_detail.qty     = data_detail.qty ? data_detail.qty : 0;
              data_detail.qty_pcs = data_detail.qty_pcs ? data_detail.qty_pcs : 0;

              if(i==0){
                main_res.push(data_detail.kode_barang)
                main_res.push(data_detail.qty+' / '+data_detail.qty_pcs)
                main_res.push(data_detail.discount)
                dataExcel.push(main_res)
              }
              else{
                let res = [
                  '','','','','','',
                  data_detail.kode_barang,
                  data_detail.qty+' / '+data_detail.qty_pcs,
                  data_detail.discount
                ]
                dataExcel.push(res)
              }

            }
          }
          else{
            dataExcel.push(main)
          }
        }
        var ws = XLSX.utils.aoa_to_sheet(dataExcel);
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Realisasi Program");
        const wbout = XLSX.write(wb, { type: "array", bookType: "xlsx" });
        saveAs(new Blob([wbout], { type: "application/octet-stream" }), "Realisasi Program.xlsx");
      }
    
  },

  mounted(){
    this.auth = JSON.parse(localStorage.user)
  }

};
</script>

<style lang="scss" scoped>
  .items{
    margin: 0;
    padding: 0;

    li{
      list-style: none;
    }
  }
</style>