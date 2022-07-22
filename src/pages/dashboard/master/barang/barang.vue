<template>
  <div class="antialiased">
    <Sidebar />
    <div class="page">
      <Header @change="_search" hint="Ketik nama barang" />

      <div class="content">
        <div class="container">
          <!-- Page title -->
          <div class="page-header">
            <div class="row d-flex justify-content-between">
              <div class="col-auto">
                <h2 class="page-title">
                  Daftar Barang
                </h2>
              </div>
              <div class="col-auto">
                <div class="row">
                  <div class="col-auto px-0">
                    <div class="input-icon">
                      <span class="input-icon-addon">
                        <i class="fe fe-align-left"></i>
                      </span>
                      <select
                        class="form-control"
                        v-model="paginate.peribuanage"
                        @change="_get"
                        :disabled="loading"
                      >
                        <option
                          :value="num"
                          v-for="(num, i) in [10, 50, 100, 9999]"
                          :key="i"
                          v-html="num == 9999 ? 'Semua' : num"
                        />
                      </select>
                    </div>
                  </div>

                  <div class="col-auto">
                    <button
                      class="btn btn-white mr-3"
                      v-html="ic('filter')"
                      @click="_filter"
                    ></button>
                    <button class="btn btn-primary mr-3" @click="_createExcel">
                      Export Excel
                    </button>
                    <button class="btn btn-primary" @click="_add">
                      Tambah
                    </button>
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
              <div class="table-responsive">
                <table
                  class="table table-vcenter table-hover card-table table-striped table-control"
                >
                  <thead>
                    <tr class="text-muted">
                      <th>No</th>
                      <th>Comp</th>
                      <th>Depo</th>
                      <th>Foto</th>
                      <th>Nama</th>
                      <th class="text-center">Berat (gram)</th>
                      <th>Isi/Karton</th>
                      <th>DBP</th>
                      <th>RBP</th>
                      <th>HCOBP</th>
                      <th>WBP</th>
                      <th>CBP</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, i) in data" :key="i">
                      <td>{{ paginate.fromPage + i }}</td>
                      <td>
                        <span class="badge bg-blue-lt mr-2">{{
                          row.kode_perusahaan
                        }}</span>
                      </td>
                      <td style="width:18%">
                        <span
                          v-for="(depo, l) in row.depo"
                          :key="l"
                          v-html="depo.nama_depo"
                          class="badge bg-blue-lt mr-2"
                        ></span>
                      </td>
                      <td class="preview-img pos-relative" style="width: 80px">
                        <span
                          class="extra bg-warning text-white"
                          v-if="row.status == 0"
                          >Non Aktif</span
                        >
                        <img
                          :src="
                            row.gambar == null
                              ? asset('no-image.png')
                              : image(row.gambar)
                          "
                        />
                      </td>
                      <td>{{ row.kode_barang }} ~ {{ row.nama_barang }}</td>
                      <td class="text-center">{{ row.berat }}</td>
                      <td>{{ row.isi }} {{ row.satuan }}</td>
                      <td>
                        {{ row.dbp == null ? "-" : ribuan(row.dbp.harga) }}
                        <hr />
                        {{
                          row.dbp == null
                            ? "-"
                            : ribuan(row.dbp.harga / row.isi + "|,2")
                        }}
                      </td>
                      <td>
                        {{ row.rbp == null ? "-" : ribuan(row.rbp.harga) }}
                        <hr />
                        {{
                          row.rbp == null
                            ? "-"
                            : ribuan(row.rbp.harga / row.isi + "|,2")
                        }}
                      </td>
                      <td>
                        {{ row.hcobp == null ? "-" : ribuan(row.hcobp.harga) }}
                        <hr />
                        {{
                          row.hcobp == null
                            ? "-"
                            : ribuan(row.hcobp.harga / row.isi + "|,2")
                        }}
                      </td>
                      <td>
                        {{ row.wbp == null ? "-" : ribuan(row.wbp.harga) }}
                        <hr />
                        {{
                          row.wbp == null
                            ? "-"
                            : ribuan(row.wbp.harga / row.isi + "|,2")
                        }}
                      </td>
                      <td>
                        {{ row.cbp == null ? "-" : ribuan(row.cbp.harga) }}
                        <hr />
                        {{
                          row.cbp == null
                            ? "-"
                            : ribuan(row.cbp.harga / row.isi + "|,2")
                        }}
                      </td>
                      <td class="p-0 pos-relative">
                        <div class="btn-group option center">
                          <button
                            class="btn btn-white btn-pill"
                            @click="_upload(row)"
                            v-html="ic('upload')"
                          ></button>
                          <button
                            class="btn btn-white btn-pill"
                            @click="_editHarga(row)"
                            v-html="ic('edit-3')"
                          ></button>
                          <button
                            class="btn btn-white btn-pill"
                            @click="_edit(row)"
                            v-html="ic('edit')"
                          ></button>
                          <button
                            class="btn btn-white btn-pill"
                            @click="_delete(row.id)"
                            v-html="ic('trash')"
                          ></button>
                        </div>
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
            :per-page="paginate.peribuanage"
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

    <FormBarang
      :config.sync="form.config"
      :initData="form.data"
      :dismiss.sync="form.dismiss"
      :isSubmit.sync="form.isSubmit"
      @submit="form.action"
    />

    <FormHarga
      :config.sync="harga.config"
      :initData="harga.data"
      :dismiss.sync="harga.dismiss"
      :isSubmit.sync="harga.isSubmit"
      @submit="harga.action"
    />

    <UploadImage
      :config.sync="upload.config"
      :initData="upload.data"
      :dismiss.sync="upload.dismiss"
      :isSubmit.sync="upload.isSubmit"
      @submit="upload.action"
    />

    <Confirm
      :id.sync="confirm.id"
      :title.sync="confirm.title"
      :isSubmit.sync="confirm.isSubmit"
      @submit="confirm.action"
    />
  </div>
</template>

<script>
import helper from "@/assets/js/helper.js";
import FormBarang from "./modals/form-barang.vue";
import FormHarga from "./modals/form-harga-barang.vue";
import UploadImage from "./modals/upload-image.vue";
import FormFilter from "./modals/filter";

export default {
  name: "Barang",
  components: { FormBarang, FormHarga, UploadImage, FormFilter },

  data() {
    return {
      auth: {},

      form: {
        config: { view: false, title: null },
        data: null,
        isSubmit: false,
        action: () => {},
      },

      harga: {
        config: { view: false, title: null },
        data: null,
        isSubmit: false,
        action: () => {},
      },

      upload: {
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
      },

      detail: {
        config: { view: false, title: null },
        data: null,
        isSubmit: false,
        action: () => {},
      },

      loading: true,
      data: [],

      paginate: {
        currentPage: 1,
        totalRows: 0,
        peribuanage: 10,
        fromPage: 0,
      },

      dataFilter: {
        keyword: "",
        perusahaan: "all",
        id_brand: "all",
        depo: "all",
      },

      filter: {
        config: { view: false, title: null },
        data: null,
        isSubmit: false,
        action: () => {},
      },
    };
  },

  mixins: [helper],

  methods: {
    _get(params) {
      this.loading = params == null ? true : !params.silent;

      let filter = {
        keyword: this.dataFilter.keyword,
        perusahaan: this.dataFilter.perusahaan,
        id_brand: this.dataFilter.id_brand,
        id_principal: this.dataFilter.id_principal,
        depo: this.dataFilter.depo,
        per_page: this.paginate.peribuanage,
        page: this.paginate.currentPage,
      };

      this.axios
        .get("barang", { params: filter })
        .then((res) => {
          this.loading = false;

          this.paginate.totalRows = res.data.meta.total;
          this.paginate.fromPage = res.data.meta.from;
          this.data = res.data.data;
        })
        .catch((err) => {
          this.loading = false;
          this.onError(err);
        });
    },

    _add() {
      this.form.config = { view: true, title: "Tambah Barang" };
      this.form.data = null;
      this.form.action = (formData) => {
        this.axios
          .post("barang", formData)
          .then((res) => {
            this.toast("Berhasil ditambahkan");
            this._get();

            this.form.config.view = false;
          })
          .catch((err) => {
            this.onError(err);
            this.form.isSubmit = false;
          });
      };
    },

    _edit(data) {
      this.form.config = { view: true, title: "Edit Barang" };
      this.form.data = data;
      this.form.action = (formData) => {
        this.axios
          .put("barang/" + data.id, formData)
          .then(() => {
            this.findObject(this.data, "id", data.id, (d, i) => {
              for (const key in formData) {
                this.data[i][key] = formData[key];
              }
            });

            this._get();

            this.toast("Berhasil diperbarui");
            this.form.config.view = false;
          })
          .catch((err) => {
            this.onError(err);
            this.form.isSubmit = false;
          });
      };
    },

    _editHarga(data) {
      this.harga.config = { view: true, title: "Edit Harga Barang" };
      this.harga.data = data;
      this.harga.action = (formData) => {
        this.axios
          .post("barang/update_harga/" + data.id, formData)
          .then(() => {
            this.toast("Berhasil diperbarui");
            this.harga.config.view = false;
            this._get({ silent: true });
          })
          .catch((err) => {
            this.onError(err);
            this.harga.isSubmit = false;
            this._get({ silent: true });
          });
      };
    },

    _filter() {
      this.filter.config = { view: true, title: "Filter" };
      this.filter.action = (formData) => {
        console.log(formData);
        for (const key in formData) {
          this.dataFilter[key] = formData[key];
        }
        this._get();
      };
    },

    _delete(id) {
      this.confirm.id = id;
      this.confirm.title = "Yakin ingin menghapus data barang ini?";
      this.confirm.action = () => {
        this.axios
          .delete("barang/" + id)
          .then(() => {
            this.toast("Berhasil dihapus");
            this._get({ silent: true });
            this.confirm.id = null;
          })
          .catch((err) => {
            this.onError(err);
            this.confirm.isSubmit = false;
          });
      };
    },

    _upload(data) {
      this.upload.config = { view: true, title: "Upload Gambar" };
      this.upload.data = data;
      this.upload.action = (formData) => {
        this.axios
          .post("barang/upload_pic/" + data.id, formData)
          .then(() => {
            this.toast("Berhasil diupload");
            this._get();

            this.upload.config.view = false;
          })
          .catch((err) => {
            this.onError(err);
            this.upload.isSubmit = false;
          });
      };
    },

    _pageChange(page) {
      this.paginate.currentPage = page;
      this._get();
    },

    _search(keyword) {
      this.dataFilter.keyword = keyword;
      this._get();
    },

    _createExcel() {
      let excel = [];

      for (let i = 0; i < this.data.length; i++) {
        let item = this.data[i],
          data = {};

        let tipeHarga = [
            "dbp",
            "rbp",
            "hcobp",
            "wbp",
            "cbp",
            "dbp+3",
            "mt",
            "gt",
            "harga 5",
            "harga 6",
          ],
          remove = [
            "gambar",
            "updated_at",
            "updated_by",
            "id_segmen",
            "depo",
            "perusahaan",
            "test",
          ];

        for (const key in item) {
          if (remove.indexOf(key) > -1) {
            delete item[key];
          }
        }

        for (const key in item) {
          if (tipeHarga.indexOf(key) > -1) {
            data[key] = item[key].harga;
          } else {
            data[key] = item[key];
          }
        }
        excel.push(data);
      }

      this.createExcel({ data: excel, filename: "data-barang" });
    },
  },

  mounted() {
    this.auth = JSON.parse(localStorage.user);
    this._get();
  },
};
</script>

<style lang="scss" scoped src="./barang.scss" />
