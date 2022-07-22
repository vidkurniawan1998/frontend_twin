<template>
  <div>
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
                        <td>NO. STOCK OPNAME</td>
                        <td>:</td>
                        <td v-html="data.id"></td>
                      </tr>
                      <tr>
                        <td>GUDANG</td>
                        <td>:</td>
                        <td v-html="data.nama_gudang"></td>
                      </tr>
                      <tr>
                        <td>TANGGAL</td>
                        <td>:</td>
                        <td v-html="dTime('dMY')"></td>
                      </tr>
                      <tr>
                        <td>KETERANGAN</td>
                        <td>:</td>
                        <td v-html="data.keterangan"></td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </div>
          </div>

          <div class="row" style="margin-top: 10px">
            <div class="col-12">
              <table style="width: 100%; font-size: 16px" class="table-border">
                <thead>
                  <tr class="text-center">
                    <th style="width: 5%">NO</th>
                    <th style="width: 10%">KODE BARANG</th>
                    <th style="width: 30%">NAMA BARANG</th>
                    <th style="width: 10%">QTY</th>
                    <th style="width: 10%">QTY FISIK</th>
                    <th style="width: 10%" v-if="data.is_approved == 1">
                      SELISIH
                    </th>
                    <th style="width: 10%" v-if="data.is_approved == 1">
                      HARGA
                    </th>
                    <th style="width: 15%" v-if="data.is_approved == 1">
                      VALUE
                    </th>
                  </tr>
                </thead>
                <tr v-for="(row, i) in data_print" :key="i" class="detail">
                  <td class="text-center" v-html="i + 1"></td>
                  <td>{{ row.kode_barang }}</td>
                  <td>{{ row.nama_barang }}</td>
                  <td class="text-center">{{ row.qty }} / {{ row.qty_pcs }}</td>
                  <td class="text-center" v-if="data.is_approved == 0"></td>
                  <td class="text-center" v-if="data.is_approved == 1">{{ row.qty_fisik }} / {{ row.qty_pcs_fisik }}</td>
                  <td class="text-center" v-if="data.is_approved == 1">{{ row.selisih_ctn }} / {{ row.selisih_pcs }}</td>
                  <td style="text-align: right" v-if="data.is_approved == 1">
                    {{ ribuan(row.harga) }}
                  </td>
                  <td style="text-align: right" v-if="data.is_approved == 1">
                    {{ formatNumber(row.selisih_value) }}
                  </td>
                </tr>

                <tr valign="top" class="footer">
                  <td class="text-center" rowspan="5" colspan="3" style="border-top: 1px black solid">
                    TOTAL
                  </td>
                  <td class="text-center">{{ total[0] }} / {{ total[1] }}</td>
                  <td class="text-center" v-if="data.is_approved == 0"></td>
                  <td class="text-center" v-if="data.is_approved == 1">{{ total[2] }} / {{ total[3] }}</td>
                  <td class="text-center" v-if="data.is_approved == 1">{{ total[4] }} / {{ total[5] }}</td>
                  <td colspan="2" style="text-align: right" v-if="data.is_approved == 1">
                    {{ formatNumber(total[6]) }}
                  </td>
                </tr>
              </table>
            </div>
          </div>

          <div
            class="row"
            style="
              margin-top: 20px;
              border-top: 1px black solid;
              padding-top: 15px;
            "
          >
            <div class="col-12">
              <table class="text-center" style="width: 100%">
                <tr valign="top" style="height: 50px">
                  <td width="40%">DIBUAT OLEH</td>
                  <td width="40%">DISETUJUI OLEH</td>
                </tr>
                <tr>
                  <td>( {{ data.created_by }} )</td>
                  <td>(KEPALA GUDANG)</td>
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
  name: "PrintStockOpname",
  mixins: [helper],

  data() {
    return {
      data: {
        id: null,
        nama_gudang: null,
        tanggal: null,
        keterangan: null,
        is_approved: null,
        items: [],
        created_by: null,
      },
      total: [0, 0, 0, 0, 0, 0, 0],
      data_print: [],
    };
  },

  methods: {
    formatNumber(num) {
      return parseInt(num).toLocaleString();
    },
    getData() {
      this.data = JSON.parse(localStorage.stockOpname);

      document.title = "STOCK OPNAME " + this.data.id + " - PRINT";
      this.total = [0, 0, 0, 0, 0, 0, 0];
      for (let i = 0; i < this.data.items.length; i++) {
        this.total[0] += parseInt(this.data.items[i].qty);
        this.total[1] += parseInt(this.data.items[i].qty_pcs);
        this.total[2] += parseInt(this.data.items[i].qty_fisik);
        this.total[3] += parseInt(this.data.items[i].qty_pcs_fisik);
        this.total[4] += parseInt(this.data.items[i].selisih_ctn);
        this.total[5] += parseInt(this.data.items[i].selisih_pcs);
        this.total[6] += parseFloat(this.data.items[i].selisih_value);

        if (!(this.data.items[i].qty == 0 && this.data.items[i].qty_pcs == 0 && this.data.items[i].qty_fisik == 0 && this.data.items[i].qty_pcs_fisik == 0)) {
          this.data_print.push(this.data.items[i]);
        }
      }

      setTimeout(() => {
        window.print();
      }, 500);
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
  font-size: 12px;
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
}
</style>
