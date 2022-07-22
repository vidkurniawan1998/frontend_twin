<template>
  <div class="antialiased">
    <Sidebar />
    <div class="page">
      <Header hint="Cari" :enabled="false" />

      <div class="content">
        <div class="container">
          <!-- Page title -->
          <div class="page-header">
            <div class="row d-flex justify-content-between">
              <div class="col-auto">
                <h2 class="page-title">
                  Laporan Mutasi Barang
                </h2>
              </div>

              <div class="col-auto">
                <div class="row">
                  <div class="col-auto px-0">
                  </div>

                  <div class="col-auto">
                    <button class="btn btn-white" v-html="ic('filter') + ' Filter'" @click="_filter"></button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Skeleton type="table" :length="10" class="mt-3 bg-white" v-if="loading" />

          <Nodata v-if="!loading && data.length == 0 && isFilter" />
          <div class="alert alert-info" v-if="!isFilter && !loading"><i class="fe fe-info mr-2"></i> Pilih filter untuk memuat data Mutasi Barang</div>

          <div class="text-center my-6" v-if="!loading && data.length > 0">
            <img :src="asset('doc.png')" alt="" style="width: 200px; opacity: .5" />
            <h3 class="my-3" v-html="data.length + ' Data'"></h3>

            <div class="btn-group">
              <button class="btn btn-outline-primary" @click="_createPdf">Export PDF</button>
              <button
                class="btn btn-primary"
                @click="_createExcel"
                :disabled="isExcelRequest"
                v-html="isExcelRequest ? spin() : ic('download') + ' Export Excel'"
              ></button>
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
  name: "LaporanMutasiBarang",
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

      loading: true,
      isFilter: false,
      data: [],
      file: '',

      dataFilter: {
        dari: "all",
        ke: "all",
        start_date: this.dateTime("ymd"),
        end_date: this.dateTime("ymd"),
        status: "all",
      },

      isExcelRequest: false,
    };
  },

  mixins: [helper],

  methods: {
    _get() {
      this.loading = true;

      this.axios
        .get("report/mutasi_barang", { params: this.dataFilter })
        .then((res) => {
          this.loading = false;

          this.data = [];

          if (res.data.length != 0) {
            this.data = res.data.data;
            this.file = res.data.file;
          }
        })
        .catch((err) => {
          this.loading = false;
          this.onError(err);
        });
    },

    _filter() {
      this.filter.config = { view: true, title: "Filter" };
      this.filter.action = (formData) => {
        this.isFilter = true;

        for (const key in formData) {
          this.dataFilter[key] = formData[key];
        }

        this._get();
      };
    },

    _createPdf() {
      let doc = new jsPDF("p"),
        user = JSON.parse(localStorage.user);
      let styles = { fillColor: [255, 255, 255], cellPadding: 0, lineColor: 0 };

      // title
      doc.autoTable(this.pdfHeader(""));

      let header = [["No. Mutasi", "Gudang Asal", "Gudang Tujuan", "Kode", "Nama Barang", "Dus/Pcs"]],
        temp = [];

      let total = 0,
        total_pcs = 0;
      for (let i = 0; i < this.data.length; i++) {
        let data = this.data[i];
        temp.push(data.id);
        temp.push(data.dari);
        temp.push(data.ke);
        temp.push(data.kode_barang);
        temp.push(data.nama_barang);
        temp.push(data.qty + "/" + data.qty_pcs);

        header.push(temp);
        temp = [];

        total += parseInt(data.qty);
        total_pcs += parseInt(data.qty_pcs);
      }

      temp.push("");
      temp.push("");
      temp.push("");
      temp.push("");
      temp.push("TOTAL");
      temp.push(total + "/" + total_pcs);
      header.push(temp);

      styles["cellPadding"] = 2;

      doc.autoTable({
        // body
        theme: "grid",
        styles: styles,
        margin: { top: 10, left: 10, right: 10 },
        body: header,
      });

      this.pdfDownload([doc.output()]);
    },

    _createExcel() {
      window.open(this.file, '_blank')
    },
  },

  mounted() {
    this.auth = JSON.parse(localStorage.user);
    this._get();
  },
};
</script>
