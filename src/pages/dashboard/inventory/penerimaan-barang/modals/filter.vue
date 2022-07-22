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
              <label for="" class="form-label">Pilih Gudang</label>
              <selectize v-model="dataFilter.id_gudang" data-placeholder="Pilih Gudang" required :disabled="gudang.length == 0 ? true : false">
                <option value="all"> Semua Gudang </option>
                <option :value="d.id" v-for="(d, i) in gudang" :key="i"> {{ d.nama_gudang }} </option>
              </selectize>
            </div>

            <div class="form-group">
              <label for="" class="form-label">Pilih Status</label>
              <selectize v-model="dataFilter.status" data-placeholder="Pilih Status" required>
                <option :value="d" v-for="(d, i) in ['all', 'waiting', 'approved']" :key="i"> {{ d }} </option>
              </selectize>
            </div>

            <div class="row">
              <div class="col-6">
                <div class="form-group">
                  <label for="" class="form-label">Mulai Tanggal</label>
                  <input type="date" class="form-control" required v-model="dataFilter.start_date" :max="dataFilter.end_date" />
                </div>
              </div>
              <div class="col-6">
                <div class="form-group">
                  <label for="" class="form-label">Sampai Tanggal</label>
                  <input type="date" class="form-control" required v-model="dataFilter.end_date" :min="dataFilter.start_date" />
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-white" @click="close()" v-html="'Tutup'" />
            <button type="button" class="btn btn-primary" @click="submit" v-html="'OK'" />
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
        formNav: 0,
      },

      request: true,

      gudang: [],

      dataFilter: {
        id_gudang: "",
        status: "all",
        start_date: this.dateTime("ymd"),
        end_date: this.dateTime("ymd"),
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
        .get("gudang/list_gudang/baik_depo")
        .then((res) => {
          this.gudang = res.data.data;
          this.request = false;
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
          this._getGudang();
        }, 100);
      } else {
        this.modal.open = view;

        setTimeout(() => {
          this.backdrop = view;
        }, 100);
      }
    },

    initData: function(data) {},
  },
};
</script>

<style lang="scss" src="../penerimaan.scss" scoped />
