<template>
  <div v-if="data_filter.form">
    <div
      class="modal fade"
      :class="data_filter.modal ? 'show' : ''"
      style="display: block"
      tabindex="-1"
      role="dialog"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-md modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Filter</h5>
            <button
              type="button"
              class="close"
              v-on:click="triggerFilter"
              v-html="loading ? spin() : ic('close')"
            />
          </div>

          <div class="modal-body pt-3">
            <div class="form-group">
              <label for="principal" class="form-label">Principal</label>
              <selectize
                @input="_getBrand($event)"
                id="principal"
                v-model="data_filter.id_principal"
                data-placeholder="Pilih Principal"
                :settings="selectConfig"
                :disabled="loading"
              >
                <option :value="d.id" v-for="(d, i) in principal" :key="i">
                  {{ d.nama_principal }}</option
                >
              </selectize>
            </div>

            <div class="form-group">
              <label for="brand" class="form-label">Brand</label>
              <selectize
                id="brand"
                @input="_getBarang($event)"
                v-model="data_filter.id_brand"
                data-placeholder="Pilih Brand"
                :settings="selectConfig"
                :disabled="loading"
              >
                <option :value="d.id" v-for="(d, i) in brand" :key="i">
                  {{ d.nama_brand }}</option
                >
              </selectize>
            </div>

            <div class="form-group">
              <label for="barang" class="form-label">Barang </label>
              <selectize
                id="barang"
                v-model="data_filter.id_barang"
                data-placeholder="Pilih Barang"
                :disabled="loading"
              >
                <option :value="d.id" v-for="(d, i) in barang" :key="i">
                  {{ d.kode_barang + " - " + d.nama_barang }}</option
                >
              </selectize>
            </div>

            <div class="row">
              <div class="form-group col-md-6">
                <label for="tanggal-mulai" class="form-label"
                  >Mulai Tanggal</label
                >
                <input
                  id="tanggal-mulai"
                  type="date"
                  class="form-control"
                  required
                  v-model="data_filter.start_date"
                  :max="data_filter.end_date"
                />
              </div>

              <div class="form-group col-md-6">
                <label for="tanggal-selesai" class="form-label"
                  >Sampai Tanggal</label
                >
                <input
                  id="tanggal-selesai"
                  type="date"
                  class="form-control"
                  required
                  v-model="data_filter.end_date"
                  :max="dateTime('ymd')"
                />
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-white"
              v-on:click="triggerFilter"
              v-html="'Tutup'"
            />
            <button
              type="button"
              class="btn btn-primary"
              v-on:click="
                triggerFilter();
                getLaporan();
              "
              v-html="'OK'"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import helper from "@/assets/js/helper.js";

export default {
  name: "Modal",
  mixins: [helper],
  computed: {
    ...mapState(["loading"]),
    ...mapState("monitoring_pro", {
      data_filter: (state) => state.data_filter,
    }),
  },
  data() {
    return {
      selectizeConfig: {
        maxItems: 99,
        plugins: ["remove_button"],
      },

      principal: [],
      brand: [],
      barang: [],
    };
  },

  methods: {
    ...mapActions("brand", ["getListBrand"]),
    ...mapActions("principal", ["getListPrincipal"]),
    ...mapActions("barang", ["getListBarangByBrand"]),
    ...mapActions("monitoring_pro", ["triggerFilter", "getLaporan"]),

    _getBrand() {
      this.getListBrand({
        id_principal: this.data_filter.id_principal,
        per_page: "all",
      }).then((res) => {
        this.brand = res;
      });
    },

    _getBarang(id) {
      this.getListBarangByBrand({ id_brand: id }).then((res) => {
        this.barang = res.data;
      });
    },

    _getListPrincipal() {
      this.getListPrincipal({ id_perusahaan: 1 }).then((res) => {
        this.principal = res;
      });
    },
  },
  mounted: function() {
    this._getListPrincipal();
  },
};
</script>
