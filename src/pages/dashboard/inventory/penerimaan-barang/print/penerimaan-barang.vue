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
                                    <td valign="top" style="width: calc(100% / 3)">
                                        <table>
                                            <tr>
                                                <td style="font-size: 18px;text-transform: uppercase">
                                                    <b style="font-weight: bold">{{ data.perusahaan.nama_perusahaan }}</b>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <span class="smaller-text" style="text-transform: uppercase">
                                                        {{ data.depo.alamat }}
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <span class="smaller-text">
                                                        {{ data.depo.kabupaten }} - BALI
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <span class="smaller-text">
                                                        TELP. {{ data.depo.telp }}
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <span class="smaller-text">
                                                        FAX. {{ data.depo.fax }}
                                                    </span>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>

                                    <td valign="top" style="width: calc(100% / 3)">
                                        <table>
                                            <tr>
                                                <td>TERIMA DARI</td><td>:</td>
                                                <td v-html="data.terima_dari == null ? '' : data.terima_dari.toUpperCase()"></td>
                                            </tr>
                                            <tr>
                                                <td>NO. PENERIMAAN BARANG</td><td>:</td>
                                                <td v-html="data.no_pb"></td>
                                            </tr>
                                            <tr>
                                                <td>DIBONGKAR DI GUDANG</td><td>:</td>
                                                <td v-html="data.nama_gudang == null ? '' : data.nama_gudang.toUpperCase()"></td>
                                            </tr>
                                            <tr>
                                                <td>No. DO</td><td>:</td>
                                                <td v-html="data.no_do"></td>
                                            </tr>
                                            <tr>
                                                <td>No. SPB</td><td>:</td>
                                                <td v-html="data.no_spb"></td>
                                            </tr>
                                            <tr>
                                                <td>TGL. KIRIM</td><td>:</td>
                                                <td v-html="data.tgl_kirim"></td>
                                            </tr>
                                            <tr>
                                                <td>KETERANGAN</td><td>:</td>
                                                <td v-html="data.keterangan"></td>
                                            </tr>
                                        </table>
                                    </td>

                                    <td valign="top" style="width: calc(100% / 3)">
                                        <table style="width: 100%; text-align: right">
                                            <tr>
                                                <td style="font-size: 20px;" colspan="3">
                                                    <strong style="font-weight: bold">PENERIMAAN BARANG</strong>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>TGL DATANG</td><td>:</td>
                                                <td v-html="data.tgl_datang"></td>
                                            </tr>
                                            <tr>
                                                <td>TGL TERIMA / BONGKAR</td><td>:</td>
                                                <td v-html="data.tgl_bongkar"></td>
                                            </tr>
                                            <tr>
                                                <td>NO. POL. KENDARAAN</td><td>:</td>
                                                <td v-html="data.no_pol"></td>
                                            </tr>
                                            <tr>
                                                <td>DRIVER</td><td>:</td>
                                                <td v-html="data.driver"></td>
                                            </tr>
                                            <tr>
                                                <td>TRANSPORTER / EXPEDISI</td><td>:</td>
                                                <td v-html="data.transporter"></td>
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
                                    <tr class="text-center">
                                        <th style="width: 3%">
                                            NO
                                        </th>
                                        <th style="width: 7%">
                                            KODE
                                        </th>
                                        <th style="width: 30%">
                                            NAMA BARANG
                                        </th>
                                        <th style="width: 5%">
                                            JML
                                        </th>
                                        <th style="width: 15%" class="text-right" colspan="2">
                                            SUBTOTAL
                                        </th>
                                    </tr>
                                </thead>

                                <tr v-for="(row, i) in data.items" :key="i" class="detail">
                                    <td class="text-center" v-html="i + 1">
                                        1
                                    </td>
                                    <td class="text-left">
                                        <b v-html="row.kode_barang">MTKBR 20</b>
                                    </td>
                                    <td v-html="row.nama_barang || row.nama_barang.toUpperCase()">
                                        MIE TELUR KUNING 200 GR ISI 20 PCS + BUMBU RACIK
                                    </td>
                                    <td class="text-center">
                                        <b v-html="row.qty+' / '+row.qty_pcs">5 / 10</b>
                                    </td>
                                    <td class="text-right" colspan="2">
                                        <b v-html="ribuan(row.subtotal)"></b>
                                    </td>
                                </tr>

                                <tr valign="top" class="footer tr-border">
                                    <td rowspan="5" colspan="3"></td>
                                    <td class="text-center no-bottom">
                                        Total
                                    </td>
                                    <td class="text-left no-bottom">
                                        TOTAL
                                    </td>
                                    <td class="no-bottom text-right" v-html="ribuan(Math.round(data.subtotal))"></td>
                                </tr>

                                <tr class="footer" colspan="2">
                                    <td class="text-center no-top no-bottom"><b v-html="totalQty+' / '+totalPcs">13 / 0</b></td>
                                    <td class="no-top no-bottom">DISKON</td>
                                    <td class="text-right no-top no-bottom">0</td>
                                </tr>

                                <tr class="footer" colspan="2">
                                    <td class="text-center no-top no-bottom"></td>
                                    <td class="no-top no-bottom">PPn</td>
                                    <td class="text-right no-top no-bottom" v-html="ribuan(Math.round(data.ppn))">8.259,14</td>
                                </tr>

                                <tr class="footer" colspan="2">
                                    <td class="text-center no-top"></td>
                                    <td class="no-top">GRAND TOTAL</td>
                                    <td class="text-right no-top" v-html="ribuan(Math.round(+data.subtotal + +data.ppn))">8.259,14</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div class="row" style="margin-top: 20px; padding-top: 15px">
                        <div class="col-12">
                            <table class="text-center" style="width: 100%">
                                <tr valign="top" style="height: 50px">
                                    <td width="20%">DIBUAT OLEH</td>
                                    <td width="20%">DISETUJUI OLEH</td>
                                    <td width="20%">DIKETAHUI OLEH</td>
                                    <td width="20%" colspan="2">YANG MENYERAHKAN</td>
                                    <td width="20%">PENGIRIM</td>
                                    <td width="20%">PENERIMA</td>
                                </tr>
                                <tr>
                                    <td>
                                        ( {{data.created_by}} )
                                    </td>
                                    <td>
                                        (SMM/SPV)
                                    </td>
                                    <td>
                                        (ACCT)
                                    </td>
                                    <td>
                                        (KAP. GDG)
                                    </td>
                                    <td>
                                        (CHECKER)
                                    </td>
                                    <td>(Driver)</td>
                                    <td>(Tuan/Toko)</td>
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
        name: 'PrintPenerimaanBarang',
        mixins: [helper],

        data(){
            return {
                data: {
                    subtotal: 0, diskon: 0, ppn: 0, grand_total: 0
                },

                totalQty: 0, totalPcs: 0
            }
        },

        methods: {
            getData(){
                let penerimaan = JSON.parse(localStorage.penerimaan)

                document.title = 'PENERIMAAN BARANG '+penerimaan.no_pb+' - PRINT'
                this.data = penerimaan

                let items = penerimaan.items

                for (let i = 0; i < items.length; i++) {
                    let item = items[i]

                    this.totalQty += +item.qty
                    this.totalPcs += +item.qty_pcs
                }

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
    .content-wrapper {
        display: block;
        background-color: #ecf0f5;
    }
    .content {
        min-height: 250px;
        padding: 15px;
        margin-right: auto;
        margin-left: auto;
        padding-left: 15px;
        padding-right: 15px;
    }

    .table-border {
        table-layout: fixed;
    }

    .table-border tr td{
        padding: 3px;
        // border: solid 1px black;
    }

    .table-border tr th{
        padding: 5px;
        border: solid 1px black;
    }

    .tr-border{
        td{
            border-top: 1px black solid
        }
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
        border: none !important;
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
    }
</style>
