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
        <div class="modal-content ">
          <div class="modal-header">
            <h5 class="modal-title">{{ config.title == null ? "&nbsp;" : config.title }}</h5>
            <button type="button" class="close" @click="close()" v-html="request ? spin() : ic('close')" />
          </div>

          <form action="" @submit.prevent="submit">
            <div class="modal-body pt-3 default">
              <div class="form-group">
                <label for="nama-gudang" class="form-label">Nama Gudang</label>
                <selectize id="nama-gudang" v-model="dataFilter.id_gudang" data-placeholder="Pilih Gudang" required :disabled="request">
                  <option :value="d.id" v-for="(d, i) in gudang" :key="i"> {{ d.nama_gudang }}</option>
                </selectize>
              </div>

              <div class="form-group">
                <label for="tanggal" class="form-label">Tanggal</label>
                <input id="tanggal" type="date" class="form-control" required v-model="dataFilter.end_date" :max="dateTime('ymd')" />
              </div>

              <div class="form-group">
                <label for="principal" class="form-label">Pilih Principal</label>
                <selectize id="principal" v-model="dataFilter.id_principal" data-placeholder="Pilih Principal" :settings="selectConfig" :disabled="request">
                  <option :value="d.id" v-for="(d, i) in principal" :key="i"> {{ d.nama_principal }}</option>
                </selectize>
              </div>

              <div class="form-group">
                <label for="brand" class="form-label">Pilih Brand</label>
                <selectize id="brand" v-model="dataFilter.id_brand" data-placeholder="Pilih Brand" :settings="selectConfig" :disabled="request">
                  <option :value="d.id" v-for="(d, i) in brand" :key="i"> {{ d.nama_brand }}</option>
                </selectize>
              </div>

              <div class="form-group">
                <label for="barang" class="form-label"
                  >Pilih Barang <span class="form-label-description p-cursor text-primary" @click="dataFilter.id_barang = []">Hapus Semua</span>
                </label>
                <selectize id="barang" v-model="dataFilter.id_barang" data-placeholder="Pilih Barang" :disabled="request" :settings="selectConfig">
                  <option :value="d.id" v-for="(d, i) in barang" :key="i"> {{ d.kode_barang + " - " + d.nama_barang }}</option>
                </selectize>
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-white" @click="close()" v-html="'Tutup'" />
              <button type="submit" class="btn btn-primary" :disabled="request" v-html="'OK'" />
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
import {mapActions} from "vuex";

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
      gudang: [],
      barang: [],
      brand: [],
      principal: [],

      dataFilter: {
        id_gudang: null,
        start_date: this.dateTime("ymd"),
        end_date: this.dateTime("ymd"),
        id_principal: [],
        id_barang: [],
        id_brand: [],
      },
    };
  },

  methods: {
    ...mapActions('principal', ['getListPrincipal']),
    close() {
      this.$emit("update:config", { view: false });
    },

    _getGudang() {
      this.request = true;

      this.axios
        .get("gudang/list_gudang/by_depo")
        .then((res) => {
          this.gudang = res.data.data;

          this._getBarang();
        })
        .catch((err) => {
          this.onError(err);
          this.request = false;
        });
    },

    _getPrincipal() {
      this.getListPrincipal({}).then( res => {
        this.principal = res
      })
    },

    _getBarang() {
      this.request = true;

      this.axios
        .get("barang")
        .then((res) => {
          this.barang = res.data.data;
          this.request = false;
        })
        .catch((err) => {
          this.onError(err);
          this.request = false;
        });
    },

    _getBrand() {
      this.request = true;

      this.axios
        .get("brand")
        .then((res) => {
          this.request = false;
          this.brand = res.data.data;
        })
        .catch((err) => {
          this.onError(err);
          this.request = false;
        });
    },

    submit() {
      this.$emit("submit", this.dataFilter);
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
          this._getBrand();
          this._getPrincipal();
          if (this.gudang.length === 0) this._getGudang();
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
      let gudang = this.gudang.find((item) => item.id == id);
      this.dataFilter.nama_gudang = gudang.nama_gudang;
    },
  },
};
</script>
