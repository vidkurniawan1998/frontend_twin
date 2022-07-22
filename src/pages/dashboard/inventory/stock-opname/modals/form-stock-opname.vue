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
      <div class="modal-dialog modal-md modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ config.title == null ? "&nbsp;" : config.title }}
            </h5>
            <button type="button" class="close" @click="close()" v-html="request ? spin() : ic('close')" />
          </div>

          <form @submit.prevent="submit">
            <div class="modal-body">
              <div class="form-group">
                <label for="">Tanggal</label>
                <input type="date" class="form-control" v-model="data.tanggal_so" required :disabled="config.edit" />
              </div>

              <div class="form-group">
                <label for="">Gudang</label>
                <selectize v-model="data.id_gudang" data-placeholder="Pilih gudang" required :disabled="config.edit">
                  <option :value="dt.id" v-for="(dt, i) in gudang" :key="i">
                    {{ dt.nama_gudang }}
                  </option>
                </selectize>
              </div>

              <div class="form-group">
                <label for="">Keterangan</label>
                <textarea cols="30" rows="5" placeholder="Keterangan" class="form-control" v-model="data.keterangan"></textarea>
              </div>
            </div>

            <div class="modal-footer pt-2">
              <button type="button" class="btn btn-white" @click="close()" v-html="'Tutup'" />

              <button type="submit" class="btn btn-primary" :disabled="isSubmit || request" v-html="isSubmit ? spin() : 'Simpan'" />
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

export default {
  name: "Form",
  props: {
    config: {
      default: {
        view: false,
        edit: false,
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

      data: {
        id: null,
        tanggal_so: this.dateTime("ymd"),
        id_gudang: null,
        keterangan: null,
      },
    };
  },

  methods: {
    close() {
      this.$emit("update:config", { view: false, edit: false });
    },

    getGudang() {
      this.request = true;
      this.axios
        .get("/gudang/list_gudang/by_depo")
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
      this.$emit("update:isSubmit", true);
      this.$emit("submit", this.data);
    },
  },

  watch: {
    "config.view": function(view) {
      if (view) {
        this.$emit("update:isSubmit", false);

        this.backdrop = true;
        setTimeout(() => {
          this.modal.open = view;
          this.getGudang();
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
        this.data.id_gudang = data.id_gudang;
        this.data.keterangan = data.keterangan;
      }
    },
  },
};
</script>
