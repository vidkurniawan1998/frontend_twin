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
                                    <td valign="top" width="80%">
                                        <table>
                                            <tr>
                                                <td style="font-size: 18px">
                                                    <b style="font-weight: bold"><span style="text-transform: uppercase">{{ dataOri.perusahaan }}</span> (Depo : {{dataOri.depo}}) </b>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <span class="smaller-text">
                                                       Sales DO Accumulative Report By Item
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <span class="smaller-text">
                                                        Periode : {{dFormat(dataOri.start_date,'d_M_Y')}} - {{dFormat(dataOri.end_date,'d_M_Y')}}
                                                    </span>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                    <td valign="top" width="20%" style="font-size: 16px">
                                        <table>
                                            <tr>
                                                <td><b style="font-weight: bold">SALESMAN : {{dataOri.salesman}}</b></td>
                                            </tr>
                                        </table>
                                    </td>

                                </tr>
                            </table>
                        </div>
                    </div>
                    <div class="row" style="margin-top: 10px;">
                        <div class="col-12">
                            <table style="width: 100%; font-size: 16px" class="table-border">
                                <thead>
                                    <tr class=" nowrap" >
                                        <th colspan="4" rowspan="2" style="vertical-align : middle;text-align:center; width: 60%" >Code</th>
                                        <th rowspan="2" style="vertical-align : middle;text-align:center;">Level harga</th>
                                        <th colspan="2" style="text-align:center;">Qty</th>
                                        <th colspan="3" style="text-align:center;">Pengembalian</th>
                                    </tr>
                                    <tr class=" nowrap text-center">
                                        <th >Dus</th>
                                        <th>PCS</th>
                                        <th>1</th>
                                        <th>2</th>
                                        <th>3</th>
                                    </tr>
                                </thead>

                                 <template  v-for="(row) in data" >
                                    <tr class="detail">
                                        <td colspan="10"><strong>Group : </strong> {{row.nama_brand}}</td>
                                    </tr>

                                    <template v-for="val in row.barang">
                                    <tr class="detail" style="border-bottom: 1px solid black; border-collapse: collapse; ">
                                        <td class="text-left" style="padding: 12px !important;width: 10%">{{val.item_code}}</td>
                                        <td style="width: 10px !important!important">{{val.kode_barang}}</td>
                                        <td colspan="2" style="width: 50% ; text-align:left !important">{{val.nama_barang}}</td>
                                        <td class="text-center">{{val.tipe_harga}}</td>
                                        <td class="text-center">{{val.qty}}</td>
                                        <td class="text-center">{{val.qty_pcs}}</td>
                                        <td style="border: 1px solid black;"></td>
                                        <td style="border: 1px solid black;"></td>
                                        <td style="border: 1px solid black;"></td>
                                    </tr>
                                    </template>
                                    <tr class="detail" style="padding: 12px !important;" >
                                        <td colspan="5" style="text-align:right;"><strong>Subtotal : </strong></td>
                                        <td class="text-center"><strong>{{row.subtotal_dus}}</strong> </td>
                                        <td class="text-center"><strong>{{row.subtotal_pcs}}</strong></td>
                                        <td style="border: 1px solid black;"></td>
                                        <td style="border: 1px solid black;"></td>
                                        <td style="border: 1px solid black;"></td>
                                    </tr>
                                </template>

                            </table>
                        </div>
                    </div>
                    <div class="row" style="margin-top: 20px;">
                        <div class="col-12">
                            <table class="text-left" style="width: 100%">
                                 <tr >
                                    <td> <strong>No.DO: </strong></td>
                                    <template  v-for="(inv) in dataOri.invoice">
                                        {{inv}},
                                    </template>
                                </tr>
                                <tr>
                                    <td> <strong>Total.DO: </strong></td>
                                    <td> {{dataOri.num_invoice}}</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div class="row" style="margin-top: 20px;">
                        <div class="col-12">
                            <table  style="width: 100%">
                                <tr valign="top" style="height: 50px ">
                                    <td style="padding-left: 5%">Bag. Gudang</td>
                                    <td width="20%" class="text-center">Supir</td>
                                </tr>
                                <tr>
                                    <td>
                                        (<span style="padding-left: 20%">)</span>
                                    </td>
                                    <td class="text-center">
                                        (<span style="padding-left: 50%">)</span>
                                    </td>

                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            </section>
        </aside>

    </div>
</template>

<script>
import helper from "@/assets/js/helper.js";

    export default {
        name: 'PrintInvoice',
        mixins: [helper],

        data(){
            return {
                // data: {
                //     subtotal: 0, diskon: 0, ppn: 0, grand_total: 0
                // }
                data: {}, dataOri:{},
            }
        },

        methods: {
            getData(){
                let rakapitulasi = JSON.parse(localStorage.rekapitulasiDO),
                data = rakapitulasi.detail;
                this.data = data;
                this.dataOri = rakapitulasi;

                var formatted_date = new Date().toJSON().slice(0,10).replace(/-/g,'/');
                document.title = 'Rekapitulasi-DO'+formatted_date+' - PRINT'

                // console.log(this.data)

                setTimeout(() => {
                    window.print()
                }, 500);

            }
        },

        mounted(){
            // window.close()
            this.getData()
        }
    }
</script>

<style lang="scss" scoped>
    .row {
      display: block!important;
    }
    .body {
        font-family: "Times New Roman", Helvetica, sans-serif;
    }
    .content-wrapper {
        display: block;
        background-color: #ecf0f5;
    }
    .detail td{
        padding-left: 10px;
    }
    .content {
        min-height: 250px;
        padding: 15px;
        margin-right: auto;
        margin-left: auto;
    }

    .table-border {
        table-layout: fixed;
    }

    .table-border tr th{
        padding: 5px;
        border: solid 1px black;
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

    @media print {
        .table-border{
            border: solid 1px black !important;
        }
        thead tr th{
            page-break-inside: avoid;
        }
        thead {display: table-row-group;}
    }
</style>
