<template>
  <div>

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.css">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">

    <aside class="content-wrapper">
      <section class="content fontstyle">
        <div style="font-size: 14px">
          <table class="jurnal">
            <tbody>
            <tr>
              <td style="width: 30%;font-size: 18px">
                <b style="font-weight: bold">
                  <span style="text-transform: uppercase">{{ data.perusahaan }}</span>
                  ({{ data.depo }})
                </b>
              </td>
              <td class="text-center" style="font-size: 18px">
                <b v-html="data.tipe_pembayaran == 'credit' ? 'BUKTI PENJUALAN' : 'BUKTI KAS MASUK PENJUALAN'"></b>
              </td>
              <td>
                <span v-html="data.tipe_pembayaran == 'credit' ? `BPJ: ${data.no_bpj}` : `BKM: ${data.no_bpj}`"></span>
              </td>
            </tr>
            <tr>
              <td colspan="2">
                Salesman: {{ data.salesman }}
              </td>
              <td>
                Tanggal: {{ data.tanggal }}
                <br>
                Lampiran: &nbsp; Lembar:
              </td>
            </tr>
            </tbody>
          </table>
          <table style="width: 100%; font-size: 16px" class="main">
            <thead>
            <tr>
              <td style="width: 5%" class="text-center">Tgl</td>
              <td style="width: 15%" class="text-center">Account</td>
              <td style="width: 50%" class="text-center" colspan="2">Customer</td>
              <td style="width: 15%" class="text-center">Debet</td>
              <td style="width: 15%" class="text-center">Kredit</td>
            </tr>
            <tr v-for="(dt, i) in data.data" :key="i">
              <td class="text-center">{{ dt.tanggal }}</td>
              <td>{{ dt.no_acc }}</td>
              <td>{{ dt.nama_toko }}
                <span v-if="dt.npwp !== null">
                          <br>{{ dt.npwp }}
                        </span>
              </td>
              <td>
                <div style="float: right;padding-right: 5px">
                  {{ dt.no_invoice }}
                </div>
              </td>
              <td>
                <div style="float: right;padding-right: 5px">
                  {{ dt.total | currency }}
                </div>
              </td>
              <td></td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td colspan="2">POTONGAN PENJUALAN TEAM: {{ data.salesman }}</td>
              <td>
                <div style="float: right;padding-right: 5px">
                  {{ data.potongan | currency }}
                </div>
              </td>
              <td></td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td colspan="2">PENJUALAN TEAM: {{ data.salesman }}</td>
              <td></td>
              <td>
                <div style="float: right;padding-right: 5px">
                  {{ data.dpp | currency }}
                </div>
              </td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td>PPn</td>
              <td></td>
              <td>
              </td>
              <td>
                <div style="float: right;padding-right: 5px">
                  {{ data.ppn | currency }}
                </div>
              </td>
            </tr>
            <tr>
              <td colspan="4">Total</td>
              <td>
                <div style="float: right;padding-right: 5px">
                  {{ data.debet | currency }}
                </div>
              </td>
              <td>
                <div style="float: right;padding-right: 5px">
                  {{ data.kredit | currency }}
                </div>
              </td>
            </tr>
            <tr>
              <td colspan="6">
                Terbilang: {{ data.terbilang }}
              </td>
            </tr>
            </thead>
          </table>
          <table class="table table-no-break jurnal">
            <tbody>
            <tr>
              <td class="text-center">Input Data</td>
              <td class="text-center">Disetujui</td>
              <td class="text-center" colspan="2">Diperiksa</td>
              <td class="text-center">Dibuat</td>
            </tr>
            <tr style="height: 100px">
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td class="text-center">Operator</td>
              <td class="text-center">Pimpinan</td>
              <td class="text-center">Acct. Manager</td>
              <td class="text-center">Spv. Acct</td>
              <td class="text-center">Staff Admin</td>
            </tr>
            </tbody>
          </table>
          <div class="row">
            <div class="col-12" style="font-size: 18px">
              <p>REKAP PENJUALAN</p>
              <p style="font-size: 14px;font-weight: bold">TOTAL {{ data.salesman }}: {{ data.value | currency }}</p>
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
      data: {}
    }
  },

  methods: {
    getData(){
      let jurnal = JSON.parse(localStorage.getItem('jurnal_penjualan')),
          data = jurnal;
      this.data = data;
      document.title = 'Jurnal Penjualan'

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
.detail td{
  padding-left: 10px;
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

.jurnal {
  width: 100%;
}

.jurnal tr td {
  border: 2px solid black;
  padding: 5px;
}

.main {
  margin-top: 15px;
  margin-bottom: 15px;
}

.main tr td {
  padding: 5px;
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
