<template>
  <div class="antialiased">
    <Sidebar />

    <div class="page">
      <Header @change="_search" hint="Ketik no. mutasi" />

      <div class="content">
        <div class="container">
          <!-- Page title -->
          <div class="page-header">
            <div class="row d-flex justify-content-between">
              <div class="col-auto">
                <h2 class="page-title">
                  Mutasi Barang
                </h2>
              </div>

              <!-- <div class="col-auto">
                <div class="text-muted text-h5 mt-2">Login Pada {{auth.logged_at}}</div>
              </div> -->

              <div class="col-auto">
                <div class="row">
                  <div class="col-auto px-0">
                    <div class="input-icon">
                      <span class="input-icon-addon"> <i class="fe fe-align-left"></i> </span>
                      <select class="form-control" v-model="paginate.perPage" @change="_get" :disabled="loading">
                        <option :value="num" v-for="(num, i) in [10, 50, 100, 999]" :key="i" v-html="num == 999 ? 'Semua' : num" />
                      </select>
                    </div>
                  </div>

                  <div class="col-auto">
                    <button class="btn btn-white mr-3" v-html="ic('filter')" @click="_filter"></button>
                    <button class="btn btn-primary" @click="_add">Tambah</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Skeleton type="table" :length="10" class="mt-3 bg-white" v-if="loading" />

          <Nodata v-if="!loading && data.length == 0" />

          <div class="box" v-if="!loading && data.length > 0">
            <div class="card">
              <div class="table-respon sive">
                <table class="table table-vcenter table-hover card-table table-striped">
                  <thead>
                    <tr class="text-muted">
                      <th>No MB</th>
                      <th>Tanggal Mutasi</th>
                      <th>Dari</th>
                      <th>Ke</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, i) in data" :key="i" :id="'tr' + row.id">
                      <td class="click-able text-primary" @click="_detail(row)" v-html="row.id"></td>
                      <td>{{ dateFormat(row.tanggal_mutasi) }}</td>
                      <td>{{ row.dari[0] == null ? "-" : row.dari[0].nama_gudang }}</td>
                      <td>{{ row.ke[0] == null ? "-" : row.ke[0].nama_gudang }}</td>
                      <td><span v-html="row.status" :class="_span(row.status)"></span></td>
                      <td class="p-0">
                        <b-dropdown variant="link" size="lg" dropleft no-caret>
                          <template slot="button-content"> <i class="fe fe-more-vertical"></i> </template>

                          <b-dropdown-item @click="_detail(row)"> Rincian </b-dropdown-item>
                          <b-dropdown-item
                            @click="_markAsReceived(row.id)"
                            v-if="row.status == 'on the way' && (gudangs.find(({ id }) => id === row.ke[0].id) ? true : false)"
                            :disabled="mark.isSubmit"
                            >Tandai Sudah Diterima</b-dropdown-item
                          >
                          <b-dropdown-item @click="_markAsSent(row.id)" v-if="row.status == 'approved'">Tandai Sebagai Terkirim</b-dropdown-item>
                          <b-dropdown-item v-show="row.is_approved == 0" href="javascript:void(0)" @click="_edit(row)">Edit</b-dropdown-item>
                          <b-dropdown-item v-show="row.is_approved == 0" href="javascript:void(0)" @click="_delete(row.id)">Hapus</b-dropdown-item>
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

    <FormFilter :config.sync="filter.config" :initData="filter.data" :dismiss.sync="filter.dismiss" :isSubmit.sync="filter.isSubmit" @submit="filter.action" />

    <FormMutasiBarang :config.sync="form.config" :initData="form.data" :dismiss.sync="form.dismiss" :isSubmit.sync="form.isSubmit" @submit="form.action" />

    <Confirm :id.sync="confirm.id" :title.sync="confirm.title" :isSubmit.sync="confirm.isSubmit" @submit="confirm.action" />

    <DetailMutasiBarang
      :config.sync="detail.config"
      :initData="detail.data"
      :dismiss.sync="detail.dismiss"
      :isSubmit.sync="detail.isSubmit"
      @submit="detail.action"
    />

    <MarkSent :config.sync="mark.config" :initData="mark.data" :dismiss.sync="mark.dismiss" :isSubmit.sync="mark.isSubmit" @submit="mark.action" />
  </div>
</template>

<script>
import helper from "@/assets/js/helper.js";
import FormFilter from "./modals/filter.vue";
import FormMutasiBarang from "./modals/form-mutasi-barang.vue";
import DetailMutasiBarang from "./modals/detail-mutasi-barang.vue";
import MarkSent from "./modals/mark-sent.vue";

export default {
  name: "MutasiBarang",
  components: { FormFilter, FormMutasiBarang, DetailMutasiBarang, MarkSent },

  data() {
    return {
      auth: {},

      filter: {
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
      },

      detail: {
        config: { view: false, title: null },
        data: null,
        isSubmit: false,
        action: () => {},
      },

      mark: {
        config: { view: false, title: null },
        data: null,
        isSubmit: false,
        action: () => {},
      },

      loading: true,
      data: [],
      gudangs: [],

      paginate: {
        currentPage: 1,
        totalRows: 0,
        perPage: 10,
        fromPage: 0,
      },

      dataFilter: {
        dari: "all",
        ke: "all",
        start_date: this.dateTime("ymd"),
        end_date: this.dateTime("ymd"),
        status: "all",
        keyword: "",
      },
    };
  },

  mixins: [helper],

  methods: {
    _get() {
      this.loading = true;

      let url =
        "mutasi_barang?per_page=" +
        this.paginate.perPage +
        "&page=" +
        this.paginate.currentPage +
        "&id_gudang_asal=" +
        this.dataFilter.dari +
        "&id_gudang_tujuan=" +
        this.dataFilter.ke +
        "&status=" +
        this.dataFilter.status +
        "&start_date=" +
        this.dataFilter.start_date +
        "&end_date=" +
        this.dataFilter.end_date +
        "&keyword=" +
        this.dataFilter.keyword;

      this.axios
        .get(url)
        .then((res) => {
          this.loading = false;

          this.paginate.totalRows = res.data.meta.total;
          this.data = res.data.data;
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

    _add() {
      this.form.config = { view: true, title: "Tambah Mutasi Barang" };
      this.form.action = (formData) => {
        let url =
          "mutasi_barang?per_page=" +
          this.paginate.perPage +
          "&page=" +
          this.paginate.currentPage +
          "&id_gudang_asal=" +
          this.dataFilter.dari +
          "&id_gudang_tujuan=" +
          this.dataFilter.ke +
          "&status=" +
          this.dataFilter.status +
          "&start_date=" +
          this.dataFilter.start_date +
          "&end_date=" +
          this.dataFilter.end_date +
          "&keyword=" +
          this.dataFilter.keyword;

        this.axios
          .post(url, formData)
          .then((res) => {
            this.data = res.data.data;
            this.toast("Berhasil ditambahkan");

            this.form.config.view = false;
          })
          .catch((err) => {
            this.onError(err);
            this.form.isSubmit = false;
          });
      };
    },

    _edit(data) {
      this.form.config = { view: true, title: "Edit Mutasi Barang" };
      this.form.data = data;
      this.form.action = (formData) => {
        let url =
          "mutasi_barang/" +
          data.id +
          "?per_page=" +
          this.paginate.perPage +
          "&page=" +
          this.paginate.currentPage +
          "&id_gudang_asal=" +
          this.dataFilter.dari +
          "&id_gudang_tujuan=" +
          this.dataFilter.ke +
          "&status=" +
          this.dataFilter.status +
          "&start_date=" +
          this.dataFilter.start_date +
          "&end_date=" +
          this.dataFilter.end_date +
          "&keyword=" +
          this.dataFilter.keyword;
        this.axios
          .put(url, formData)
          .then((res) => {
            this.findObject(this.data, "id", data.id, (d, i) => {
              let _data = res.data.data;

              for (const key in _data) {
                this.data[i][key] = _data[key];
              }
            });

            this.toast("Berhasil diperbarui");
            this.form.config.view = false;
          })
          .catch((err) => {
            this.onError(err);
            this.form.isSubmit = false;
          });
      };
    },

    _delete(id) {
      this.confirm.id = id;
      this.confirm.title = "Yakin ingin menghapus data mutasi ini?";
      this.confirm.action = () => {
        this.axios
          .delete("mutasi_barang/" + id + "?per_page=" + this.paginate.perPage + "&page=" + this.paginate.currentPage)
          .then((res) => {
            this.data = res.data.data;
            this.toast("Berhasil dihapus");

            this.confirm.id = null;
          })
          .catch((err) => {
            this.onError(err);
            this.confirm.isSubmit = false;
          });
      };
    },

    _detail(data) {
      this.detail.config = { view: true, title: "Detail Mutasi Barang" };
      this.detail.data = data;
    },

    _markAsSent(id) {
      this.mark.config = { view: true, title: "Tandai Sebagai Terkirim" };
      this.mark.data = null;
      this.mark.action = (formData) => {
        this.mark.isSubmit = true;

        this.axios
          .post("mutasi_barang/deliver/" + id, formData)
          .then((res) => {
            this.findObject(this.data, "id", id, (key) => {
              this.data[key].status = "on the way";
            });

            this.toast("Ditandai terkirim");
            this.mark.isSubmit = false;
          })
          .catch((err) => {
            this.onError(err);
            this.mark.isSubmit = false;
          });
      };
    },

    _markAsReceived(id) {
      this.mark.config = { view: true, title: "Tandai Sudah Diterima" };
      this.mark.data = null;
      this.mark.action = (formData) => {
        this.mark.isSubmit = true;

        this.axios
          .post("mutasi_barang/receive/" + id, formData)
          .then((res) => {
            this.findObject(this.data, "id", id, (key) => {
              this.data[key].status = "received";
            });

            this.toast("Ditandai diterima");
            this.mark.isSubmit = false;
          })
          .catch((err) => {
            this.onError(err);
            this.mark.isSubmit = false;
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

    _span(status) {
      let className = "";

      switch (status) {
        case "waiting":
          className = "badge w-100 bg-orange";
          break;
        case "approved":
          className = "badge w-100 bg-green";
          break;
        case "on the way":
          className = "badge w-100 bg-primary";
          break;
        default:
          className = "badge w-100 bg-info";
          break;
      }

      return className;
    },

    _getGudang() {
      this.axios
        .get("gudang/get/gudang_by_user")
        .then((res) => {
          this.gudangs = res.data.data;
        })
        .catch((err) => {
          this.onError(err);
        });
    },
  },

  mounted() {
    this.auth = JSON.parse(localStorage.user);
    this._get();
    this._getGudang();
  },
};
</script>
