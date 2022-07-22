<template>
  <div class="printable">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.css" />
    <link
      rel="stylesheet"
      href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
      integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
      crossorigin="anonymous"
    />

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
                          <b style="font-weight: bold">PT. KEMBAR PUTRA MAKMUR</b>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <span class="smaller-text">
                            JL. RAYA KAPAL, BR. TEGAL SAAT GG. ANGGREK I NO. 2
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <span class="smaller-text"> BADUNG - BALI </span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <span class="smaller-text">
                            TELP. 0361 - 9006481, 9006482
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <span class="smaller-text"> FAX. 0361 9006482 </span>
                        </td>
                      </tr>
                    </table>
                  </td>

                  <td valign="top" width="30%">
                    <table>
                      <tr>
                        <td>GUDANG</td>
                        <td>:</td>
                        <td v-html="data.nama_gudang"></td>
                      </tr>
                      <tr>
                        <td>TANGGAL</td>
                        <td>:</td>
                        <td v-html="data.tanggal"></td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </div>
          </div>

          <div style="margin-top:30px;" class="margin-print" v-for="item in this.data_print" v-bind:key="item.id">
            <div style="font-weight: bold; font-size:18px; text-align:center;">{{ item.nama_brand }}</div>
            <div class="row">
              <div class="col-12">
                <table style="width: 100%; font-size: 14px" class="table-border">
                  <thead>
                    <tr>
                      <th style="width: 10%;font-size:11px;">BARANG</th>
                      <th style="width: 5%;font-size:11px;">SLD. AWAL</th>
<!--                      <th style="width: 5%;font-size:11px;" v-if="data.type=='detail'">SALES PENDING</th>-->
<!--                      <th style="width: 5%;font-size:11px;" v-if="data.type=='detail'">MUT. PENDING</th>-->
                      <th style="width: 6%;font-size:11px;">PEMBELIAN</th>
                      <th style="width: 5%;font-size:11px;">MUT. MASUK</th>
                      <th style="width: 5%;font-size:11px;">ADJ</th>
                      <th style="width: 5%;font-size:11px;">MUT. KELUAR</th>
<!--                      <th style="width: 5%;font-size:11px;" v-if="data.type=='detail'">LOADED</th>-->
                      <th style="width: 5%;font-size:11px;">DELIVER</th>
                      <th style="width: 5%;font-size:11px;" v-if="data.type=='detail'">RETUR</th>
                      <th style="width: 5%;font-size:11px;" v-if="data.type=='detail'">ALL PENDING</th>
<!--                      <th style="width: 5%;font-size:11px;" v-if="data.type=='detail'">ALL LOADED</th>-->
                      <th style="width: 5%;font-size:11px;" v-if="data.type=='detail'">SALDO AKHIR</th>
                      <th style="width: 5%;font-size:11px;">SLD. FISIK</th>
                      <th style="width: 5%;font-size:11px;">HRG</th>
                      <th style="width: 5%;font-size:11px;">NIL. STOCK</th>
                    </tr>
                  </thead>
                  <tr v-for="(row, i) in item.detail" :key="i" class="detail">
                    <td>{{ row.kode_barang }} - {{ row.nama_barang }}</td>
                    <td style="text-align:right">{{ row.saldo_awal + " | " + row.saldo_awal_pcs }}</td>
<!--                    <td style="text-align:right" v-if="data.type=='detail'">{{ row.qty_sales_pending + " | " + row.qty_pcs_sales_pending }}</td>-->
<!--                    <td style="text-align:right" v-if="data.type=='detail'">{{ row.qty_mutasi_pending + " | " + row.qty_pcs_mutasi_pending }}</td>-->
                    <td style="text-align:right">{{ row.qty_penerimaan + " | " + row.qty_pcs_penerimaan }}</td>
                    <td style="text-align:right">{{ row.qty_mutasi_masuk + " | " + row.qty_pcs_mutasi_masuk }}</td>
                    <td style="text-align:right">{{ row.qty_adjustment + " | " + row.qty_pcs_adjustment }}</td>
                    <td style="text-align:right">{{ row.qty_mutasi_keluar + " | " + row.qty_pcs_mutasi_keluar }}</td>
<!--                    <td style="text-align:right" v-if="data.type=='detail'">{{ row.qty_loaded + " | " + row.qty_pcs_loaded }}</td>-->
                    <td style="text-align:right">{{ row.qty_deliver + " | " + row.qty_pcs_deliver }}</td>
                    <td style="text-align:right" v-if="data.type=='detail'">{{ row.qty_retur + " | " + row.qty_pcs_retur }}</td>
                    <td style="text-align:right" v-if="data.type=='detail'">{{ row.all_approved_dus + " | " + row.all_approved_pcs }}</td>
<!--                    <td style="text-align:right" v-if="data.type=='detail'">{{ row.all_loaded_dus + " | " + row.all_loaded_pcs }}</td>-->
                    <td style="text-align:right" v-if="data.type=='detail'">{{ row.stock_akhir + " | " + row.stock_akhir_pcs }}</td>
                    <td style="text-align:right">{{ row.stock_fisik + " | " + row.stock_fisik_pcs }}</td>
                    <td style="text-align:right">{{ ribuan(parseFloat(row.harga).toFixed()) }}</td>
                    <td style="text-align:right">{{ ribuan(parseFloat(row.nilai).toFixed()) }}</td>
                  </tr>
                  <tr valign="top" class="footer">
                    <td style="text-align:center; border-top: 1px black solid">
                      TOTAL
                    </td>
                    <td style="text-align:right;">{{ item.saldo_awal }} | {{ item.saldo_awal_pcs }}</td>
<!--                    <td style="text-align:right;" v-if="data.type=='detail'">{{ item.qty_sales_pending }} | {{ item.qty_pcs_sales_pending }}</td>-->
<!--                    <td style="text-align:right;" v-if="data.type=='detail'">{{ item.qty_mutasi_pending }} | {{ item.qty_pcs_mutasi_pending }}</td>-->
                    <td style="text-align:right;">{{ item.qty_penerimaan }} | {{ item.qty_pcs_penerimaan }}</td>
                    <td style="text-align:right;">{{ item.qty_mutasi_masuk }} | {{ item.qty_pcs_mutasi_masuk }}</td>
                    <td style="text-align:right;">{{ item.qty_adjustment }} | {{ item.qty_pcs_adjustment }}</td>
                    <td style="text-align:right;">{{ item.qty_mutasi_keluar }} | {{ item.qty_pcs_mutasi_keluar }}</td>
<!--                    <td style="text-align:right;" v-if="data.type=='detail'">{{ item.qty_loaded }} | {{ item.qty_pcs_loaded }}</td>-->
                    <td style="text-align:right;">{{ item.qty_deliver }} | {{ item.qty_pcs_deliver }}</td>
                    <td style="text-align:right;" v-if="data.type=='detail'">{{ item.qty_retur }} | {{ item.qty_pcs_retur }}</td>
                    <td style="text-align:right;" v-if="data.type=='detail'">{{ item.all_approved_dus }} | {{ item.all_approved_pcs }}</td>
<!--                    <td style="text-align:right;" v-if="data.type=='detail'">{{ item.all_loaded_dus }} | {{ item.all_loaded_pcs }}</td>-->
                    <td style="text-align:right;" v-if="data.type=='detail'">{{ item.stock_akhir }} | {{ item.stock_akhir_pcs }}</td>
                    <td style="text-align:right;">{{ item.stock_fisik }} | {{ item.stock_fisik_pcs }}</td>
                    <template v-if="item.nilai > 0">
                      <td colspan="2" style="text-align:right;">{{ ribuan(parseFloat(item.nilai).toFixed()) }}</td>
                    </template>
                    <template v-else>
                      <td colspan="2" style="text-align:right;">{{ item.nilai }}</td>
                    </template>
                  </tr>
                </table>
              </div>
            </div>
          </div>

          <br /><br />

          <div class="row">
            <div class="col-12">
              <table style="width: 100%; font-size: 14px" class="table-border">
                <tr style="text-align:right;">
                  <th rowspan="2" style="width: 8%;text-align:center;valign:middle;">GRAND TOTAL</th>
                  <th style="width: 6%;font-size:11px;">SALDO AWAL</th>
<!--                  <th style="width: 6%;font-size:11px;" v-if="data.type=='detail'">SALES PENDING</th>-->
<!--                  <th style="width: 6%;font-size:11px;" v-if="data.type=='detail'">MUTASI PENDING</th>-->
                  <th style="width: 6%;font-size:11px;">PEMBELIAN</th>
                  <th style="width: 6%;font-size:11px;">MUT. MASUK</th>
                  <th style="width: 6%;font-size:11px;">ADJ</th>
                  <th style="width: 6%;font-size:11px;">MUT. KELUAR</th>
<!--                  <th style="width: 6%;font-size:11px;" v-if="data.type=='detail'">LOADED</th>-->
                  <th style="width: 6%;font-size:11px;">DELIVER</th>
                  <th style="width: 6%;font-size:11px;" v-if="data.type=='detail'">RETUR</th>
                  <th style="width: 6%;font-size:11px;" v-if="data.type=='detail'">ALL PENDING</th>
<!--                  <th style="width: 6%;font-size:11px;" v-if="data.type=='detail'">ALL LOADED</th>-->
                  <th style="width: 6%;font-size:11px;" v-if="data.type=='detail'">SALDO AKHIR</th>
                  <th style="width: 6%;font-size:11px;">SALDO FISIK</th>
                  <th style="width: 8%;font-size:11px;">NILAI STOCK</th>
                </tr>
                <tr>
                  <td style="text-align:right;">{{ total[0] + " | " + total[1] }}</td>
<!--                  <td style="text-align:right;" v-if="data.type=='detail'">{{ total[2] + " | " + total[3] }}</td>-->
<!--                  <td style="text-align:right;" v-if="data.type=='detail'">{{ total[4] + " | " + total[5] }}</td>-->
                  <td style="text-align:right;">{{ total[6] + " | " + total[7] }}</td>
                  <td style="text-align:right;">{{ total[8] + " | " + total[9] }}</td>
                  <td style="text-align:right;">{{ total[10] + " | " + total[11] }}</td>
                  <td style="text-align:right;">{{ total[12] + " | " + total[13] }}</td>
<!--                  <td style="text-align:right;" v-if="data.type=='detail'">{{ total[14] + " | " + total[15] }}</td>-->
                  <td style="text-align:right;">{{ total[16] + " | " + total[16] }}</td>
                  <td style="text-align:right;" v-if="data.type=='detail'">{{ total[18] + " | " + total[19] }}</td>
                  <td style="text-align:right;" v-if="data.type=='detail'">{{ total[20] + " | " + total[21] }}</td>
<!--                  <td style="text-align:right;" v-if="data.type=='detail'">{{ total[22] + " | " + total[23] }}</td>-->
                  <td style="text-align:right;" v-if="data.type=='detail'">{{ total[24] + " | " + total[25] }}</td>
                  <td style="text-align:right;">{{ total[26] + " | " + total[27] }}</td>
                  <td style="text-align: right">
                    {{ ribuan(parseFloat(total[28]).toFixed()) }}
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
  name: "PrintPosisiStockGudang",
  mixins: [helper],

  data() {
    return {
      data: {
        nama_gudang: 'detail',
        tanggal: 'detail',
        items: [],
      },

      data_print: [],
      total: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0 ,0 ,0 ,0],
    };
  },

  methods: {
    formatNumber(num) {
      return parseInt(num).toLocaleString();
    },

    getData() {
      this.data = JSON.parse(localStorage.posisiStockGudang);
      document.title = "POSISI STOCK GUDANG " + this.data.tanggal + " - PRINT";

      this.axios
        .post("report/posisi_stock_gudang/print", this.data)
        .then((res) => {
          this.data_print = res.data.data;
          this.getTotal();
        })
        .catch((err) => {
          this.onError(err);
        });

      setTimeout(() => {
        window.print();
      }, 500);
    },

    getTotal() {
      this.total = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ,0 ,0 ,0];
      for (let i = 0; i < this.data_print.length; i++) {
        this.total[0] += parseInt(this.data_print[i].saldo_awal);
        this.total[1] += parseInt(this.data_print[i].saldo_awal_pcs);
        this.total[2] += parseInt(this.data_print[i].qty_sales_pending);
        this.total[3] += parseInt(this.data_print[i].qty_pcs_sales_pending);
        this.total[4] += parseInt(this.data_print[i].qty_mutasi_pending);
        this.total[5] += parseInt(this.data_print[i].qty_pcs_mutasi_pending);
        this.total[6] += parseInt(this.data_print[i].qty_penerimaan);
        this.total[7] += parseInt(this.data_print[i].qty_pcs_penerimaan);
        this.total[8] += parseInt(this.data_print[i].qty_mutasi_masuk);
        this.total[9] += parseInt(this.data_print[i].qty_pcs_mutasi_masuk);
        this.total[10] += parseInt(this.data_print[i].qty_adjustment);
        this.total[11] += parseInt(this.data_print[i].qty_pcs_adjustment);
        this.total[12] += parseInt(this.data_print[i].qty_mutasi_keluar);
        this.total[13] += parseInt(this.data_print[i].qty_pcs_mutasi_keluar);
        this.total[14] += parseInt(this.data_print[i].qty_loaded);
        this.total[15] += parseInt(this.data_print[i].qty_pcs_loaded);
        this.total[16] += parseInt(this.data_print[i].qty_deliver);
        this.total[17] += parseInt(this.data_print[i].qty_pcs_deliver);
        this.total[18] += parseInt(this.data_print[i].qty_retur);
        this.total[19] += parseInt(this.data_print[i].qty_pcs_retur);
        this.total[20] += parseInt(this.data_print[i].all_approved_dus);
        this.total[21] += parseInt(this.data_print[i].all_approved_pcs);
        this.total[22] += parseInt(this.data_print[i].all_loaded_dus);
        this.total[23] += parseInt(this.data_print[i].all_loaded_pcs);
        this.total[24] += parseInt(this.data_print[i].stock_akhir);
        this.total[25] += parseInt(this.data_print[i].stock_akhir_pcs);
        this.total[26] += parseInt(this.data_print[i].stock_fisik);
        this.total[27] += parseInt(this.data_print[i].stock_fisik_pcs);
        this.total[28] += parseFloat(this.data_print[i].nilai);
      }
    },
  },

  mounted() {
    // window.close()
    this.getData();
  },
};
</script>

<style lang="scss" scoped>
.body {
  font-family: "Times New Roman", Helvetica, sans-serif;
}
.row {
  display: block!important;
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
}

.table-border {
  table-layout: fixed;
}

.table-border tr td {
  padding: 3px;
  border: solid 1px black;
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
  font-size: 11px;
}

.no-bottom {
  border-bottom: none !important;
}

.no-top {
  border-top: none !important;
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
  .table-border {
    border: solid 1px black !important;
  }

  .margin-print {
    margin-top: 30px;
  }

  html, body {
    height: 100%;
    overflow-x: hidden;
    overflow-y: hidden;
  }

  .content {
    margin: 10px;
    padding: 0px;
  }

  @page {
    size: landscape;
  }
}
</style>
