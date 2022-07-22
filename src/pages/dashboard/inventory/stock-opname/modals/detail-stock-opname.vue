<template>
  <div v-if="backdrop">
    <div
      class="modal fade"
      :class="modal.open ? 'show' : ''"
      style="display: block"
      tabindex="-1"
      role="dialog"
      aria-hidden="true"
      @click="$event.target.classList.contains('modal') ? close() : true"
    >
      <div class="modal-dialog modal-xl modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <div style="line-height: 17px" class="mb-4">
              <h3 class="mt-2">
                {{ config.title == null ? "&nbsp;" : config.title + " : " + data.nama_gudang }}
              </h3>
              <div>
                <span v-html="data.id"></span>
                <span
                  class="badge ml-2"
                  :class="data.is_approved == 0 ? 'bg-orange' : 'bg-green'"
                  v-html="data.is_approved == 0 ? 'Menunggu' : 'Disetujui'"
                ></span>
              </div>

              <button type="button" class="close" @click="close()" v-html="request ? spin() : ic('close')" />
            </div>
            <div>
              <div class="input-icon">
                <i class="search-clear fe"></i>
                <!-- <span class="input-icon-addon"> <i class="fe fe-search"></i> </span> -->
                <input
                  type="text"
                  style="width: 250px"
                  class="form-control form-control-rounded"
                  id="tsearch"
                  v-model="tsearch"
                  @keyup="_search($event.target.value)"
                  placeholder="Ketik nama barang"
                />
              </div>
            </div>

            <div class="btn-group float-left">
              <button class="btn btn-outline-primary" :disabled="request" v-html="ic('refresh')" @click="getDetail()" />
              <button class="btn btn-outline-primary" v-html="ic('printer') + ' Cetak'" @click="_print" />
            </div>
          </div>

          <form @submit.prevent="SaveDetail">
            <div class="modal-body">
              <div class="table-responsive" style="height: 600px; overflow-x: scroll">
                <table class="table table-v center table-hover card-table table-striped table-no-break">
                  <thead>
                    <th>Nama Barang</th>
                    <th>Qty</th>
                    <th>Qty Ctn Fisik</th>
                    <th>Qty Pcs Fisik</th>
                    <th>Selisih</th>
                    <th>Harga</th>
                    <th>Value</th>
                  </thead>
                  <tbody>
                    <tr v-for="row in filter" :key="row.id">
                      <td>{{ row.kode_barang + " - " + row.nama_barang }}</td>
                      <td>{{ row.qty }}/{{ row.qty_pcs }}</td>
                      <td>
                        <input
                          type="number"
                          class="form-control"
                          style="width: 80px"
                          min="0"
                          v-model="row.qty_fisik"
                          v-on:keydown.enter.prevent="tabE($event.target)"
                          :disabled="data.is_approved == 1"
                          @change="getSelisihCtn(row.id, $event.target.value)"
                          required
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          class="form-control"
                          style="width: 80px"
                          min="0"
                          v-model="row.qty_pcs_fisik"
                          v-on:keydown.enter.prevent="tabE($event.target)"
                          :disabled="data.is_approved == 1"
                          @change="getSelisihPcs(row.id, $event.target.value)"
                          required
                        />
                      </td>
                      <td>{{ row.selisih_ctn }}/{{ row.selisih_pcs }}</td>
                      <td>{{ ribuan(row.harga) }}</td>
                      <td>
                        <div
                          v-html="formatNumber(row.selisih_value)"
                          :class="row.selisih_value < 0 ? 'text-danger' : row.selisih_value > 0 ? 'text-success' : ''"
                        ></div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="modal-footer pt-2">
              <div class="px-4">
                <div class="row">
                  <div class="col-12">
                    <span class="badge-md strong mr-2"
                      >Total Qty
                      <span>{{ this.total[0] + "/" + this.total[1] }}</span>
                    </span>
                    <span class="badge-md strong mr-2"
                      >Total Fisik
                      <span>{{ this.total[2] + "/" + this.total[3] }}</span>
                    </span>
                    <span class="badge-md strong mr-2"
                      >QTY Selish
                      <span>{{ this.total[4] + "/" + this.total[5] }}</span>
                    </span>
                    <span class="badge-md strong mr-2"
                      >Selish Value
                      <span>{{ formatNumber(this.total[6]) }}</span>
                    </span>
                  </div>
                </div>

                <div class="row">
                  <div class="col-12">
                    <button type="submit" class="btn btn-primary pull-right" v-if="data.is_approved == 0">
                      Approve
                    </button>
                    <button type="button" class="btn btn-primary pull-right mr-2" v-if="data.is_approved == 0" @click="update()">Simpan</button>
                    <button type="button" class="btn btn-primary pull-right mr-2" v-if="data.is_approved == 1" @click="cancel()">Batal Disetujui</button>
                    <button type="button" class="btn btn-white pull-right mr-2" @click="close()" v-html="'Tutup'" />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div class="modal-backdrop fade" :class="modal.open ? 'show' : ''" />
  </div>
</template>

<script>
import helper from "@/assets/js/helper.js";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default {
  name: "Modal",
  props: {
    config: {
      default: {
        view: false,
        title: "Modal Title",
      },
    },
    initData: null,
    isSubmit: { default: false },
    dismiss: { default: true },
  },

  mixins: [helper],

  data() {
    return {
      backdrop: false,
      modal: {
        open: false,
        formNav: 0,
      },

      request: true,
      detail: [],
      filter: [],
      total: [0, 0, 0, 0, 0, 0, 0],
      tsearch: "",
      data: {
        id: null,
        is_approved: 0,
      },
      itemsFoot: [],
    };
  },

  methods: {
    close() {
      this.config.view = false;
    },

    getDetail() {
      this.request = true;

      this.axios
        .get("detail_stock_opname/" + this.data.id + "/detail")
        .then((res) => {
          this.detail = this.filter = res.data.data;
          this.getTotal();
          this.request = false;
        })
        .catch((err) => {
          this.onError(err);
          this.request = false;
        });
    },

    getTotal() {
      this.total = [0, 0, 0, 0, 0, 0, 0];
      for (let i = 0; i < this.detail.length; i++) {
        this.total[0] += parseInt(this.detail[i].qty);
        this.total[1] += parseInt(this.detail[i].qty_pcs);
        this.total[2] += parseInt(this.detail[i].qty_fisik);
        this.total[3] += parseInt(this.detail[i].qty_pcs_fisik);
        this.total[4] += parseInt(this.detail[i].selisih_ctn);
        this.total[5] += parseInt(this.detail[i].selisih_pcs);
        this.total[6] += parseFloat(this.detail[i].selisih_value);
      }
    },

    _search(keyword) {
      //alert(keyword);
      let k = keyword.toString().toLowerCase();
      this.filter = [];
      this.tsearch = k;

      for (let i = 0; i < this.detail.length; i++) {
        if (this.detail[i].kode_barang.toLowerCase().includes(k) || this.detail[i].nama_barang.toLowerCase().includes(k)) {
          this.filter.push(this.detail[i]);
        }
      }
    },

    getSelisihCtn(id, fisik) {
      for (let i = 0; i < this.detail.length; i++) {
        if (this.detail[i].id == id) {
          this.detail[i].selisih_ctn = fisik - this.detail[i].qty;
          this.detail[i].selisih_value = this.detail[i].harga * (this.detail[i].selisih_ctn + this.detail[i].selisih_pcs / this.detail[i].isi);
          i = this.detail.length;
        }
      }

      this.getTotal();
    },

    getSelisihPcs(id, fisik) {
      for (let i = 0; i < this.detail.length; i++) {
        if (this.detail[i].id == id) {
          this.detail[i].selisih_pcs = fisik - this.detail[i].qty_pcs;
          this.detail[i].selisih_value = this.detail[i].harga * (this.detail[i].selisih_ctn + this.detail[i].selisih_pcs / this.detail[i].isi);
          i = this.detail.length;
        }
      }
      this.getTotal();
    },

    SaveDetail() {
      this.axios
        .post("detail_stock_opname/" + this.data.id, this.detail)
        .then((res) => {
          this.toast("Berhasil disetujui");
          this.config.view = false;

          this.$emit("update:isSubmit", true);
          this.$emit("submit", this.detail);
          console.log(res.data.message);
        })
        .catch((err) => {
          this.onError(err);
        });
    },

    update() {
      this.axios
        .post("detail_stock_opname/update/detail", this.detail)
        .then((res) => {
          this.toast("Berhasil diupdate");
          this.config.view = false;

          this.$emit("update:isSubmit", true);
          this.$emit("submit", this.detail);
          console.log(res.data.message);
        })
        .catch((err) => {
          this.onError(err);
        });
    },

    cancel() {
      this.axios
        .get("stock_opname/" + this.data.id + "/cancel_approval")
        .then((res) => {
          this.toast("Berhasil dibatalkan");
          this.config.view = false;

          this.$emit("update:isSubmit", true);
          this.$emit("submit", this.detail);
          console.log(res.data.message);
        })
        .catch((err) => {
          this.onError(err);
        });
    },

    tabE(obj) {
      var e = typeof event != "undefined" ? window.event : e; // IE : Moz
      if (e.keyCode == 13) {
        var ele = document.forms[0].elements;
        for (var i = 0; i < ele.length; i++) {
          var q = i == ele.length - 1 ? 0 : i + 1; // if last element : if any other
          if (obj == ele[i]) {
            ele[q].focus();
            break;
          }
        }
        return false;
      }
    },

    _print() {
      let doc = new jsPDF("p"),
        user = JSON.parse(localStorage.user);
      let styles = { fillColor: [255, 255, 255], cellPadding: 0, lineColor: 0 };

      let data = {
        id: this.data.id,
        nama_gudang: this.data.nama_gudang,
        tanggal: this.data.tanggal_so,
        keterangan: this.data.keterangan,
        is_approved: this.data.is_approved,
        items: this.detail,
        created_by: user.name,
      };

      localStorage.stockOpname = JSON.stringify(data);
      window.open(window.location.origin + "/dashboard/inventory/stock-opname/print", "_blank");
    },

    formatNumber(num) {
      return parseInt(num).toLocaleString();
    },
  },

  watch: {
    "config.view": function(view) {
      if (view) {
        this.backdrop = true;
        setTimeout(() => {
          this.modal.open = view;
          this.getDetail();
        }, 100);
      } else {
        this.modal.open = view;

        setTimeout(() => {
          this.backdrop = view;
        }, 100);
      }
    },

    initData: function(data) {
      if (data == null) {
        Object.assign(this.$data.data, this.$options.data.call(this).data);
      } else {
        this.data.id = data.id;
        this.data.tanggal_so = data.tanggal_so;
        this.data.nama_gudang = data.nama_gudang;
        this.data.is_approved = data.is_approved;
        this.data.keterangan = data.keterangan;
      }
    },
  },
};
</script>
