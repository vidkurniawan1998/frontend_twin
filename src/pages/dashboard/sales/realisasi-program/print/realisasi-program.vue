<template>
    <div class="body">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.css">
	    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">

        <h4 style="width: 100%; text-align: center; font-weight: bold;" >Laporan Realisasi Program</h4>
        <div class="page-header">
            <div class="row">
                <div class="col-12">
                    <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                            <td valign="top">
                                <table style="width: 100%;">
                                    <tr>
                                        <td style="width: 5%;" >Program</td>
                                        <td style="width: 1%;">:</td>
                                        <td colspan="3" v-html="data.program"></td>
                                    </tr>
                                    <tr>
                                        <td>Remark</td>
                                        <td>:</td>
                                        <td colspan="3" v-html="data.remark"></td>
                                    </tr>
                                    <tr>
                                        <td>Periode</td>
                                        <td>:</td>
                                        <td  v-html="data.periode"></td>
                                    </tr>
                                    <tr>
                                        <td>Team</td>
                                        <td>:</td>
                                        <td v-html="data.team"></td>
                                        <td colspan="2" style="text-align: right;font-weight: bold;">Periode Program : {{data.periode_program}}</td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>

        <table style="width: 100%; font-size: 14px" class="table-border ">
            <thead>
                <div class="page-header-space"></div>
                <tr class="text-center">
                    <th style="width: 15%">
                        No Inv
                    </th>
                    <th style="width: 13%">
                        No Po
                    </th>
                    <th style="width: 7%">
                        Tgl
                    </th>
                    <th style="width: auto">Customer</th>
                    <th style="width: 23%">Alamat</th>
                    <th colspan="2" style="width: 20%">
                        Pengambilan
                    </th>
                    <th style="width: 10%">
                        Program
                    </th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="(row, i) in data.items" :key="i" class="detail">
                    <td valign="top" class="text-left" v-html="row.no_invoice"></td>
                    <td valign="top" class="text-left" v-html="row.no_po"></td>
                    <td valign="top" class="text-center" v-html="row.tgl"></td>
                    <td valign="top" class="text-left" v-html="row.nama_toko"></td>
                    <td valign="top" class="text-left" v-html="row.alamat"></td>
                    <td valign="top" class="text-left" style="width: 10%">
                        <template v-for="(val , x) in row.items">
                            {{val.kode_barang}} {{x == ( row.items.length - 1) ? '' : ''}} <br>
                            <template v-if="val.barang_extra != ''">
                                {{val.kode_barang}} [Ekstra]
                            </template>
                        </template>
                    </td>
                    <td valign="top" class="text-right" style="width: 5%">
                        <template v-for="(val , x) in row.items">
                            {{val.qty}}/{{val.qty_pcs}} {{x == ( row.items.length - 1) ? '' : ''}} <br>
                            <template v-if="val.barang_extra != ''">
                                {{val['barang_extra'].bonus_qty}}/{{val['barang_extra'].bonus_qty_pcs}}
                            </template>
                        </template>
                    </td>
                    <td valign="top" class="text-right">
                        <template v-for="(val , x) in row.items">
                            {{ribuan(val.discount)}} {{x == ( row.items.length - 1) ? '' : ''}} <br>
                            <template v-if="val.barang_extra != ''">
                                {{ribuan(0)}}
                            </template>
                        </template>
                    </td>
                </tr>
                <tr>
                    <td valign="top" colspan="5"></td>
                    <td valign="top" class="text-left">Total</td>
                    <td valign="top" class="text-right">{{ribuan(data.totalQty)}}/{{data.totalPcs}}</td>
                    <td valign="top" class="text-right">{{ribuan(Math.round(data.total))}}</td>
                </tr>
                <tr v-if="data.barang_extra == 'include'">
                  <td valign="top" colspan="5"></td>
                  <td valign="top" class="text-left">Total Extra</td>
                  <td valign="top" class="text-right">{{ribuan(data.totalQtyExtra)}}/{{data.totalPcsExtra}}</td>
                  <td valign="top" class="text-right">0</td>
                </tr>
                <tr>
                    <td valign="top" colspan="5"></td>
                    <td valign="top" colspan="2" class="text-left">PPn 10%</td>
                    <td valign="top" class="text-right">{{ribuan(Math.round(data.totalPpn))}}</td>
                </tr>
                <tr>
                    <td valign="top" colspan="5"></td>
                    <td valign="top" colspan="2" class="text-left">GRAND TOTAL</td>
                    <td valign="top" class="text-right">{{ribuan(Math.round(data.grandTotal))}}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import helper from "@/assets/js/helper.js"; // ppn = subtotal * 0.1 , GT = subtotal + ppn

    export default {
        name: 'PrintRealisasiProgram',
        mixins: [helper],

        data(){
            return {
                data: {},
                footer: {
                    subtotal: 0, diskon: 0, ppn: 0, grand_total: 0, total_qty: 0, total_pcs: 0
                }
            }
        },

        methods: {
            getData(){
                let realisasi = JSON.parse(localStorage.realisasi)
                var formatted_date = new Date().toJSON().slice(0,10).replace(/-/g,'/');
                document.title = 'REALISASI PROGRAM '+realisasi.program+' '+formatted_date+' - PRINT'
                this.data = realisasi

                console.log(this.data.program)
                let items = realisasi.items

                setTimeout(() => {
                    window.print()
                }, 500);


                // localStorage.removeItem('invoice');
            }
        },

        mounted(){
            // window.close()
            this.getData()
        }
    }
</script>

<style lang="scss" scoped>

    .body {
        font-family: "Times New Roman", Helvetica, sans-serif;
    }
    .page-header, .page-header-space {
        height: 120px;
        padding-bottom: 10px;
    }

    .table-border tr td{
            padding: 3px;
            padding-left: 10px;
            border: solid 1px black;
    }

    .table-border tr th{
        padding: 5px;
        border: solid 1px black;
    }

    .page-header {
        position: fixed;
        // top: 0mm;
        width: 100%;
        border-bottom: 1px solid black; /* for demo */
        background: #fffffe; /* for demo */
    }

    .page {
    page-break-after: always;
    }

    @page {
        margin: 10mm
    }

    @media print {
    thead {display: table-header-group;}
    tfoot {display: table-footer-group;}

    button {display: none;}

    body {margin: 0;}
    }
</style>
