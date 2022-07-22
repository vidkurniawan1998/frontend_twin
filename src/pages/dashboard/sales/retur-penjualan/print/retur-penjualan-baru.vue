<template>
    <div>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.css">
	    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">

        <aside class="content-wrapper">
            <section class="content fontstyle">
                <div style="font-size: 18px">
                    <div class="row" style="padding-bottom: 20px;">
                        <div class="col-12">
                            <table width="100%" cellpadding="0" cellspacing="0">
                               <tr>
                                   <td style="text-align: center; font-size: 20px; border: none;"><b>NOTA RETUR</b></td>
                               </tr>
                               <tr><td style="text-align: center; border: none;">Nomor : {{data.id}}</td></tr>
                               <tr>
                                    <td style="text-align: center; border: none;">
                                        Atas Faktur Pajak Nomor : {{data.faktur_pajak_pembelian}} , 
                                       Tanggal {{dFormat(data.tanggal_faktur_pajak_pembelian,'dMY')}}
                                    </td>
                               </tr>
                            </table>
                        </div>
                    </div>
                    <div style="border: solid; border-width: thin; border-bottom: none;">
                        <div class="row">
                            <div class="col-12">
                                <table width="100%">
                                    <tr>
                                        <td colspan="4" class="noBorder"  style="padding-left: 10px;">PEMBELI</td>
                                    </tr>
                                    <tr>
                                        <td width="80" class="noBorder"> </td>
                                        <td width="100" class="noBorder">Nama</td>
                                        <td width="80" class="noBorder"> : </td>
                                        <td class="noBorder">{{data.nama_pkp || ''}}</td>
                                    </tr>
                                    <tr>
                                        <td width="80" class="noBorder"> </td>
                                        <td width="100" class="noBorder">Alamat</td>
                                        <td width="80" class="noBorder"> : </td>
                                        <td class="noBorder">{{data.alamat_pkp || ''}}</td>
                                    </tr>
                                    <tr>
                                        <td width="80" class="noBorder"> </td>
                                        <td width="100" class="noBorder">NPWP</td>
                                        <td width="80" class="noBorder"> : </td>
                                        <td class="noBorder">{{formatNpwp(data.npwp)}}</td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                        <div class="row" style="padding-top: 20px; padding-bottom: 20px;">
                            <div class="col-12">
                                <table width="100%">
                                    <tr>
                                        <td colspan="4" class="noBorder"  style="padding-left: 10px;">KEPADA PENJUAL</td>
                                    </tr>
                                    <tr>
                                        <td width="80" class="noBorder"> </td>
                                        <td width="100" class="noBorder">Nama</td>
                                        <td width="80" class="noBorder"> : </td>
                                        <td class="noBorder">{{data.nama_pkp_perusahaan}}</td>
                                    </tr>
                                    <tr>
                                        <td width="80" class="noBorder"> </td>
                                        <td width="100" class="noBorder">Alamat</td>
                                        <td width="80" class="noBorder"> : </td>
                                        <td class="noBorder">{{data.alamat_pkp_perusahaan}}</td>
                                    </tr>
                                    <tr>
                                        <td width="80" class="noBorder"> </td>
                                        <td width="100" class="noBorder">NPWP</td>
                                        <td width="80" class="noBorder"> : </td>
                                        <td class="noBorder">{{data.npwp_perusahaan}}</td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12">
                            <table width="100%">
                                <tr style="text-align: center;">
                                    <td style="text-align: left; padding-left: 10px;">No Urut</td>
                                    <td>Nama Barang Kena Pajak Barang Mewah Yang Dikembalikan</td>
                                    <td>Kwantum</td>
                                    <td>Harga Satuan menurut Faktur Pajak (Rp)</td>
                                    <td>Harga Jual yg dikembalikan (Rp)</td>
                                </tr>
                                <tr v-for="(row, i) in data.detail_retur_penjualan" :key="i">
                                    <td style="padding-left: 10px;">{{i+1}} </td>
                                    <td style="vertical-align: top;">{{row.nama_barang}}</td>
                                    <td style="text-align: right; vertical-align: top;">{{row.qty_dus+'/'+row.qty_pcs}}</td>
                                    <td style="text-align: right; vertical-align: top;" >{{row.harga | currency}}</td>
                                    <td style="text-align: right; vertical-align: top; padding-right: 15px" >{{row.subtotal | currency}}</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div style="border: solid; border-width: thin; border-top: none; border-bottom: none;">
                        <div class="col-12" >
                            <table width="100%">
                                <tr>
                                    <td colspan="2" class="noBorder" style="height: 10px;"></td>
                                </tr>
                                <tr>
                                    <td class="noBorder">Jumlah Harga Barang Kena Pajak yang dikembalikan</td>
                                    <td class="noBorder" style="text-align: right;">{{data.subtotal | currency}}</td>
                                </tr>
                                <tr>
                                    <td class="noBorder">Dikurangi Potongan Harga</td>
                                    <td class="noBorder" style="text-align: right;">{{data.discount | currency}}</td>
                                </tr>
                                <tr>
                                    <td class="noBorder">Dasar Pengenaan Pajak</td>
                                    <td class="noBorder" style="text-align: right;">{{data.dpp | currency}}</td>
                                </tr>
                                <tr>
                                    <td class="noBorder">PPN yang diminta kembali</td>
                                    <td class="noBorder" style="text-align: right;">{{data.ppn | currency}}</td>
                                </tr>
                                <tr>
                                    <td colspan="2" class="noBorder" style="height: 10px;"></td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12">
                            <table width="100%">
                                <tr>
                                    <td style="width: 70%;  border-bottom: none; border-right: none;"></td>
                                    <td style="text-align: center;  none; border-bottom: none; border-left: none;">Denpasar, 
                                        {{ dFormat(data.tanggal, 'dMY') }}
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="2" height="100" style=" border-top: none; border-bottom: none;"></td>
                                </tr>
                                <tr>
                                    <td style="width: 70%;  border-top: none; border-right: none;"></td>
                                    <td style="text-align: center; padding-bottom: 20px;  border-top: none; border-left: none;">
                                    (<span style="padding-left: 100px; padding-right: 100px;"></span>)
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="2" style="padding-left: 20px;">Lembar ke <br>
                                        <span> 1 : Untuk Pengusaha Kena Pajak yang menerbitkan Faktur Pajak</span> <br>
                                        <span> 2 : Untuk Pembeli</span>
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
                console.log()
                let returPenjualan = JSON.parse(localStorage.returPenjualan)
                var formatted_date = new Date().toJSON().slice(0,10).replace(/-/g,'/');
                document.title = 'Nota Retur '+returPenjualan.kode_perusahaan+' '+returPenjualan.id+' '+formatted_date
                this.data = returPenjualan
                console.log(returPenjualan)
                setTimeout(() => {
                    window.print()
                }, 500);

            }
        },

        mounted(){
            //window.close()
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
        padding: 5px;
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

    .noBorder {
        padding: 0px;
        border : none;
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
