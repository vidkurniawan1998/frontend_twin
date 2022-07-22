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
                                    <td valign="top" style="calc(100% / 3)">
                                        <table>
                                            <tr>
                                                <td style="font-size: 18px">
                                                    <b style="font-weight: bold;text-transform: uppercase">{{ header.nama_perusahaan }}</b>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <span class="smaller-text" style="text-transform: uppercase">
                                                        {{header.alamat_depo == null ? 'MOHON MENGISI ALAMAT DEPO "'+header.nama_depo+'"' : header.alamat_depo }}
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <span class="smaller-text">
                                                        {{ header.kabupaten_depo == null ? 'MOHON MENGISI KABUPATEN DEPO "'+header.nama_depo+'"' : header.kabupaten_depo+' - BALI' }}
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <span class="smaller-text">
                                                        {{ header.telp_depo == null ? 'MOHON MENGISI NOMOR TELP DEPO "'+header.nama_depo+'"' : 'TELP. '+header.telp_depo }}
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <span class="smaller-text">
                                                        {{ header.fax_depo == null ? 'MOHON MENGISI FAX DEPO "'+header.nama_depo+'"' : 'FAX. '+header.fax_depo }}
                                                    </span>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                    <td valign="top" style="calc(100% / 3)">
                                        <table>
                                            <tr>
                                                <td>CUSTOMER</td><td>:</td>
                                                <td v-html="header.nama_toko"></td>
                                            </tr>
                                            <tr>
                                                <td>ALAMAT</td><td>:</td>
                                                <td v-html="header.alamat_toko"></td>
                                            </tr>
                                            <tr v-if="header.npwp !== ''">
                                                <td>NPWP</td><td>:</td>
                                                <td v-html="formatNpwp(header.npwp)"></td>
                                            </tr>
                                            <tr>
                                                <td>ACCOUNT</td><td>:</td>
                                                <td v-html="header.no_acc_toko"></td>
                                            </tr>
                                            <tr>
                                                <td>KATEGORI</td><td>:</td>
                                                <td v-html="header.tipe_barang"></td>
                                            </tr>
                                        </table>
                                    </td>
                                    <td valign="top" style="calc(100% / 3)">
                                        <table style="width: 100%; text-align: right">
                                            <tr>
                                                <td>
                                                    <strong style="font-weight: bold; font-size: 20px;">RETUR PENJUALAN</strong> <br>
                                                    <span style="font-weight: bold; font-size: 20px;" v-html="header.id+''+(header.no_retur_manual == '' || header.no_retur_manual == null ? '' : ' ('+header.no_retur_manual+')')"></span> <br> <span v-html="dFormat(header.sales_retur_date,'dMY')"></span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="font-size: 16px;">
                                                    <!-- <strong v-html="data.invoice+''(data.no_retur_manual == '' || data.no_retur_manual == null ? '' : +'('+data.no_retur_manual+')')" style="font-weight: bold">00007.220720.1</strong> -->
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </div>

                        <div class="col-12" style="margin-top: 25px">
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td valign="top" width="100%">
                                        <table>
                                            <tr>
                                                <td>TIM</td><td>:</td>
                                                <td style="width: calc(100% / 5)" v-html="header.nama_tim"></td>

                                                <td>SALESMAN</td><td>:</td>
                                                <td style="width: calc(100% / 5)" v-html="header.nama_salesman"></td>

                                                <td>PIC</td><td>:</td>
                                                <td style="width: calc(100% / 5)" v-html="header.pic"></td>

                                                <td>GUDANG</td><td>:</td>
                                                <td style="width: calc(100% / 5);text-transform: uppercase" v-html="header.nama_gudang"></td>

                                                <td>KETERANGAN</td><td>:</td>
                                                <td style="width: calc(100% / 5)" v-html="header.keterangan"></td>
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
                                <!-- table header -->
                                <thead>
                                    <tr class="text-center">
                                        <th style="width: 3%">
                                            NO
                                        </th>
                                        <th style="width: 10%">
                                            KODE
                                        </th>
                                        <th style="width: 30%">
                                            NAMA BARANG
                                        </th>
                                        <th>KAT</th>
                                        <th>EXPIRED DATE</th>
                                        <th style="width: 5%">
                                            JML
                                        </th>
                                        <th>HARGA</th>
                                        <th>POT</th>
                                        <th style="width: 10%">
                                            SUBTOTAL
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(row, i) in details" :key="i" class="detail">
                                        <!-- NUMBER -->
                                        <td class="text-center" v-html="i + 1">
                                          1
                                        </td>

                                        <!-- KODE BARANG -->
                                        <td class="text-left">
                                          <b v-html="row.kode_barang">MTKBR 20</b>
                                        </td>

                                        <!-- NAMA BARANG -->
                                        <td class="text-left" style="text-transform: uppercase" v-html="row.nama_barang">
                                          MIE TELUR KUNING 200 GR ISI 20 PCS + BUMBU RACIK
                                        </td>

                                        <!-- KATEGORI -->
                                        <td v-html="header.status === 'waiting' && !is_expired_show ? '' : row.kategori_bs"></td>

                                        <!-- TANGGAL EXPIRED -->
                                        <td v-html="header.status === 'waiting' && !is_expired_show ? '' : dateFormat(row.expired_date)"></td>

                                        <!-- KUANTITI -->
                                        <td class="text-center">
                                          <b v-html="row.qty_dus+' / '+row.qty_pcs">5 / 10</b>
                                        </td>

                                        <!-- HARGA -->
                                        <td class="text-right" v-html="header.npwp !== '' ? ribuan(row.harga) : ribuan(row.harga_ppn)"></td>

                                        <!-- POTONGAN -->
                                        <td class="text-right" v-html="header.npwp !== '' ? ribuan(row.discount) : ribuan(row.discount_ppn)"></td>

                                        <!-- SUBTOTAL -->
                                        <td class="text-right" v-html="header.npwp !== '' ? ribuan(row.subtotal) : ribuan(row.subtotal_ppn)"></td>
                                    </tr>

                                    <!-- keterangan, total & subtotal -->
                                    <tr valign="top" class="footer">
                                      <td :rowspan="header.npwp == '' ? 3:5" class="bottom" colspan="5" style="border-top: 1px black solid">
                                        Catatan: {{header.keterangan}}
                                      </td>
                                      <td class="text-center no-bottom" style="border-top: 1px black solid">Total</td>
                                      <td colspan="2" class="no-bottom" style="border-top: 1px black solid">
                                        SUBTOTAL
                                      </td>
                                      <td class="text-right no-bottom" v-html="header.npwp != '' ? ribuan(header.subtotal) : ribuan(header.subtotal_ppn)" style="border-top: 1px black solid">
                                        825.913,64
                                      </td>
                                    </tr>

                                    <!-- qty & potongan -->
                                    <tr valign="top" class="footer">
                                      <td class="text-center no-top no-bottom">
                                        <b v-html="header.total_dus+' / '+header.total_pcs">13 / 0</b>
                                      </td>
                                      <td colspan="2" class="no-top no-bottom">POTONGAN</td>
                                      <td class="text-right no-top no-bottom" v-html="header.npwp != '' ? ribuan(header.discount) : ribuan(header.discount_ppn)">81.765,45</td>
                                    </tr>

                                    <tr colspan="2" class="footer" v-if="header.npwp !== ''">
                                      <td class="text-center no-top no-bottom"></td>
                                      <td colspan="2" class="no-top no-bottom">DPP RETUR</td>
                                      <td class="text-right no-top no-bottom" v-html="ribuan(header.dpp)">81.765,45</td>
                                    </tr>

                                    <tr colspan="2" class="footer" v-if="header.npwp !== ''">
                                      <td class="text-center no-top no-bottom"></td>
                                      <td colspan="2" class="no-top no-bottom">PPn</td>
                                      <td class="text-right no-top no-bottom" v-html="ribuan(header.ppn)">81.765,45</td>
                                    </tr>

                                    <tr colspan="2" class="footer">
                                      <td class="no-top bottom"></td>
                                      <td colspan="2" class="no-top bottom">
                                        <b>GRAND TOTAL</b>
                                      </td>
                                      <td class="text-right no-top bottom">
                                        <b v-html="ribuan(header.grand_total)">899.419,95</b>
                                      </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="row" style="margin-top: 20px; padding-top: 15px">
                        <div class="col-12">
                            <table class="text-center" style="width: 100%">
                                <tr valign="top" style="height: 50px">
                                    <td width="20%">DISERAHKAN</td>
                                    <td width="20%">SALESMAN</td>
                                    <td width="20%">SPV SALES</td>
                                    <td width="20%">DISETUJUI</td>
                                </tr>
                                <tr>
                                    <td v-for="(row,i) in 4" :key="i">
                                      <template v-if="i == 2 && header.verified_by">
                                        ( {{ header.nama_koordinator }} )
                                      </template>
                                      <template v-else>
                                        (<span style="padding-left: calc(100% / 4)">)</span>
                                      </template>
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
import {mapActions} from "vuex";

    export default {
        name: 'PrintReturPenjualan',
        mixins: [helper],

        data(){
            return {
                header: {},
                details: [],
                is_expired_show : false
            }
        },

        methods: {
            ...mapActions('reference', ['getReferenceByCode']),
            getData(){
                let retur = JSON.parse(localStorage.retur)
                document.title = 'RETUR PENJUALAN '+retur.header.id+' - PRINT'
                this.header   = retur.header
                this.details  = retur.details
                let code = 'expired_date_print_retur_penjualan'
                this.getReferenceByCode({code: code}).then(res => {
                  let value = res.data.value
                      value = value.split(',')
                  for (var i = 0; i < value.length; i++) {
                      let d = value[i]
                      if(this.header.id_depo == d){
                        this.is_expired_show = true
                      }
                  }
                })

                setTimeout(() => {
                    window.print()
                }, 500);

                localStorage.removeItem('retur');
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
        .bottom {
          border-bottom: solid 1px black !important;
        }
        .content {
          margin: 5px;
        }
    }
</style>
