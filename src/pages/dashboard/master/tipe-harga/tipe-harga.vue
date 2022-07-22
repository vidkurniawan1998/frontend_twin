<template>
  <div class="antialiased">
    <Sidebar />

    <div class="page">
      <Header @keyup="_search" />

      <div class="content">
        <div class="container">
          <!-- Page title -->
          <div class="page-header">
            <div class="row d-flex justify-content-between">
              <div class="col-auto">
                <h2 class="page-title">Tipe Harga</h2>
              </div>

              <!-- <div class="col-auto">
                <div class="text-muted text-h5 mt-2">Login Pada {{auth.logged_at}}</div>
              </div> -->

              <div class="col-auto">
                <div class="input-icon float-left">
                  <span class="input-icon-addon">
                    <i class="fe fe-align-left"></i>
                  </span>
                  <select class="form-control" v-model="paginate.perPage" @change="_get" :disabled="loading">
                    <option
                      :value="num"
                      v-for="(num, i) in [10, 50, 100, 999]"
                      :key="i"
                      v-html="num == 999 ? 'Semua' : num"
                    />
                  </select>
                </div>

                <div class="btn-group ml-3">
                  <button class="btn btn-primary" @click="_add">Tambah</button>
                </div>
              </div>
            </div>
          </div>

          <Skeleton type="table" :length="10" class="mt-3 bg-white" v-if="loading" />

          <Nodata v-if="!loading && filter.length == 0" />

          <div class="box" v-if="!loading && filter.length > 0">
            <div class="card">
              <div class="table-responsive">
                <table class="table table-vcenter table-hover card-table table-striped">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Tipe Harga</th>
                      <th>Perusahaan</th>
                      <th>Created</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, i) in filter" :key="i">
                      <td>{{ paginate.fromPage + i }}</td>
                      <td>{{ row.tipe_harga }}</td>
                      <td><span v-for="(perusahaan, l) in row.perusahaan" :key="l" v-html="perusahaan.kode_perusahaan" class="badge bg-blue-lt mr-2"></span></td>
                      <td>{{ row.created_at }}</td>
                      <td class="text-right">
                        <div class="btn-group">
                          <button class="btn btn-white btn-sm" @click="_edit(row)" v-html="ic('edit')" />
                          <button
                            class="btn btn-white btn-sm text-danger"
                            @click="_delete(row.id)"
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

    <FormTipeHarga
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
  </div>
</template>

<script>
import helper from "@/assets/js/helper.js";
import DetailStock from "./modals/detail-stock.vue";
import FormTipeHarga from "./modals/form-tipe-harga.vue";

export default {
  name: "Stock",
  components: { DetailStock, FormTipeHarga },

  data() {
    return {
      auth: {},

      confirm: {
        id: null,
        title: null,
        isSubmit: false,
        action: () => {},
        btnConfirm: "btn-danger",
        textConfirm: "Hapus Sekarang",
      },

      form: {
        config: { view: false, title: null },
        data: null,
        isSubmit: false,
        action: () => {},
      },

      loading: true,
      data: [],
      filter: [],

      paginate: {
        currentPage: 1,
        totalRows: 0,
        perPage: 10,
        fromPage: 0,
      },
    };
  },

  mixins: [helper],

  methods: {
    _get() {
      this.loading = true;
      this.axios
        .get("tipe_harga?per_page=" + this.paginate.perPage + "&page=" + this.paginate.currentPage)
        .then((res) => {
          this.data = this.filter = res.data.data;
          this.paginate.totalRows = res.data.meta.total;
          this.paginate.fromPage = res.data.meta.from;

          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          this.onError(err);
        });
    },

    _add() {
      this.form.config = { view: true, title: "Tambah Tipe Harga" };
      this.form.data = null;
      this.form.action = (formData) => {
        this.axios
          .post("tipe_harga", formData)
          .then(() => {
            this._get({ silent: true });

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
      this.form.config = { view: true, title: "Edit Tipe Harga" };
      this.form.data = data;
      this.form.action = (formData) => {
        this.axios
          .put("tipe_harga/" + data.id, formData)
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

    _delete(id) {
      this.confirm.id = id;
      this.confirm.title = "Yakin ingin menghapus tipe harga ini?";
      this.confirm.action = () => {
        this.axios
          .delete("tipe_harga/" + id)
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

    _pageChange(page) {
      this.paginate.currentPage = page;
      this._get();
    },

    _search(keyword) {
      let k = keyword.toString().toLowerCase();
      this.filter = [];

      for (let i = 0; i < this.data.length; i++) {
        if (this.data[i].nama_gudang.toLowerCase().includes(k)) {
          this.filter.push(this.data[i]);
        }
      }
    },
  },

  mounted() {
    this.auth = JSON.parse(localStorage.user);

    this._get();
  },
};
</script>
