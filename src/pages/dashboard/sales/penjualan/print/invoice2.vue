<template>
  <div>

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.css">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
          integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">

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
                        <td style="font-size: 18px">
                          <b style="font-weight: bold;text-transform: uppercase">{{ data.nama_perusahaan }}</b>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2">
                          <span class="smaller-text" style="text-transform: uppercase">
                              <!-- JL. RAYA KAPAL, BR. TEGAL SAAT GG. ANGGREK I NO. 2 -->
                              {{
                              data.alamat_depo == null ? 'MOHON MENGISI ALAMAT DEPO "' + data.nama_depo + '"' : data.alamat_depo
                            }}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <span class="smaller-text">
                              <!-- BADUNG - BALI -->
                              {{
                              data.kabupaten_depo == null ? 'MOHON MENGISI KABUPATEN DEPO "' + data.nama_depo + '"' : data.kabupaten_depo + ' - BALI'
                            }}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <span class="smaller-text">
                              {{
                              data.telp_depo == null ? 'MOHON MENGISI NOMOR TELP DEPO "' + data.nama_depo + '"' : 'TELP. ' + data.telp_depo
                            }}
                            <!-- TELP. 0361 - 9006481, 9006482 -->
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <span class="smaller-text">
                              {{
                              data.fax_depo == null ? 'MOHON MENGISI FAX DEPO "' + data.nama_depo + '"' : 'FAX. ' + data.fax_depo
                            }}
                            <!-- FAX. 0361 9006482 -->
                          </span>
                        </td>
                      </tr>
                      <tr v-if="data.npwp !== ''">
                        <td v-html="`N.P.W.P.: ${formatNpwp(data.npwp)}`"></td>
                      </tr>
                    </table>
                  </td>
                  <td valign="top" width="50%" style="font-size: 16px">
                    <table>
                      <tr>
                        <td>KPD YTH</td>
                        <td>:</td>
                        <td v-html="data.nama_toko">INDOMARET DC</td>
                      </tr>
                      <tr>
                        <td></td>
                        <td></td>
                        <td v-html="data.alamat_toko">JL. RAYA DENPASAR BEDUGUL NO 17</td>
                      </tr>
                      <tr>
                        <td>ACCOUNT</td>
                        <td>:</td>
                        <td v-html="data.no_acc">10207760 | 102510300709</td>
                      </tr>
                      <tr>
                        <td>PO</td>
                        <td>:</td>
                        <td v-html="(data.po_manual == null || data.po_manual == '' ? data.id : data.po_manual)+' ('+dFormat(data.tanggal, 'dMY')+')'">
                          11052299 (22 JULY 2020)
                        </td>
                      </tr>
                      <tr>
                        <td>SALESMAN</td>
                        <td>:</td>
                        <td v-html="data.nama_tim+' - '+data.nama_salesman">SK - I NENGAH KUSUMA ARTHA</td>
                      </tr>
                      <tr>
                        <td>GUDANG</td>
                        <td>:</td>
                        <td v-html="data.gudang">GUDANG HCOC</td>
                      </tr>
                    </table>
                  </td>
                  <td valign="top" width="15%">
                    <table style="width: 100%; text-align: right">
                      <tr>
                        <td style="font-size: 20px;">
                          <strong style="font-weight: bold">INVOICE</strong>
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 18px;">
                          <strong v-html="data.invoice" style="font-weight: bold">00007.220720.1</strong>
                        </td>
                      </tr>
                      <tr style="height: 20px">
                        <td>
                          {{data.hari.toUpperCase()}} {{data.minggu}} 
                        </td>
                      </tr>
                      <tr>
                          <td v-html="data.tgl_cetak">
                              22 JULY 2020, 10:31
                          </td>
                      </tr>
                      <tr>
                          <td  style="height: 20px;"></td>
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
                  <th style="width: 10%">
                    KODE
                  </th>
                  <th style="width: 30%">
                    NAMA BARANG
                  </th>
                  <th style="width: 5%">
                    JML
                  </th>
                  <th style="width: 10%">
                    HARGA
                  </th>
                  <th style="width: 10%">
                    DISK
                  </th>
                  <th style="width: 10%">
                    SUBTOTAL
                  </th>
                </tr>
                </thead>

                <tr v-for="(row, i) in data.detail_penjualan" :key="i" class="detail">
                  <td class="text-center" v-html="i + 1">
                    1
                  </td>
                  <td class="text-left" style="word-wrap: break-word;width: 10%">
                    <b v-html="row.kode_barang">MTKBR 20</b>
                  </td>
                  <td class="text-left" v-html="row.nama_barang">
                    MIE TELUR KUNING 200 GR ISI 20 PCS + BUMBU RACIK
                  </td>
                  <td class="text-center">
                    <b v-html="row.qty+' / '+row.qty_pcs">5 / 10</b>
                  </td>
                  <td class="text-right" v-html="data.npwp !== '' ? ribuan(row.harga) : ribuan(row.harga_tax)">
                    63.531,82
                  </td>
                  <td class="text-right" v-html="data.npwp !== '' ? ribuan(row.discount) : ribuan(row.discount_tax)">
                    3.176,59
                  </td>
                  <td class="text-right" v-html="data.npwp !== '' ? ribuan(row.subtotal) : ribuan(row.subtotal_tax)">
                    317.659,09
                  </td>
                </tr>

                <!-- fix -->
                <tr valign="top" class="footer">
                  <td :rowspan="data.npwp === '' ? 3:5" colspan="3" style="border-top: 1px black solid">
                                      <span v-if="data.npwp === ''">
                                        Harga sudah termasuk PPn
                                      </span>
                    <br v-if="data.npwp === ''">
                    {{ data.terbilang }}
                    <br>
                    Catatan: {{ data.keterangan }}
                    <br>
                    Kritik & saran : {{data.no_koordinator}}
                  </td>
                  <td class="text-center no-bottom" style="border-top: 1px black solid">Total</td>
                  <td colspan="2" class="no-bottom" style="border-top: 1px black solid">
                    SUBTOTAL
                  </td>
                  <td
                      class="text-right no-bottom"
                      v-html="data.npwp !== '' ? ribuan(data.subtotal) : ribuan(data.subtotal_tax)"
                      style="border-top: 1px black solid">
                    825.913,64
                  </td>
                </tr>
                <tr colspan="2" class="footer">
                  <td class="text-center no-top no-bottom">
                    <b v-html="data.total_qty+' / '+data.total_pcs">13 / 0</b>
                  </td>
                  <td
                      colspan="2"
                      class="no-top no-bottom no-right">
                    DISKON
                  </td>
                  <td
                      class="text-right no-top no-bottom no-left"
                      v-html="data.npwp !== '' ? ribuan(data.diskon) : ribuan(data.diskon_tax)">
                    8.259,14
                  </td>
                </tr>
                <tr colspan="2" class="footer" v-if="data.npwp !== ''">
                  <td class="no-top no-bottom"></td>
                  <td colspan="2" class="no-top no-bottom">DPP</td>
                  <td
                      class="text-right no-top no-bottom"
                      v-html="ribuan((data.grand_total - data.ppn))">
                    817.654,50
                  </td>
                </tr>
                <tr v-if="data.npwp !== ''" colspan="2" class="footer">
                  <td class="no-top no-bottom"></td>
                  <td colspan="2" class="no-top no-bottom">PPn</td>
                  <td class="text-right no-top no-bottom" v-html="ribuan(data.ppn)">81.765,45</td>
                </tr>
                <tr colspan="2" class="footer">
                  <td class="no-top bottom"></td>
                  <td colspan="2" class="no-top bottom"><b>GRAND TOTAL</b></td>
                  <td class="text-right no-top bottom">
                    <b v-html="ribuan(data.grand_total)">899.419,95</b>
                  </td>
                </tr>
              </table>
            </div>
          </div>
          <div class="row" style="margin-top: 20px;">
            <div class="col-12">
              <table class="text-center" style="width: 100%">
                <tr valign="top" style="height: 50px">
                  <td width="20%">Bag. Invoice</td>
                  <td width="20%">Spv. Sales</td>
                  <td width="20%">Bag. Gudang</td>
                  <td width="20%">Pengirim</td>
                  <td width="20%">Penerima</td>
                </tr>
                <tr>
                  <td>
                    ( {{ data.username }} )
                  </td>
                  <td>
                    (<span style="padding-left: 70%">)</span>
                  </td>
                  <td>
                    (<span style="padding-left: 70%">)</span>
                  </td>
                  <td>
                    (<span style="padding-left: 70%">)</span>
                  </td>
                  <td>
                    (<span style="padding-left: 70%">)</span>
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

  data() {
    return {
      data: {
        subtotal: 0, diskon: 0, ppn: 0, grand_total: 0
      }
    }
  },

  methods: {
    getData() {
      let invoice = JSON.parse(localStorage.invoice), data = invoice.data
      document.title = 'INVOICE ' + data.id + ' - PRINT'
      this.data = data

      console.log(data)

      setTimeout(() => {
        // window.print()
      }, 500);


      // localStorage.removeItem('invoice');
    }
  },

  mounted() {
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

.table-border tr td {
  padding: 3px;
  // border: solid 1px black;
}

.table-border tr th {
  padding: 5px;
  border: solid 1px black;
}

.content.fontstyle {
  font-family: Times New Roman, Helvetica, sans-serif;
  font-weight: 400;
}

.smaller-text {
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

tr.footer {
  border: none;
  font-weight: bold;
}

tr.footer td {
  padding-bottom: 2px !important;
  padding-top: 2px !important;
}

@media print {
  @page {
    margin: 0px;
  }
  .table-border {
    border: solid 1px black !important;
  }

  .bottom {
    border-bottom: solid 1px black !important;
  }

  .content {
    margin: 0px;
    padding-top: 0px !important;
    padding-left: 0px !important;
    padding-right: 0px !important;
  }
}
</style>