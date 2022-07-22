<template>
  <div class="antialiased">
    <Sidebar />
    <div class="page">
      <Header @keyup="_search" hint="Ketik nama barang" />

      <div class="content">
        <div class="container">
          <div class="page-header">
            <div class="row d-flex justify-content-between">
              <div class="col-auto">
                <h2 class="page-title">Posisi Stock Gudang</h2>
                <small v-html="nama_gudang"></small>
              </div>

              <div class="col-auto">
                <div class="row">
                  <div class="col-auto">
                    <button class="btn btn-white" v-html="ic('filter') + ' Filter'" @click="_filter"></button>
                    <button class="btn btn-primary ml-3" :disabled="data.length == 0" v-html="ic('printer') + ' Cetak Detail'" @click="_print('detail')"></button>
                    <button class="btn btn-primary ml-3" :disabled="data.length == 0" v-html="ic('printer') + ' Cetak Summary'" @click="_print('summary')"></button>
                    <button class="btn btn-primary ml-3" :disabled="data.length == 0" v-html="ic('download') + ' Export Excel'" @click="_createExcel"></button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Skeleton type="table" :length="10" class="mt-3 bg-white" v-if="loading" />

          <Nodata v-if="!loading && data.length == 0 && isFilter" />
          <div class="alert alert-info" v-if="!isFilter && !loading && data.length == 0">
            <i class="fe fe-info mr-2"></i> Pilih filter untuk memuat data Posisi Stock
          </div>

          <div class="box" v-if="!loading && data.length > 0">
            <div class="card">
              <div class="table-responsive">
                <table class="table table-vcenter table-hover card-table table-striped table-no-break">
                  <thead>
                    <tr class="text-muted">
                      <th>No</th>
                      <th>Kode Barang</th>
                      <th>Nama Barang</th>
                      <th>Saldo Awal</th>
                      <th>Sales Pending</th>
                      <th>Mutasi Pending</th>
                      <th>Pembelian</th>
                      <th>Mutasi Masuk</th>
                      <th>Adjustment</th>
                      <th>Mutasi Keluar</th>
                      <th>Loaded</th>
                      <th>Deliver</th>
                      <th>Retur</th>
                      <th>All Pending</th>
                      <th>All Loaded</th>
                      <th>Saldo Akhir</th>
                      <th>Saldo Fisik</th>
                      <th>Harga</th>
                      <th>Nilai Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, i) in data" :key="i">
                      <td>{{ i + 1 }}</td>
                      <td>{{ row.kode_barang }}</td>
                      <td>{{ row.nama_barang }}</td>
                      <td>{{ ribuan(row.saldo_awal) }}/{{ ribuan(row.saldo_awal_pcs) }}</td>
                      <td>{{ row.qty_sales_pending }}/{{ row.qty_pcs_sales_pending }}</td>
                      <td>{{ row.qty_mutasi_pending }}/{{ row.qty_pcs_mutasi_pending }}</td>
                      <td>{{ row.qty_penerimaan }}/{{ row.qty_pcs_penerimaan }}</td>
                      <td>{{ row.qty_mutasi_masuk }}/{{ row.qty_pcs_mutasi_masuk }}</td>
                      <td>{{ row.qty_adjustment }}/{{ row.qty_pcs_adjustment }}</td>
                      <td>{{ row.qty_mutasi_keluar }}/{{ row.qty_pcs_mutasi_keluar }}</td>
                      <td>{{ row.qty_loaded }}/{{ row.qty_pcs_loaded }}</td>
                      <td>{{ row.qty_deliver }}/{{ row.qty_pcs_deliver }}</td>
                      <td>{{ row.qty_retur }}/{{ row.qty_pcs_retur }}</td>
                      <td>{{ row.all_approved_dus }}/{{ row.all_approved_pcs }}</td>
                      <td>{{ row.all_loaded_dus }}/{{ row.all_loaded_pcs }}</td>
                      <td>{{ row.stock_akhir + "/" + row.stock_akhir_pcs }}</td>
                      <td>{{ row.stock_fisik + "/" + row.stock_fisik_pcs }}</td>
                      <td>{{ ribuan(parseFloat(row.harga).toFixed()) }}</td>
                      <td>
                        {{ ribuan((row.harga * (row.stock_fisik + row.stock_fisik_pcs / row.isi)).toFixed()) }}
                      </td>
                    </tr>
                  </tbody>

                  <tfoot>
                    <tr>
                      <td colspan="3">Total</td>
                      <td>{{ total[0] + "/" + total[1] }}</td>
                      <td>{{ total[2] + "/" + total[3] }}</td>
                      <td>{{ total[4] + "/" + total[5] }}</td>
                      <td>{{ total[6] + "/" + total[7] }}</td>
                      <td>{{ total[8] + "/" + total[9] }}</td>
                      <td>{{ total[10] + "/" + total[11] }}</td>
                      <td>{{ total[12] + "/" + total[13] }}</td>
                      <td>{{ total[14] + "/" + total[15] }}</td>
                      <td>{{ total[16] + "/" + total[17] }}</td>
                      <td>{{ total[18] + "/" + total[19] }}</td>
                      <td>{{ total[20] + "/" + total[21] }}</td>
                      <td>{{ total[22] + "/" + total[23] }}</td>
                      <td>{{ total[24] + "/" + total[25] }}</td>
                      <td>{{ total[26] + "/" + total[27] }}</td>
                      <td colspan="2" style="text-align: right">
                        {{ ribuan(parseFloat(total[28]).toFixed()) }}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <FormFilter :config.sync="filter.config" :initData="filter.data" :dismiss.sync="filter.dismiss" :isSubmit.sync="filter.isSubmit" @submit="filter.action" />
  </div>
</template>

<script>
import helper from "@/assets/js/helper.js";
import FormFilter from "./modals/filter.vue";

import jsPDF from "jspdf";
import "jspdf-autotable";
export default {
  name: "LaporanPosisiStock",
  components: { FormFilter },

  data() {
    return {
      auth: {},

      filter: {
        config: { view: false, title: null },
        data: null,
        isSubmit: false,
        action: () => {},
      },

      loading: false,
      isFilter: false,
      data: [],
      dataOri: [],
      total: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],

      dataFilter: {
        id_gudang: null,
        start_date: this.dateTime("ymd"),
        end_date: this.dateTime("ymd"),
        id_principal: [],
        id_barang: [],
        id_brand: [],
      },

      nama_gudang: null,
      tanggal: null,
    };
  },

  mixins: [helper],

  methods: {
    _get() {
      this.loading = true;

      let url = "report/posisi_stock_gudang";
      let formData = {
        start_date: this.dataFilter.start_date,
        end_date: this.dataFilter.end_date,
        id_gudang: this.dataFilter.id_gudang,
        id_principal: this.dataFilter.id_principal,
        id_barang: this.dataFilter.id_barang,
        id_brand: this.dataFilter.id_brand
      }

      this.axios
        .get(url, {params: formData})
        .then((res) => {
          this.loading = false;
          let data = res.data.data;
          this.data = this.dataOri = data;
          this.getTotal();
        })
        .catch((err) => {
          this.loading = false;
          this.onError(err);
        });
    },

    getTotal() {
      this.total = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0 ,0 ,0 ,0];
      for (let i = 0; i < this.data.length; i++) {
        let nilai = this.data[i].harga * (this.data[i].stock_fisik + this.data[i].stock_fisik_pcs / this.data[i].isi);

        this.total[0] += parseInt(this.data[i].saldo_awal);
        this.total[1] += parseInt(this.data[i].saldo_awal_pcs);
        this.total[2] += parseInt(this.data[i].qty_sales_pending);
        this.total[3] += parseInt(this.data[i].qty_pcs_sales_pending);
        this.total[4] += parseInt(this.data[i].qty_mutasi_pending);
        this.total[5] += parseInt(this.data[i].qty_pcs_mutasi_pending);
        this.total[6] += parseInt(this.data[i].qty_penerimaan);
        this.total[7] += parseInt(this.data[i].qty_pcs_penerimaan);
        this.total[8] += parseInt(this.data[i].qty_mutasi_masuk);
        this.total[9] += parseInt(this.data[i].qty_pcs_mutasi_masuk);
        this.total[10] += parseInt(this.data[i].qty_adjustment);
        this.total[11] += parseInt(this.data[i].qty_pcs_adjustment);
        this.total[12] += parseInt(this.data[i].qty_mutasi_keluar);
        this.total[13] += parseInt(this.data[i].qty_pcs_mutasi_keluar);
        this.total[14] += parseInt(this.data[i].qty_loaded);
        this.total[15] += parseInt(this.data[i].qty_pcs_loaded);
        this.total[16] += parseInt(this.data[i].qty_deliver);
        this.total[17] += parseInt(this.data[i].qty_pcs_deliver);
        this.total[18] += parseInt(this.data[i].qty_retur);
        this.total[19] += parseInt(this.data[i].qty_pcs_retur);
        this.total[20] += parseInt(this.data[i].all_approved_dus);
        this.total[21] += parseInt(this.data[i].all_approved_pcs);
        this.total[22] += parseInt(this.data[i].all_loaded_dus);
        this.total[23] += parseInt(this.data[i].all_loaded_pcs);
        this.total[24] += parseInt(this.data[i].stock_akhir);
        this.total[25] += parseInt(this.data[i].stock_akhir_pcs);
        this.total[26] += parseInt(this.data[i].stock_fisik);
        this.total[27] += parseInt(this.data[i].stock_fisik_pcs);
        this.total[28] += parseFloat(nilai);
      }
    },

    _filter() {
      this.filter.config = { view: true, title: "Filter" };
      this.filter.action = (formData) => {
        for (const key in formData) {
          this.dataFilter[key] = formData[key];
        }

        this.nama_gudang = formData.nama_gudang;
        this.tanggal = formData.tanggal;
        this._get();
      };
    },

    _search(keyword) {
      let k = keyword.toString().toLowerCase();
      this.data = [];

      for (let i = 0; i < this.dataOri.length; i++) {
        if (this.dataOri[i].nama_barang.toLowerCase().includes(k) || this.dataOri[i].kode_barang.toLowerCase().includes(k)) {
          this.data.push(this.dataOri[i]);
        }
      }
    },

    _createExcel() {
      let dataExcel = [];
      for (let i = 0; i < this.data.length; i++) {
        let d = this.data[i];
        let nilai = d.harga * (d.stock_fisik + d.stock_fisik_pcs / d.isi);
        dataExcel.push({
          id_gudang: d.id_gudang,
          nama_gudang: d.nama_gudang,
          tanggal: d.tanggal,
          kode_barang: d.kode_barang,
          nama_barang: d.nama_barang,
          nama_segmen: d.nama_segmen,
          saldo_awal_qty: d.saldo_awal,
          saldo_awal_pcs: d.saldo_awal_pcs,
          qty_sales_pending: d.qty_sales_pending,
          qty_pcs_sales_pending: d.qty_pcs_sales_pending,
          qty_mutasi_pending: d.qty_mutasi_pending,
          qty_pcs_mutasi_pending: d.qty_pcs_mutasi_pending,
          qty_penerimaan: d.qty_penerimaan,
          qty_pcs_penerimaan: d.qty_pcs_penerimaan,
          qty_mutasi_masuk: d.qty_mutasi_masuk,
          qty_pcs_mutasi_masuk: d.qty_pcs_mutasi_masuk,
          qty_adjustment: d.qty_adjustment,
          qty_pcs_adjustment: d.qty_pcs_adjustment,
          qty_mutasi_keluar: d.qty_mutasi_keluar,
          qty_loaded: d.qty_loaded,
          qty_pcs_loaded: d.qty_pcs_loaded,
          qty_pcs_mutasi_keluar: d.qty_pcs_mutasi_keluar,
          qty_deliver: d.qty_deliver,
          qty_pcs_deliver: d.qty_pcs_deliver,
          qty_retur: d.qty_retur,
          qty_pcs_retur: d.qty_pcs_retur,
          all_pending: d.all_approved_dus,
          all_pending_pcs: d.all_approved_pcs,
          all_loaded_dus: d.all_loaded_dus,
          all_loaded_pcs: d.all_loaded_pcs,
          stock_akhir: d.stock_akhir,
          stock_akhir_pcs: d.stock_akhir_pcs,
          stock_fisik: d.stock_fisik,
          stock_fisik_pcs: d.stock_fisik_pcs,
          harga: d.harga,
          nilai: nilai,
          volume: d.isi
        });
      }
      this.createExcel({
        data: dataExcel,
        filename: "posisi-stock-gudang" + this.dataFilter.end_date,
      });
    },

    _print(type) {
      let user = JSON.parse(localStorage.user);

      let dataPrint = [];

      for (let i = 0; i < this.data.length; i++) {
        let d = this.data[i];
        let nilai = d.harga * (d.stock_fisik + d.stock_fisik_pcs / d.isi);
        dataPrint.push({
          id_gudang: d.id_gudang,
          nama_gudang: d.nama_gudang,
          tanggal: d.tanggal,
          kode_barang: d.kode_barang,
          nama_barang: d.nama_barang,
          nama_segmen: d.nama_segmen,
          id_brand: d.id_brand,
          saldo_awal: d.saldo_awal,
          saldo_awal_pcs: d.saldo_awal_pcs,
          qty_sales_pending: d.qty_sales_pending,
          qty_pcs_sales_pending: d.qty_pcs_sales_pending,
          qty_mutasi_pending: d.qty_mutasi_pending,
          qty_pcs_mutasi_pending: d.qty_pcs_mutasi_pending,
          qty_penerimaan: d.qty_penerimaan,
          qty_pcs_penerimaan: d.qty_pcs_penerimaan,
          qty_mutasi_masuk: d.qty_mutasi_masuk,
          qty_pcs_mutasi_masuk: d.qty_pcs_mutasi_masuk,
          qty_adjustment: d.qty_adjustment,
          qty_pcs_adjustment: d.qty_pcs_adjustment,
          qty_mutasi_keluar: d.qty_mutasi_keluar,
          qty_pcs_mutasi_keluar: d.qty_pcs_mutasi_keluar,
          qty_loaded: d.qty_loaded,
          qty_pcs_loaded: d.qty_pcs_loaded,
          qty_deliver: d.qty_deliver,
          qty_pcs_deliver: d.qty_pcs_deliver,
          qty_retur: d.qty_retur,
          qty_pcs_retur: d.qty_pcs_retur,
          all_approved_dus: d.all_approved_dus,
          all_approved_pcs: d.all_approved_pcs,
          all_loaded_dus: d.all_loaded_dus,
          all_loaded_pcs: d.all_loaded_pcs,
          stock_akhir: d.stock_akhir,
          stock_akhir_pcs: d.stock_akhir_pcs,
          stock_fisik: d.stock_fisik,
          stock_fisik_pcs: d.stock_fisik_pcs,
          harga: d.harga,
          nilai: nilai,
        });
      }

      let data = {
        nama_gudang: this.nama_gudang,
        type: type,
        tanggal: this.dataFilter.end_date,
        items: dataPrint,
        created_by: user.name,
      };

      localStorage.posisiStockGudang = JSON.stringify(data);
      //console.log(JSON.parse(localStorage.posisiStockGudang));
      window.open(window.location.origin + "/dashboard/inventory/posisi-stock-gudang/print", "_blank");
    },
  },

  mounted() {
    this.auth = JSON.parse(localStorage.user);
    //this._get();
  },
};
</script>
