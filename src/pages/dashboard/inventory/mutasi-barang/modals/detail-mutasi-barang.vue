<template>
  <div v-if="backdrop">
    <div
      class="modal fade"
      :class="modal.open ? 'show' : ''"
      style="display: block"
      tabindex="-1"
      role="dialog"
      aria-hidden="true"
      @click="dismiss ? ($event.target.classList.contains('modal') ? close() : true) : true"
    >
      <div class="modal-dialog modal-lg modal-dialog-centered " role="document">
        <div class="modal-content hidden-overflow">
          <div class="modal-body pt-3 pb-0">
            <div style="line-height: 17px" class="mb-4">
              <h3 class="m-0">{{ config.title == null ? "&nbsp;" : config.title }}</h3>
              <div>
                <span v-html="data.id"></span>
                <span v-html="data.status" :class="_span(data.status)"></span>
              </div>

              <button type="button" class="close" @click="close()" v-html="request ? spin() : ic('close')" />
            </div>

            <div class="card-tabs mb-0">
              <!-- Cards navigation -->

              <transition name="slide-fade-x">
                <div class="btn-group float-right" v-if="tabActive == 1">
                  <button class="btn btn-outline-primary" :disabled="request" v-html="ic('refresh')" @click="_getItems()" />
                  <button class="btn btn-outline-primary" v-if="data.is_approved == 1" v-html="ic('printer') + ' Cetak'" @click="_print" />
                  <button class="btn btn-outline-primary" v-if="data.is_approved == 0" :disabled="request" @click="_add" v-html="ic('plus')" />
                </div>
              </transition>

              <ul class="nav nav-tabs">
                <li class="nav-item" v-for="(tab, i) in ['Informasi Mutasi', 'Daftar Barang']" :key="i" @click="tabActive = i">
                  <span class="nav-link" :class="tabActive == i ? 'active' : ''" data-toggle="tab" v-html="tab"></span>
                </li>
              </ul>
              <div class="tab-content">
                <div class="card tab-pane" :class="tabActive == 0 ? ' active show' : ''">
                  <div class="card-body p-0">
                    <ul class="list-group list-stripped list-borderless" style="max-height: calc(100vh - 320px); overflow: auto">
                      <li class="list-group-item" v-for="(row, i) in info" :key="i">
                        <div>
                          <b>{{ row.label }}</b>
                        </div>
                        <span v-html="row.value"></span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div class="card tab-pane" :class="tabActive == 1 ? ' active show' : ''">
                  <div class="card-body p-0 table-responsive " style="min-height: 350px">
                    <Skeleton type="table" :length="5" class="mt-3 bg-white m-2" v-if="request" />
                    <Nodata v-if="!request && items.length == 0" />

                    <transition name="slide-up">
                      <div class="table-dpb" v-if="!request && items.length > 0">
                        <table class="table table-v center table-hover card-table table-striped table-no-break">
                          <thead>
                            <tr class="text-muted">
                              <th>No</th>
                              <th>Barang</th>
                              <th class="text-center">Qty</th>
                              <th class="text-center">Qty Pcs</th>
                              <th>Keterangan</th>
                              <th v-if="data.is_approved == 0"></th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(row, i) in items" :key="i">
                              <td>{{ i + 1 }}</td>
                              <td>{{ row.kode_barang }} - {{ row.nama_barang }}</td>
                              <td class="text-center">{{ row.qty }}</td>
                              <td class="text-center">{{ row.qty_pcs }}</td>
                              <td>{{ row.keterangan }}</td>
                              <td style="padding: 2px" v-if="data.is_approved == 0">
                                <div class="btn-group">
                                  <button class="btn btn-white btn-pill" @click="_edit(row)" v-html="ic('edit')"></button>
                                  <button class="btn btn-white btn-pill" @click="_delete(row.id)" v-html="ic('trash')"></button>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </transition>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="px-4 pt-3" v-if="tabActive == 1">
            <span class="badge-md strong mr-2" v-for="(row, i) in itemsFoot" :key="i"> {{ ucwords(row.label) }} <span v-html="row.value"></span> </span>
          </div>

          <div class="px-4 py-4 text-right">
            <button type="button" class="btn btn-white" @click="close()" v-html="'Tutup'" />
            <button
              type="button"
              class="btn btn-primary ml-3"
              :disabled="isApproved"
              @click="_confirm"
              v-html="isApproved ? spin() : data.is_approved == 0 ? 'Approve' : 'Batal Setujui'"
            />
          </div>

          <!-- form add & edit item -->

          <transition name="slide-fade-x">
            <div class="form-item" v-show="form.view">
              <div class="card-header">
                <h3 class="card-title" v-html="form.title" />
                <button type="button" class="close" @click="form.view = false" v-html="form.request ? spin() : ic('close')" />
              </div>

              <form @submit.prevent="form.action">
                <div class="card-body">
                  <div class="form-group">
                    <label for="" class="form-label">Nama Barang</label>
                    <selectize v-model="formData.id_stock" data-placeholder="Pilih barang" required :disabled="form.request">
                      <option :value="b.id" v-for="(b, i) in formItems" :key="i"> {{ b.kode_barang }} - {{ b.nama_barang }}</option>
                    </selectize>
                  </div>

                  <div class="row">
                    <div class="col-6">
                      <div class="form-group">
                        <label for="" class="form-label">Qty Dus</label>
                        <input
                          v-model="formData.qty"
                          type="tel"
                          required
                          @keypress="numberOnly($event)"
                          maxlength="11"
                          class="form-control"
                          placeholder="Qty dus"
                        />
                      </div>
                    </div>
                    <div class="col-6">
                      <div class="form-group">
                        <label for="" class="form-label">Qty Pcs</label>
                        <input
                          v-model="formData.qty_pcs"
                          type="tel"
                          required
                          @keypress="numberOnly($event)"
                          maxlength="11"
                          class="form-control"
                          placeholder="Qty pcs"
                        />
                      </div>
                    </div>
                  </div>

                  <div class="form-group">
                    <label for="" class="form-label">Keterangan</label>
                    <textarea v-model="formData.keterangan" class="form-control" placeholder="Keterangan"></textarea>
                  </div>
                </div>

                <div class="card-footer text-right">
                  <button type="button" class="btn btn-white" @click="form.view = false" v-html="'Tutup'"></button>
                  <button
                    type="submit"
                    class="btn btn-primary ml-3"
                    :disabled="form.isSubmit || form.request"
                    v-html="form.isSubmit ? spin() : 'Simpan'"
                  ></button>
                </div>
              </form>
            </div>
          </transition>
        </div>
      </div>
    </div>

    <div class="modal-backdrop fade" :class="modal.open ? 'show' : ''" />

    <Confirm :id.sync="confirm.id" :title.sync="confirm.title" :isSubmit.sync="confirm.isSubmit" @submit="confirm.action" />
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

      request: false,
      data: {},
      tabActive: 0,
      info: [],
      items: [],
      itemsHasLoaded: false,
      itemsFoot: [],

      // data detail stock
      filter: [],
      keyword: "",

      id_stock: null,
      hasChange: false,
      idCache: null,

      formData: {
        id_mutasi_barang: null,
        id_stock: null,
        qty: null,
        qty_pcs: null,
        keterangan: null,
      },

      form: {
        view: false,
        request: false,
        title: null,
        isSubmit: false,
        action: () => {},
      },

      formItems: [],
      confirm: {
        id: null,
        title: null,
        isSubmit: false,
        action: () => {},
      },

      isApproved: false,
    };
  },

  methods: {
    close() {
      this.$emit("update:config", { view: false });
    },

    _getItems() {
      this.request = true;
      this.axios
        .get("detail_mutasi_barang/" + this.data.id + "/detail")
        .then((res) => {
          this.items = res.data.data;
          this.request = false;
          this.itemsHasLoaded = true;
        })
        .catch((err) => {
          this.onError(err);
          this.request = false;
        });
    },

    _search(keyword) {
      let k = keyword.toString().toLowerCase(),
        data = this.data;

      this.filter = [];

      for (let i = 0; i < data.length; i++) {
        if (
          data[i].kode_barang
            .toString()
            .toLowerCase()
            .includes(k) ||
          data[i].nama_barang
            .toString()
            .toLowerCase()
            .includes(k)
        ) {
          this.filter.push(data[i]);
        }
      }
    },

    _loadBarang() {
      this.form.request = true;

      this.axios
        .get("mutasi_barang/" + this.data.dari[0].id + "/list_barang")
        .then((res) => {
          //console.log(res)
          this.formItems = res.data.data;
          this.form.request = false;
        })
        .catch((err) => {
          this.onError(err);
          this.form.request = false;
        });
    },

    _add() {
      // jika id mutasi berbeda dan datanya kosong -> load data, jika id mutasi sama jangan load toko jika datanya tidak kosong
      if (this.idCache != this.data.id || this.formItems.length == 0) {
        this._loadBarang();
        this.idCache = this.data.id;
      }

      // clear form
      Object.assign(this.$data.formData, this.$options.data.call(this).formData);
      this.formData.id_mutasi_barang = this.data.id;

      this.form.view = true;
      this.form.title = "Tambah Barang";
      this.form.action = () => {
        this.form.isSubmit = true;

        this.axios
          .post("detail_mutasi_barang", this.formData)
          .then((res) => {
            this.toast("Berhasil ditambahkan");
            this.items = res.data.data;
            this.form.view = this.form.isSubmit = false;
          })
          .catch((err) => {
            this.onError(err);
            this.form.isSubmit = false;
          });
      };
    },

    _edit(data) {
      if (this.idCache != this.data.id || this.formItems.length == 0) {
        this._loadBarang();
        this.idCache = this.data.id;
      }

      for (const key in this.formData) {
        this.formData[key] = data[key];
      }

      this.formData.id_mutasi_barang = this.data.id;

      this.form.view = true;
      this.form.title = "Edit Barang";
      this.form.action = () => {
        this.form.isSubmit = true;

        this.axios
          .put("detail_mutasi_barang/" + data.id, this.formData)
          .then((res) => {
            this.toast("Berhasil diperbarui");
            this.items = res.data.data;
            this.form.view = this.form.isSubmit = false;
          })
          .catch((err) => {
            this.onError(err);
            this.form.isSubmit = false;
          });
      };
    },

    _delete(id) {
      this.confirm.id = id;
      this.confirm.title = "Yakin ingin menghapus barang ini dari mutasi?";
      this.confirm.action = () => {
        this.axios
          .delete("detail_mutasi_barang/" + id)
          .then((res) => {
            this.items = res.data.data;
            this.toast("Berhasil dihapus");

            this.confirm.id = null;
          })
          .catch((err) => {
            this.onError(err);
            this.confirm.isSubmit = false;
          });
      };
    },

    _confirm() {
      if (this.items.length == 0) {
        this.toast("Barang tidak boleh kosong");
        this.tabActive = 1;
      } else {
        this.isApproved = true;

        this.axios
          .post("mutasi_barang/" + this.data.id + (this.data.is_approved == 0 ? "/approve" : "/cancel_approval"))
          .then(() => {
            this.toast(this.data.is_approved == 0 ? "Berhasil disetujui" : "Berhasil dibatalkan");
            this.data.status = this.data.is_approved == 0 ? "approved" : "waiting";
            this.data.is_approved = this.data.is_approved == 0 ? 1 : 0;

            this.isApproved = false;
          })
          .catch((err) => {
            this.onError(err);
            this.isApproved = false;
          });
      }
    },

    _print() {
      let doc = new jsPDF("p"),
        user = JSON.parse(localStorage.user);
      let styles = { fillColor: [255, 255, 255], cellPadding: 0, lineColor: 0 };

      let data = {
        id: this.data.id,
        dari: this.data.dari[0].nama_gudang,
        ke: this.data.ke[0].nama_gudang,
        nama_perusahaan: this.data.dari[0].nama_perusahaan,
        alamat: this.data.dari[0].alamat_depo,
        telp: this.data.dari[0].telp,
        fax: this.data.dari[0].fax,
        kabupaten: this.data.dari[0].kabupaten,
        tanggal: this.data.tanggal_mutasi,
        driver: "",
        keterangan: this.data.keterangan,
        items: this.items,
        created_by: user.name,
        is_ttd_principal : this.data.is_ttd_principal,
      };

      localStorage.mutasi = JSON.stringify(data);
      window.open(window.location.origin + "/dashboard/inventory/mutasi-barang/print", "_blank");
    },

    _span(status) {
      let className = "";

      switch (status) {
        case "waiting":
          className = "badge ml-2 bg-orange";
          break;
        case "approved":
          className = "badge ml-2 bg-green";
          break;
        case "on the way":
          className = "badge ml-2 bg-primary";
          break;
        default:
          className = "badge ml-2 bg-info";
          break;
      }

      return className;
    },
  },

  watch: {
    "config.view": function(view) {
      if (view) {
        this.$emit("update:isSubmit", false);

        this.backdrop = true;
        setTimeout(() => {
          this.modal.open = view;
        }, 100);
      } else {
        this.modal.open = view;

        setTimeout(() => {
          this.backdrop = view;
          this.itemsHasLoaded = false;
          this.tabActive = 0;
        }, 100);
      }
    },

    tabActive(t) {
      if (t == 1 && !this.itemsHasLoaded) {
        this._getItems();
      }
    },

    initData: function(data) {
      // console.log(data)
      this.data = data;
      this.info = [];

      let labels = ["No Mutasi Barang", "Tanggal Mutasi", "Dari Gudang", "Ke Gudang", "Keterangan"],
        keys = ["id", "tanggal_mutasi", "dari", "ke", "keterangan"];

      for (let i = 0; i < labels.length; i++) {
        this.info.push({ label: labels[i], value: keys[i] == "dari" || keys[i] == "ke" ? data[keys[i]][0].nama_gudang : data[keys[i]] });
      }
    },

    items(items) {
      this.itemsFoot = [];

      let labels = ["total dus", "total pcs"],
        arr = [0, 0];
      for (let i = 0; i < items.length; i++) {
        arr[0] += +items[i].qty;
        arr[1] += +items[i].qty_pcs;
      }

      for (let i = 0; i < labels.length; i++) {
        this.itemsFoot.push({ label: labels[i], value: this.ribuan(arr[i]) });
      }
    },
  },
};
</script>

<style lang="scss" src="../mutasi.scss" scoped />
