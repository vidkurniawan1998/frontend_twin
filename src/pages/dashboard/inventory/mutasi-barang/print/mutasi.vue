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
                                    <td valign="top" width="35%">
                                        <table>
                                            <tr>
                                                <td style="font-size: 18px;text-transform: uppercase">
                                                    <b style="font-weight: bold;">{{ data.nama_perusahaan }}</b>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <span class="smaller-text" style="text-transform: uppercase">
                                                        {{ data.alamat }}
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <span class="smaller-text">
                                                        {{ data.kabupaten }}
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <span class="smaller-text">
                                                        TELP. {{ data.telp }}
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <span class="smaller-text">
                                                        FAX. {{ data.fax }}
                                                    </span>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                    <td valign="top" width="30%">
                                        <table>
                                            <tr>
                                                <td>NO. MUTASI</td><td>:</td>
                                                <td v-html="data.id"></td>
                                            </tr>
                                            <tr>
                                                <td>DARI</td><td>:</td>
                                                <td v-html="data.dari"></td>
                                            </tr>
                                            <tr>
                                                <td></td><td></td>
                                                <td v-html="data.alamat_toko"></td>
                                            </tr>
                                            <tr>
                                                <td>KE</td><td>:</td>
                                                <td v-html="data.ke"></td>
                                            </tr>
                                            <tr>
                                                <td>TANGGAL</td><td>:</td>
                                                <td v-html="dFormat(data.tanggal,'dMY')"></td>
                                            </tr>
                                            <tr>
                                                <td>KETERANGAN</td><td>:</td>
                                                <td v-html="data.keterangan"></td>
                                            </tr>
                                        </table>
                                    </td>
                                    <td valign="top" width="35%">
                                        <table style="width: 100%; text-align: right">
                                            <tr>
                                                <td style="font-size: 20px;">
                                                    <strong style="font-weight: bold">MUTASI BARANG</strong>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="font-size: 16px;">
                                                    <strong v-html="data.invoice" style="font-weight: bold">00007.220720.1</strong>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td v-html="data.tgl_cetak">
                                                    22 JULY 2020, 10:31
                                                </td>
                                            </tr>
                                            <tr style="height: 20px">
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td style="font-size: 18px;">
                                                    <strong v-html="data.tipe_pembayaran">CREDIT</strong>
                                                </td>
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
                                        <th style="width: 10%">
                                            KETERANGAN
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
                                    <td v-html="row.nama_barang.toUpperCase()">
                                        MIE TELUR KUNING 200 GR ISI 20 PCS + BUMBU RACIK
                                    </td>
                                    <td class="text-center">
                                        <b v-html="row.qty+' / '+row.qty_pcs">5 / 10</b>
                                    </td>
                                    <td class="text-right" v-html="row.keterangan">
                                    </td>
                                </tr>

                                <!-- fix -->
                                <tr valign="top" class="footer">
                                    <td rowspan="5" colspan="3" style="border-top: 1px black solid">

                                    </td>
                                    <td class="text-center">
                                        Total <br> {{totalQty+' / '+totalPcs}}
                                    </td>
                                    <td></td>
                                </tr>
                                <!-- <tr colspan="2" class="footer">
                                    <td class="text-center no-top no-bottom"><b v-html="data.total_qty+' / '+data.total_pcs">13 / 0</b></td>
                                    <td colspan="2" class="no-top no-bottom">DISKON</td>
                                    <td class="text-right no-top no-bottom" v-html="ribuan(data.diskon+'|,2')">8.259,14</td>
                                </tr>
                                <tr colspan="2" class="footer">
                                    <td class="no-top no-bottom"></td>
                                    <td colspan="2" class="no-top no-bottom">DPP</td>
                                    <td class="text-right no-top no-bottom" v-html="ribuan((data.grand_total - data.ppn)+'|,2')">817.654,50</td>
                                </tr>
                                <tr colspan="2" class="footer">
                                    <td class="no-top no-bottom"></td>
                                    <td colspan="2" class="no-top no-bottom">PPn</td>
                                    <td class="text-right no-top no-bottom" v-html="ribuan(data.ppn+'|,2')">81.765,45</td>
                                </tr>
                                <tr colspan="2" class="footer">
                                    <td class="no-top"></td>
                                    <td colspan="2" class="no-top"><b>GRAND TOTAL</b></td>
                                    <td class="text-right no-top"><b v-html="ribuan(data.grand_total+'|,2')">899.419,95</b></td>
                                </tr> -->
                            </table>
                        </div>
                    </div>
                    <div class="row" style="margin-top: 20px; border-top: 1px black solid; padding-top: 15px">
                        <div class="col-12">
                            <table class="text-center" style="width: 100%">
                                <tr valign="top" style="height: 50px">
                                    <td width="20%">DIBUAT OLEH</td>
                                    <td width="20%" :colspan="data.is_ttd_principal ? 2 : 1 ">DISETUJUI OLEH</td>
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
                                        (OM/SPV)
                                    </td>
                                    <td v-if="data.is_ttd_principal">
                                        (Principal)
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
                                    <td>(Penerima)</td>
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
        name: 'PrintMutasi',
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
                let mutasi = JSON.parse(localStorage.mutasi)

                document.title = 'MUTASI '+mutasi.id+' - PRINT'
                this.data = mutasi

                let items = mutasi.items

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
    }
</style>
