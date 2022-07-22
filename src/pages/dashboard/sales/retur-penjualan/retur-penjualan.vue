<template>
  <div class="antialiased">
    <Sidebar />

    <div class="page">
      <Header @change="_search" hint="Cari" />

      <div class="content">
        <div class="container">
          <!-- Page title -->
          <div class="page-header">
            <div class="row d-flex justify-content-between">
              <div class="col-auto">
                <h2 class="page-title">Retur Penjualan</h2>
              </div>

              <!-- <div class="col-auto">
                <div class="text-muted text-h5 mt-2">Login Pada {{auth.logged_at}}</div>
              </div> -->
 
              <div class="col-auto">
                <div class="row">
                  <div class="col-auto px-0">
                    <div class="input-icon">
                      <span class="input-icon-addon">
                        <i class="fe fe-align-left"></i>
                      </span>
                      <select
                        class="form-control"
                        v-model="paginate.perPage"
                        @change="_get"
                        :disabled="loading"
                      >
                        <option
                          :value="num"
                          v-for="(num, i) in [10, 50, 100, 999]"
                          :key="i"
                          v-html="num == 999 ? 'Semua' : num"
                        />
                      </select>
                    </div>
                  </div>

                  <div class="col-auto">
                    <button
                      class="btn btn-white"
                      v-html="ic('filter')"
                      @click="_filter"
                    ></button>
                    <div class="btn-group ml-3">
                      <button
                        class="btn btn-outline-primary"
                        @click="_download"
                        v-html="loadingPDF ? spin() : 'Download PDF'"
                      ></button>
                      <button class="btn btn-primary" @click="_add">
                        Buat Retur
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Skeleton
            type="table"
            :length="10"
            class="mt-3 bg-white"
            v-if="loading"
          />

          <Nodata v-if="!loading && data.length == 0" />

          <div class="box" v-if="!loading && data.length > 0">
            <div class="card">
              <div class="table-respon sive">
                <table
                  class="table table-vcenter table-hover card-table table-striped"
                >
                  <thead>
                    <tr class="text-muted">
                      <th>Comp</th>
                      <th>No</th>
                      <th>Toko</th>
                      <th>Tim & Gudang</th>
                      <th>Tgl. Input</th>
                      <th>Tgl. Klaim</th>
                      <th>Kat. Retur</th>
                      <th>Grand Total</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, i) in data" :key="i">
                      <td>
                        <span class="badge bg-blue-lt mr-2"> {{ row.kode_perusahaan }} </span>
                      </td>
                      <td>
                        <span class="link-primary cursor-pointer" @click="_detail(row)">
                          {{ row.id }}
                        </span>
                      </td>
                      <td :class="{ 'text-primary': row.id_mitra != 0}">
                        {{ row.nama_toko }} <br/>
                        {{ row.no_acc }}
                      </td>
                      <td>
                        {{ row.nama_tim }} ({{ row.tipe_tim}})
                        <br>
                        {{ row.nama_gudang }}
                        <br>
                        <span v-if="row.verified_by" class="bg-info badge w-100">{{ row.nama_koordinator }} - {{ row.verified_at }}</span>
                      </td>
                      <td>{{ dateFormat(row.sales_retur_date) }}</td>
                      <td>
                        {{ row.claim_date == null ? "-" : dateFormat(row.claim_date) }}
                      </td>
                      <td>{{ row.tipe_barang }}</td>
                      <td>
                        <div style="float: right">
                          Rp {{ ribuan(Math.round(row.grand_total)) }}
                        </div>
                      </td>
                      <td>
                        <span
                          v-html="
                            row.status == 'waiting' ? 'menunggu' : row.claim_date == null ? 'disetujui':'claim'
                          "
                          class="badge w-100"
                          :class="
                            row.status == 'waiting' ? 'bg-orange' : row.claim_date == null ? 'bg-green':'bg-primary'
                          "
                        ></span>
                      </td>
                      <td class="p-0">
                        <b-dropdown dropleft variant="link" size="lg" no-caret>
                          <template slot="button-content">
                            <i class="fe fe-more-vertical"></i>
                          </template>
                          <b-dropdown-item @click.native="_detail(row)"
                            >Rincian</b-dropdown-item
                          >
                          <b-dropdown-item
                            @click="_claim(row)"
                            v-if="
                              row.status == 'approved' && row.claim_date == null
                            "
                            >Klaim</b-dropdown-item
                          >
                          <b-dropdown-item
                            @click="_fakturPembelian(row)">Faktur Pembelian</b-dropdown-item
                          >
                          <b-dropdown-item
                            @click="_printRetur(row)">Print Nota Retur</b-dropdown-item
                          >
                          <b-dropdown-item
                            @click="_cancelClaim(row)"
                            v-if="row.claim_date != null"
                            >Batalkan Klaim</b-dropdown-item
                          >
                          <b-dropdown-item
                            @click="_edit(row)"
                            v-if="row.status == 'waiting'"
                            >Edit</b-dropdown-item
                          >
                          <b-dropdown-item
                            @click="_delete(row.id)"
                            v-if="row.status == 'waiting'"
                            >Hapus</b-dropdown-item
                          >
                        </b-dropdown>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <b-pagination
            v-if="data.length > 0 && !loading"
            align="center"
            class="mt-5"
            :total-rows="paginate.totalRows"
            v-model="paginate.currentPage"
            :per-page="paginate.perPage"
            @change="_pageChange"
          />
        </div>
      </div>
    </div>

    <FormFilter
      :config.sync="filter.config"
      :initData="filter.data"
      :dismiss.sync="filter.dismiss"
      :isSubmit.sync="filter.isSubmit"
      @submit="filter.action"
    />

    <FormRetur
      :config.sync="form.config"
      :initData="form.data"
      :dismiss.sync="form.dismiss"
      :isSubmit.sync="form.isSubmit"
      @submit="form.action"
    />

    <Confirm
      :id.sync="confirm.id"
      :title.sync="confirm.title"
      :isSubmit.sync="confirm.isSubmit"
      @submit="confirm.action"
      :btnConfirm.sync="confirm.btnConfirm"
      :textConfirm.sync="confirm.textConfirm"
    />

    <FormFakturPembelian/>

    <DetailRetur @refresh="_get({silent: true})"/>
    <FormClaim/>
  </div>
</template>

<script>
import {mapState, mapActions, mapMutations} from "vuex";
import helper from "@/assets/js/helper.js";
import FormFilter from "./modals/filter.vue";
import FormRetur from "./modals/form-retur-penjualan.vue";
import DetailRetur from "./modals/detail-retur.vue";
import FormClaim from "./modals/form-claim.vue";
import FormFakturPembelian from "./modals/form-faktur-pembelian.vue";
import Confirm from "./modals/confirm";
import jsPDF from "jspdf";

export default {
  name: "ReturPenjualan",
  components: { FormFilter, FormRetur, DetailRetur, Confirm, FormClaim, FormFakturPembelian},

  data() {
    return {
      auth: {},

      filter: {
        config: { view: false, title: null },
        data: null,
        isSubmit: false,
        action: () => {},
      },

      invoice: {
        config: { view: false, title: null },
        data: null,
        isSubmit: false,
        action: () => {},
      },

      form: {
        config: { view: false, title: null },
        data: null,
        isSubmit: false,
        action: () => {},
      },

      confirm: {
        id: null,
        title: null,
        isSubmit: false,
        action: () => {},
        btnConfirm: "btn-danger",
        textConfirm: "Hapus Sekarang",
      },

      detail: {
        config: { view: false, title: null },
        data: null,
        isSubmit: false,
        action: () => {},
      },

      loading: true,
      loadingPDF: false,
      data: [],
      dataOri: [],
      dataPDF: [],

      paginate: {
        currentPage: 1,
        totalRows: 0,
        perPage: 10,
        fromPage: 0,
      },

      dataFilter: {
        id_perusahaan: '',
        id_salesman: "all",
        start_date: "2020-01-03", //this.dateTime('ymd'),
        end_date: this.dateTime("ymd"),
        claim_date: "",
        keyword: "",
        status: "all",
        depo:[],
        id_mitra: "exclude"
      },
    };
  },
  computed: {
    ...mapState("retur", {
      updated: (state) => state.updated,
      form_print : state => state.form_print
    }),
  },
  mixins: [helper],

  methods: {
    ...mapActions('retur', ['getRetur', 'getDetailRetur','triggerFormPrint']),
    ...mapActions('toko', ['getTokoById']),
    ...mapMutations('retur', ['SET_DETAIL_MODAL', 'ASSIGN_DATA_RETUR', 'ASSIGN_DATA_DETAIL_RETUR']),
    _get(params) {
      this.loading = params == null ? true : !params.silent;
      let formData = {
        id_perusahaan : this.dataFilter.id_perusahaan,
        id_salesman   : this.dataFilter.id_salesman,
        per_page      : this.paginate.perPage,
        page          : this.paginate.currentPage,
        start_date    : this.dataFilter.start_date,
        end_date      : this.dataFilter.end_date,
        claim_date    : this.dataFilter.claim_date,
        depo          : this.dataFilter.depo,
        status        : this.dataFilter.status,
        keyword       : this.dataFilter.keyword,
        id_mitra      : this.dataFilter.id_mitra,
        jenis_retur   : this.dataFilter.jenis_retur,
      };

      this.axios
        .get("retur_penjualan", { params: formData })
        .then((res) => {
          this.loading = false;
          this.paginate.totalRows = res.data.meta.total;
          this.data = this.dataOri = res.data.data;
        })
        .catch((err) => {
          this.loading = false;
          this.onError(err);
        });
    },

    _filter() {
      this.filter.config = { view: true, title: "Filter" };
      this.filter.action = (formData) => {
        for (const key in formData) {
          this.dataFilter[key] = formData[key];
        }

        this._get();
      };
    },

    _add(data) {
      this.form.config = { view: true, title: "Buat Retur Penjualan" };
      this.form.data = null;
      this.form.action = (formData) => {
        this.axios
          .post("retur_penjualan", formData)
          .then(() => {
            this._get({ silent: true });
            this.toast("Berhasil diperbarui");
            this.form.config.view = false;
          })
          .catch((err) => {
            this.onError(err);
            this.form.isSubmit = false;
          });
      };
    },

    _edit(data) {
      this.form.config = { view: true, title: "Edit Retur Penjualan" };
      this.form.data = data;
      this.form.action = (formData) => {
        this.axios
          .put("retur_penjualan/" + data.id, formData)
          .then(() => {
            this.findObject(this.data, "id", data.id, (d, i) => {
              let _data = formData;

              for (const key in _data) {
                this.data[i][key] = _data[key];
              }
            });

            this.toast("Berhasil diperbarui");
            this._get();
            this.form.config.view = false;
          })
          .catch((err) => {
            this.onError(err);
            this.form.isSubmit = false;
          });
      };
    },

    _delete(id) {
      this.$store.commit("retur/SET_CLAIM_ID", id);
      this.$store.commit("retur/SET_UPDATED", false);
      this.$store.commit("retur/SET_CONFIRM_MODAL", true);
      let confirmData = {
        title: "Yakin ingin menghapus retur ini?",
        subTitle: "Pembatalan ini bersifat permanen",
        btnConfirm: "btn-danger",
        textConfirm: "Hapus Sekarang",
        action: "removeRetur",
      };

      this.$store.commit("retur/SET_CONFIRM", confirmData);
    },

    _detail(data) {
      this.SET_DETAIL_MODAL(true)
      this.ASSIGN_DATA_RETUR({})
      this.ASSIGN_DATA_DETAIL_RETUR({})
      this.getRetur(data.id)
      this.getDetailRetur(data.id)
    },

    _pageChange(page) {
      this.paginate.currentPage = page;
      this._get();
    },

    _search(keyword) {
      this.dataFilter.keyword = keyword
      this._get()
    },

    _claim(data) {
      this.$store.commit("retur/SET_IS_FAKTUR_PAJAK", false);
      this.$store.commit("retur/SET_FAKTUR_PAJAK", '');
      
      this.getTokoById(data.id_toko).then( res => {
        let is_faktur_pajak = res.npwp && res.npwp!='' && res.npwp!=null ? true : false;
        this.$store.commit("retur/SET_IS_FAKTUR_PAJAK", is_faktur_pajak);
      });
      this.$store.commit("retur/SET_CLAIM_MODAL", true);
      this.$store.commit("retur/SET_CLAIM_ID", data.id);
      this.$store.commit("retur/SET_UPDATED", false);
    },

    _cancelClaim(data) {
      this.$store.commit("retur/SET_CLAIM_ID", data.id);
      this.$store.commit("retur/SET_UPDATED", false);
      this.$store.commit("retur/SET_CONFIRM_MODAL", true);
      let confirmData = {
        title: "Yakin ingin membatalkan klaim retur ini?",
        subTitle: "Pembatalan ini bersifat permanen",
        btnConfirm: "btn-danger",
        textConfirm: "Batalkan Sekarang",
        action: "cancelClaim",
      };

      this.$store.commit("retur/SET_CONFIRM", confirmData);
    },

    _download() {
      let formData = {
        id_perusahaan : this.dataFilter.id_perusahaan,
        id_salesman: this.dataFilter.id_salesman,
        per_page: "all",
        page: this.paginate.currentPage,
        start_date: this.dataFilter.start_date,
        end_date: this.dataFilter.end_date,
        claim_date: this.dataFilter.claim_date,
        depo:  this.dataFilter.depo,
        id_mitra: this.dataFilter.id_mitra,
        status: this.dataFilter.status,
        jenis_retur : this.dataFilter.jenis_retur,
      };

      this.loadingPDF = true;

      this.axios
        .get("retur_penjualan", { params: formData })
        .then((res) => {
          this.loadingPDF = false;
          this.dataPDF = res.data.data;
          this._createPDF();
        })
        .catch((err) => {
          this.loadingPDF = false;
          this.onError(err);
        });
    },

    _createPDF() {
      let doc = new jsPDF("p"),
        user = JSON.parse(localStorage.user);
      let styles = { fillColor: [255, 255, 255], cellPadding: 0, lineColor: 0 };
      doc.autoTable({
        theme: "plain",
        styles: { fillColor: [255, 255, 255], cellPadding: 0, lineColor: 0 },
        margin: { top: 10, left: 10, right: 10 },
        columnStyles: { 1: { halign: "center", fontSize: 15 } },

        head: [
          [
            {
              content: "Laporan Klaim Retur",
              styles: { halign: "center", fontSize: 15, fontStyle: "bold" },
            },
          ],
        ],
      });

      let periode = `${this.dFormat(
        this.dataFilter.start_date,
        "dMY"
      )} - ${this.dFormat(this.dataFilter.end_date, "dMY")}`;
      if (this.dataFilter.claim_date != "") {
        periode = `${this.dFormat(this.dataFilter.claim_date, "dMY")}`;
      }

      let tim =
        this.dataFilter.id_salesman == "" ? "all" : this.dataFilter.id_salesman;

      if (tim != "all" && this.dataPDF.length > 0) {
        let salesman = this.dataPDF[0]
        tim = `${salesman.nama_tim} - ${salesman.nama_salesman}`;
      }

      doc.autoTable({
        theme: "plain",
        styles: { fillColor: [255, 255, 255], cellPadding: 0, lineColor: 0 },
        margin: { top: 10, left: 10, right: 10 },
        // columnStyles: { 1: { halign: 'center', fontSize: 15 } },

        body: [
          [{ content: "Periode", styles: { cellWidth: 20 } }, ": " + periode],
          [{ content: "Tim", styles: { cellWidth: 20 } }, ": " + tim],
        ],
      });

      function _head(text, w = null, cs = 1) {
        return {
          content: text,
          colSpan: cs,
          styles: {
            fillColor: [255, 255, 255],
            cellPadding: 2,
            lineColor: 0,
            cellWidth: w,
            halign: "center",
            fontStyle: "bold",
          },
        };
      }

      let header = [
          _head("No"),
          _head("No. Retur"),
          _head("Tgl. Input"),
          _head("No Acc"),
          _head("Cust No"),
          _head("Nama"),
          _head("Tim"),
          _head("Total"),
        ],
        body = [];

      body.push(header);
      let i = 1;
      let grandTotal = 0;
      for (let dt of this.dataPDF) {
        let no_retur = dt.no_retur_manual ? dt.no_retur_manual : dt.id;
        body.push([
          i++,
          no_retur,
          dt.sales_retur_date,
          dt.no_acc_toko,
          dt.no_cust_toko,
          dt.nama_toko,
          dt.nama_tim,
          {
            content: this.ribuan(Math.round(dt.grand_total)),
            styles: { halign: "right", cellWidth: 25 },
          },
        ]);

        grandTotal += dt.grand_total;
      }

      body.push([
        { content: "", colSpan: 5 },
        { content: "GRAND TOTAL", colSpan: 2, styles: { halign: "right" } },
        {
          content: this.ribuan(Math.round(grandTotal)),
          styles: { halign: "right" },
        },
      ]);

      doc.autoTable({
        theme: "grid",
        styles: {
          fillColor: [255, 255, 255],
          cellPadding: 2,
          lineColor: 0,
          halign: "left",
        },
        margin: { top: 10, left: 10, right: 10 },
        // columnStyles: { 1: { halign: 'center', fontSize: 15 } },

        body: body,
      });
      this.pdfDownload([doc.output()]);
    },
    _fakturPembelian(data){
      this.form_print.id = data.id 
      this.form_print.tanggal_faktur_pajak_pembelian = data.tanggal_faktur_pajak_pembelian
      this.form_print.faktur_pajak_pembelian = data.faktur_pajak_pembelian
      this.triggerFormPrint()
    },
    _printRetur(data){
      this.axios.get("/retur_penjualan/get_print/"+data.id).then((res) => {
        let data = res.data.data
        if (localStorage.getItem("returPenjualan") === null) {
          localStorage.returPenjualan = JSON.stringify(data)
        }
        else{
          localStorage.removeItem('returPenjualan');
          localStorage.returPenjualan = JSON.stringify(data)
        }
        window.open(window.location.origin+'/dashboard/sales/retur-penjualan/print-baru', '_blank')
      }).catch((err) => {
        this.onError(err)
      })
    }
  },

  mounted() {
    this.auth = JSON.parse(localStorage.user);
    this._get();
  },
  watch: {
    updated() {
      if (this.updated === true) {
        this._get(true);
      }
    },
  },
};
</script>
