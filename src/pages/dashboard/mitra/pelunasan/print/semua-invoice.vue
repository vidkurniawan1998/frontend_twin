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
                                    <td valign="top">
                                        <table style="width: 100%; font-size: 16px" class="header">
                                            <tr>
                                                <td style="width: 30%;" > {{ data.perusahaan }}</td>
                                                <td style="width: 50%;text-align: center;font-weight: bold;" v-html="data.judul"></td>
                                                <td style="width: 20%;" colspan="2">
                                                  <span v-if="data.start_date == data.end_date">
                                                    Tanggal: {{dFormat(data.start_date,'d_M_Y')}}
                                                  </span>
                                                  <span v-else>
                                                    Tanggal : {{dFormat(data.start_date,'d_M_Y')}} - {{dFormat(data.end_date,'d_M_Y')}}
                                                  </span>
                                                </td>
                                            </tr>
                                            <template v-if="data.tipe != 'transfer'">
                                                <tr>
                                                    <td style="width: 80%;" colspan="2"> Diterima dari : {{data.team}}</td>
                                                    <td style="width: 20%;"></td>
                                                </tr>
                                            </template>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div class="row" style="margin-top: 10px;">
                        <div class="col-12">
                            <table style="width: 100%; font-size: 16px" class="table-border" >
                                <thead>
                                    <tr class="text-center">
                                        <th style="width: 15%">
                                            Cus.No
                                        </th>
                                        <th style="width: 15%">
                                            Toko
                                        </th>
                                        <th style="width: auto" >
                                            Description
                                        </th>
                                        <th v-if="data.tipe == 'bilyet_giro'" style="width: 10%">
                                            Tanggal
                                        </th>
                                        <th style="width: 10%">
                                            Debet
                                        </th>
                                        <th style="width: 10%">Credit</th>
                                    </tr>
                                </thead>
                                <tr class="detail" v-if="data.tipe == 'tunai' || data.tipe == 'saldo_retur'">
                                    <td valign="top" class="text-left">-</td>
                                    <td valign="top" class="text-left">KAS</td>
                                    <td valign="top" class="text-left"></td>
                                    <td valign="top" class="text-left">{{ribuan(Math.round(data.total))}}</td>
                                    <td valign="top" class="text-left"></td>
                                </tr>
                                <template v-for="(row, i) in  data.items">
                                    <tr class="detail" v-if="data.tipe !== 'tunai'">
                                        <td valign="top" class="text-left" >{{row.cust_no}}</td>
                                        <td  v-if="data.tipe == 'bilyet_giro' " valign="top" class="text-left">{{row.nama_toko}} - {{row.no_acc}}</td>
                                        <td v-else valign="top" class="text-left">{{row.no_acc}}</td>
                                        <template v-if="data.tipe == 'transfer'">
                                            <td valign="top" v-if="row.tipe == 'bilyet_giro'" class="text-left">{{row.bank}} / {{row.no_rekening}} / {{row.lokasi_toko}} / [{{row.tipe}}] / {{dFormat(row.tanggal_approve,'d_M_Y')}} / No. BG: {{row.no_bg}}</td>
                                            <td valign="top" v-else class="text-left">{{row.bank}} / {{row.no_rekening}} / {{row.lokasi_toko}} / [{{row.tipe}}] </td>
                                        </template>
                                        <template v-else-if="data.tipe == 'bilyet_giro'" >
                                            <td valign="top" class="text-left">{{row.bank}}-{{row.no_bg}} / {{ row.tanggal_approve != null ? dFormat(row.tanggal_approve,'d_M_Y') : 'WAITING'}} / {{ dFormat(row.jatuh_tempo_bg,'d_M_Y') }}</td>
                                            <td valign="top" class="text-left">{{dFormat(row.tanggal,'d_M_Y')}}</td>
                                        </template>
                                        <template v-else-if="data.tipe == 'tunai'" >
                                            <td valign="top" class="text-left"> </td>
                                        </template>
                                        <template v-else-if="data.tipe == 'saldo_retur'" >
                                            <td valign="top" class="text-left"></td>
                                        </template>
                                        <template v-else>
                                            <td valign="top" class="text-left">-</td>
                                        </template>
                                        <td valign="top" class="text-right">{{ribuan(Math.round(row.debet))}}</td>
                                        <td valign="top" class="text-left"></td>
                                    </tr>

                                    <template v-for="(val , x) in row.detail_report">
                                        <tr class="detail">
                                            <td valign="top" class="text-left" v-if="row.tipe == 'tunai' || row.tipe == 'saldo_retur'">{{row.cust_no}}</td>
                                            <td valign="top" class="text-left" v-else></td>
                                            <template v-if="data.tipe == 'bilyet_giro' || data.tipe == 'tunai' || data.tipe == 'saldo_retur'" >
                                                <td valign="top" class="text-left">{{val.nama_toko}} - {{val.no_acc}} </td>
                                            </template>
                                            <template v-else >
                                                <td valign="top" class="text-left"></td>
                                            </template>
                                            <template v-if="data.tipe == 'transfer'" >
                                                <td valign="top" class="text-left" style="padding-left: 31px;">{{val.no_acc}} - {{val.nama_toko}} / {{val.no_invoice}} / {{dFormat(val.delivered_at,'d.m.Y')}} / {{val.nama_tim}}</td>
                                             </template>
                                            <template v-else-if="data.tipe == 'tunai'" >
                                                <td valign="top" class="text-left">{{dFormat(val.delivered_at,'d_M_Y')}} / {{val.no_invoice}} </td>
                                            </template>
                                            <template v-else-if="data.tipe == 'saldo_retur'" >
                                                <td valign="top" class="text-left">{{dFormat(val.delivered_at,'d_M_Y')}} / {{val.no_invoice}} </td>
                                            </template>
                                            <template v-else-if="data.tipe == 'bilyet_giro'" >
                                                <td valign="top" class="text-left">{{dFormat(val.delivered_at,'d_M_Y')}} / {{val.no_invoice}} / {{val.nama_toko}} / {{val.nama_tim}}</td>
                                                 <td valign="top" class="text-left">{{dFormat(val.tanggal,'d_M_Y')}}</td>
                                            </template>
                                            <td valign="top" class="text-left"></td>
                                            <td valign="top" class="text-right">{{ribuan(Math.round(val.nominal))}} </td>
                                        </tr>
                                    </template>
                                </template>
                                <tr class="detail">
                                    <td valign="top" class="text-left">Total</td>
                                    <td valign="top" v-if="data.tipe == 'bilyet_giro'" colspan="3" class="text-left"></td>
                                    <td valign="top" v-else colspan="2" class="text-left"></td>
                                    <td valign="top" class="text-right">{{ribuan(Math.round(footer.total_debet))}} </td>
                                    <td valign="top" class="text-right">{{ribuan(Math.round(footer.total_credit))}} </td>
                                </tr>
                                <tr class="detail">
                                    <td valign="top" v-if="data.tipe == 'bilyet_giro'" colspan="6" style="font-weight: bold;" class="text-left">Terbilang : {{data.terbilang}} </td>
                                    <td valign="top" v-else colspan="5" style="font-weight: bold;" class="text-left">Terbilang : {{data.terbilang}} </td>
                                </tr>

                            </table>
                        </div>
                    </div>
                     <div class="row" style="margin-top: 10px;">
                        <div class="col-12">
                            <table style="width: 100%; font-size: 16px" class="table-border">
                                <tr>
                                    <td style="width: 15%;text-align: center;" > Input Data</td>
                                    <td style="width: 25%;text-align: center;" > Disetujui</td>
                                    <td style="width: 35%;text-align: center;" colspan="2">Diperiksa</td>
                                    <td style="width: 25%;text-align: center;" > Dibuat</td>
                                </tr>
                                <tr>
                                    <td style="width: 15%;text-align: center; height: 70px;" ></td>
                                    <td style="width: 15%;text-align: center;" ></td>
                                    <td style="width: 15%;text-align: center;" ></td>
                                    <td style="width: 15%;text-align: center;" ></td>
                                    <td style="width: 15%;text-align: center;" ></td>
                                </tr>
                                <tr>
                                    <td style="width: 15%;text-align: center; height: 30px;" ></td>
                                    <td style="width: 15%;text-align: center;" ></td>
                                    <td style="width: 15%;text-align: center;" ></td>
                                    <td style="width: 15%;text-align: center;" ></td>
                                    <td style="width: 15%;text-align: center;" ></td>
                                </tr>
                                <tr>
                                    <td style="width: 15%;text-align: center;" > Operator</td>
                                    <td style="width: 15%;text-align: center;" > Pemimpin</td>
                                    <td style="width: 15%;text-align: center;" > Acct. Manager</td>
                                    <td style="width: 15%;text-align: center;" > Spv. Acct</td>
                                    <td style="width: 15%;text-align: center;" > Staff Admin</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div class="row" style="margin-top: 10px;">
                        <div class="col-12">

                        </div>
                    </div>
                </div>
            </section>
        </aside>

    </div>
</template>

<script>
import helper from "@/assets/js/helper.js"; // ppn = subtotal * 0.1 , GT = subtotal + ppn

    export default {
        name: 'printSemuaInvoice',
        mixins: [helper],

        data(){
            return {
                data: {},
                footer: {
                    total_debet: 0, total_credit: 0
                }
            }
        },

        methods: {
            getData(){
                let semuaInvoice = JSON.parse(localStorage.semuaInvoice)
                var formatted_date = new Date().toJSON().slice(0,10).replace(/-/g,'/');
                document.title = 'SEMUA INVOICE '+semuaInvoice.judul+' '+formatted_date+' - PRINT'
                this.data = semuaInvoice

                let data = this.data
                let  total_debet= 0, total_credit= 0
                for (let i = 0; i < data.items.length; i++)
                {
                    let item = data.items[i]
                    total_debet += +item.debet

                    const keys = Object.keys(item.detail_report)
                    for (let x = 0; x < keys.length; x++)
                    {
                        let itemDetail = item.detail_report[keys[x]]
                        total_credit += +itemDetail.nominal
                    }
                }
                this.footer.total_debet = total_debet;
                this.footer.total_credit = total_credit;

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
    .body {
        font-family: "Times New Roman", Helvetica, sans-serif;
    }
    .content-wrapper {
        display: block;
        background-color: #ecf0f5;
    }
    .content {
        min-height: 250px;
        padding: 15px;
        margin-right: 0px;
        margin-left: 0px;
        padding-left: 15px;
        padding-right: 15px;
    }
    .header table, th, td {
        border: 1px solid black;
        border-collapse: collapse;
    }
    .header td {
        padding: 10px;
    }

    .table-border {
        table-layout: fixed;
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

    .content.fontstyle {
        font-family: Times New Roman, Helvetica, sans-serif;
        font-weight: 400;
    }

    .smaller-text{
        font-size: 12px;
    }

    .no-bottom {
        border-bottom: none !important;
    }

    .no-top {
        border-top: none !important;
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
