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
      <div class="modal-dialog modal-md modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ config.title == null ? "&nbsp;" : config.title }}</h5>
            <button type="button" class="close" @click="close()" v-html="request ? spin() : ic('close')" />
          </div>

          <div class="modal-body pt-3">
            <div class="form-group">
              <label for="" class="form-label">Pilih Barang</label>
              <selectize v-model="dataFilter.id_barang" data-placeholder="Pilih Barang" required :disabled="barang.length == 0 ? true : false">
                <option :value="d.id" v-for="(d, i) in barang" :key="i"> {{ d.kode_barang + " - " + d.nama_barang }} </option>
              </selectize>
            </div>

            <div class="form-group">
              <label for="" class="form-label">Pilih Gudang</label>
              <selectize v-model="dataFilter.id_gudang" data-placeholder="Pilih Gudang" required :disabled="gudang.length == 0 ? true : false">
                <option :value="d.id" v-for="(d, i) in gudang" :key="i"> {{ d.nama_gudang }} </option>
              </selectize>
            </div>

            <div class="row">
              <div class="col-6">
                <div class="form-group">
                  <label for="" class="form-label">Mulai Tanggal</label>
                  <input type="date" class="form-control" required v-model="dataFilter.tanggal_awal" :max="dataFilter.tanggal_akhir" />
                </div>
              </div>
              <div class="col-6">
                <div class="form-group">
                  <label for="" class="form-label">Sampai Tanggal</label>
                  <input type="date" class="form-control" required v-model="dataFilter.tanggal_akhir" :min="dataFilter.tanggal_awal" />
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-white" @click="close()" v-html="'Tutup'" />
            <button
              type="button"
              class="btn btn-primary"
              @click="submit()"
              :disabled="request || dataFilter.id_barang == null || dataFilter.id_gudang == null"
              v-html="'OK'"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="modal-backdrop fade" :class="modal.open ? 'show' : ''" />
  </div>
</template>

<script>
import helper from "@/assets/js/helper.js";

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
      },

      request: true,

      gudang: [],
      barang: [],

      dataFilter: {
        id_barang: null,
        id_gudang: null,
        nama_gudang: null, // tidak dibutuhkan server, ditampilkan saja di atas tabel
        tanggal_awal: this.dateTime("ymd"),
        tanggal_akhir: this.dateTime("ymd"),
      },
    };
  },

  methods: {
    close() {
      this.$emit("update:config", { view: false });
    },

    _getGudang() {
      this.request = true;
      this.axios
        .get("gudang/list_gudang/by_depo")
        .then((res) => {
          this.gudang = res.data.data;
          this.request = false;
        })
        .catch((err) => {
          this.onError(err);
          this.request = false;
        });
    },

    _getBarang() {
      this.request = true;
      this.axios
        .get("barang")
        .then((res) => {
          this.barang = res.data.data;
          this._getGudang();
        })
        .catch((err) => {
          this.onError(err);
          this.request = false;
        });
    },

    submit() {
      this.$emit("onSubmit", this.dataFilter);
      this.close();
    },
  },

  watch: {
    "config.view": function(view) {
      if (view) {
        this.$emit("update:isSubmit", false);

        this.backdrop = true;
        setTimeout(() => {
          this.modal.open = view;
          if (this.barang.length == 0) this._getBarang();
        }, 100);
      } else {
        this.modal.open = view;

        setTimeout(() => {
          this.backdrop = view;
        }, 100);
      }
    },

    initData: function(data) {},

    "dataFilter.id_gudang": function(id) {
      let data = this.gudang.find((item) => item.id == id);
      this.dataFilter.nama_gudang = data.nama_gudang;
    },
  },
};
</script>
