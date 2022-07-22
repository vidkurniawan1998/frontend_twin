<template>
    <div>

        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.css">
	    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">

        <aside class="content-wrapper">
            <section class="content fontstyle">
                <div style="font-size: 14px">
                    <div class="row">
                         <div class="col-12">
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr> 
                                    <td valign="top" width="60%">
                                        <table>
                                            <tr v-if="data.filter.id_perusahaan">
                                                <td style="font-size: 18px">
                                                    <b style="font-weight: bold"><span style="text-transform: uppercase">{{ data.filter.nama_perusahaan }}</span> (Depo : {{data.filter.nama_depo}}) </b>
                                                </td>
                                            </tr>
                                            <tr >
                                                <td>
                                                    <span class="smaller-text">
                                                       Sales Retour Report by Category and Team
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <span class="smaller-text">
                                                        Periode : {{dFormat(data.filter.start_date,'d_M_Y')}} - {{dFormat(data.filter.end_date,'d_M_Y')}}
                                                    </span>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                    <td valign="top" v-if="data.filter.id_tim" width="40%" style="font-size: 14px; text-align: right;">
                                        <br><br>
                                        <b style="font-weight: bold;">SALESMAN : {{data.filter.nama_salesman}} ({{data.filter.nama_tim}})</b>
                                    </td>

                                </tr>
                            </table>
                        </div> 
                    </div>
                    <div class="row" style="margin-top: 10px;">
                        <div class="col-12">
                            <table style="width: 100%; font-size: 16px" class="table-non-border">
                                <thead>
                                    <tr class=" nowrap" >
                                      <th colspan="2"></th>
                                      <th>Kode</th>
                                      <th style="text-align: center;">Qty <br>(Dus/Pcs)</th>
                                      <th style="text-align: right;">Harga</th>
                                      <th style="text-align: right;">Sub Total</th>
                                      <th style="text-align: center;">Disc</th>
                                      <th style="text-align: right;">Balance</th>
                                    </tr>
                                  </thead>
                                  <tbody class="table borderless">
                                    <template v-for="(row, i) in data.laporan">
                                      <tr style="text-align: left;"    class="detail"  v-if="row.tipe=='banner'">
                                        <th>{{row.banner}}</th>
                                        <th colspan="7" >
                                            <span style="text-transform: uppercase;" >: {{row.banner_val}}</span><br>
                                        </th>
                                      </tr>
                                      <tr v-else  class="detail">
                                        <td style="text-align: left; padding-right: 10px;">{{ row.item_code}}</td>
                                        <td style="text-align: left;" colspan="2">{{ row.nama_barang}}</td>
                                        <td style="text-align: center;">{{ row.qty_dus | currency}} / {{ row.qty_pcs | currency}}</td>
                                        <td>{{ row.harga | currency}}</td>
                                        <td>{{ row.subtotal | currency}}</td>
                                        <td style="text-align: center;">{{ row.disc_nominal | currency}}</td>
                                        <td>{{ (row.subtotal-row.disc_nominal) | currency}}</td>
                                      <tr/>
                                   </template>
                                   <template>
                                     <tr class="bg-light"><td colspan="8"></td></tr>
                                     <tr class="detail">
                                       <td colspan="3" style="text-align: right; font-size: 18px; font-weight: 20px;">
                                         <b>Grand Total</b>
                                       </td>
                                       <td style="text-align: center;">{{data.grand_total.qty_dus | currency}} / {{data.grand_total.qty_pcs  | currency}}</td>
                                       <td>{{data.grand_total.harga | currency}}</td> 
                                       <td>{{data.grand_total.subtotal | currency}}</td>
                                       <td style="text-align: center;">{{data.grand_total.disc_nominal | currency}}</td>
                                       <td>{{(data.grand_total.subtotal-data.grand_total.disc_nominal) | currency}}</td>
                                     </tr>
                                   </template>
                                  </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>
        </aside>

    </div>
</template>

<script>
import helper from "@/assets/js/helper";
import {mapActions, mapState} from "vuex";

export default {
  name: "PrintRetur",
  mixins: [helper],
  data(){
    return{
        data: {},
    }
  },
  computed: {
     ...mapState(['loading']),
   }, 
   methods: {
        getData(){
            let retur_segmen = JSON.parse(localStorage.retur_segmen);
            this.data = retur_segmen;

            var formatted_date = new Date().toJSON().slice(0,10).replace(/-/g,'/');
            document.title = 'Return Segmen '+formatted_date+' - PRINT'

             setTimeout(() => {
                 window.print()
             }, 500);

        }
    },

    mounted(){
        this.getData()
    }
}
</script>

<style lang="scss" scoped>
    .body {
        font-family: "Times New Roman", Helvetica, sans-serif;
    }
    .content-wrapper {
        display: block;
        background-color: #ecf0f5;
    }
    .detail td{
        padding-left: 10px;
        text-align : right;
    }
    .content {
        min-height: 250px;
        padding: 15px;
        margin-right: auto;
        margin-left: auto;
        padding-left: 15px;
        padding-right: 15px;
    }

    .table-non-border {
        table-layout: fixed;
    }

    .table-non-border tr th{
        padding: 5px;
    }

    .content.fontstyle {
        font-family: Times New Roman, Helvetica, sans-serif;
        font-weight: 400;
    }

    .smaller-text{
        font-size: 14px;
    }

    .no-bottom {
        border-bottom: none !important;
    }

    .no-top {
        border-top: none !important;
    }

    .no-left {
        border-left: none !important;
    }

    .no-right {
        border-right: none !important;
    }

    tr.footer{
        border: none;
        font-weight: bold;
    }

    tr.footer td {
        padding-bottom: 2px !important;
        padding-top: 2px !important;
    }

    .borderless td, .borderless th {
        border: none;
    }

    @media print {
        .table-non-border{
        }
        thead tr th{
            page-break-inside: avoid;
        }
        thead {display: table-row-group;}
        footer {page-break-after: always;}
    }
</style>
