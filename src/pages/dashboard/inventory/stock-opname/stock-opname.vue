<template>
  <div class="antialiased">
    <Sidebar />
    <div class="page">
      <Header @change="_search" hint="Ketik no. Stock Opname" />
      <div class="content">
        <div class="container">
          <div class="page-header">
            <div class="row d-flex justify-content-between">
              <div class="col-auto">
                <h2 class="page-title">Stock Opname</h2>
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
                      class="btn btn-white mr-3"
                      v-html="ic('filter')"
                      @click="_filter"
                    ></button>
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
                  class="table table-vcenter table-hover card-table table-striped"
                >
                  <thead>
                    <tr class="text-muted">
                      <th>No SO</th>
                      <th>Tanggal</th>
                      <th>Gudang</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr v-for="(row, i) in data" :key="i" :id="'tr' + row.id">
                      <td
                        class="click-able text-primary"
                        @click="_detail(row)"
                        v-html="row.id"
                      ></td>
                      <td>{{ row.tanggal_so }}</td>
                      <td>{{ row.nama_gudang }}</td>
                      <td>
                        <span
                          v-html="
                            row.is_approved == 0 ? 'menunggu' : 'disetujui'
                          "
                          class="badge w-100"
                          :class="
                            row.is_approved == 0 ? 'bg-orange' : 'bg-green'
                          "
                        ></span>
                      </td>
                      <td class="text-right">
                        <div class="btn-group">
                          <button
                            class="btn btn-white btn-sm"
                            @click="_edit(row)"
                            v-html="ic('edit')"
                            v-if="row.is_approved == 0"
                          />
                          <button
                            class="btn btn-white btn-sm text-danger"
                            @click="_delete(row.id)"
                            v-if="row.is_approved == 0"
                            v-html="ic('trash')"
                          />
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

    <FormStockOpname
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
    />

    <DetailStockOpname
      :config.sync="detail.config"
      :initData="detail.data"
      @submit="detail.action"
    />
  </div>
</template>

<script>
import helper from "@/assets/js/helper.js";
import FormFilter from "./modals/filter.vue";
import FormStockOpname from "./modals/form-stock-opname.vue";
import DetailStockOpname from "./modals/detail-stock-opname.vue";
export default {
  name: "StockOpname",
  components: { FormFilter, FormStockOpname, DetailStockOpname },

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
        edit: null,
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
        perPage: 10,
        fromPage: 0,
      },

      dataFilter: {
        gudang: "all",
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
        "stock_opname?per_page=" +
        this.paginate.perPage +
        "&page=" +
        this.paginate.currentPage +
        "&id_gudang=" +
        this.dataFilter.gudang +
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
      this.form.config = {
        view: true,
        edit: false,
        title: "Tambah Stock Opname",
      };
      this.form.action = (formData) => {
        this.axios
          .post("stock_opname", formData)
          .then((res) => {
            this.toast("Berhasil ditambahkan");
            this.form.config.view = false;
            this._get();
          })
          .catch((err) => {
            this.onError(err);
            this.form.isSubmit = false;
          });
      };
    },

    _edit(data) {
      this.form.config = {
        view: true,
        edit: true,
        title: "Edit Stock Opname",
      };
      this.form.data = data;
      this.form.action = (formData) => {
        this.axios
          .put("stock_opname/" + data.id, formData)
          .then((res) => {
            this.findObject(this.data, "id", data.id, (d, i) => {
              let _data = res.data.data;

              for (const key in _data) {
                this.data[i][key] = _data[key];
              }
            });

            this.toast("Berhasil diperbarui");
            this.form.config.view = false;
            this._get();
          })
          .catch((err) => {
            this.onError(err);
            this.form.isSubmit = false;
          });
      };
    },

    _delete(id) {
      this.confirm.id = id;
      this.confirm.title = "Yakin ingin menghapus data ini?";
      this.confirm.action = () => {
        this.axios
          .delete("stock_opname/" + id)
          .then((res) => {
            this.data = res.data.data;
            this.toast("Berhasil dihapus");

            this.confirm.id = null;
            this._get();
          })
          .catch((err) => {
            this.onError(err);
            this.confirm.isSubmit = false;
          });
      };
    },

    _pageChange(page) {
      this.paginate.currentPage = page;
      this._get();
    },

    _detail(data) {
      this.detail.config = { view: true, title: "Detail Stock Opname" };
      this.detail.data = data;
      this.detail.action = () => {
        this._get();
      };
    },

    _search(keyword) {
      this.dataFilter.keyword = keyword;
      this._get();
    },
  },

  mounted() {
    this.auth = JSON.parse(localStorage.user);
    this._get();
  },
};
</script>
