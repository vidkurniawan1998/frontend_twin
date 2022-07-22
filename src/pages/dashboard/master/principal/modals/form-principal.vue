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
            <h5 class="modal-title">{{config.title == null ? '&nbsp;' : config.title}}</h5>
            <button type="button" class="close" @click="close()" v-html="request ? spin() : ic('close')"/>
          </div>

          <form @submit.prevent="submit">
            <div class="modal-body default">
              <div class="form-group">
                <label for="" class="form-label">Perusahaan</label>
                <selectize v-model="data.id_perusahaan" data-placeholder="Pilih Perusahaan" required>
                  <option :value="d.id" v-for="(d, i) in perusahaan" :key="i"> {{d.kode_perusahaan}} - {{d.nama_perusahaan}} </option>
                </selectize>
              </div>

              <div class="form-group">
                <label for="" class="form-label">Nama</label>
                <input type="text" class="form-control" placeholder="Nama principal" v-model="data.nama_principal" required>
              </div>

              <div class="form-group">
                <label for="" class="form-label">Alamat</label>
                <input type="text" class="form-control" placeholder="Alamat" v-model="data.alamat" required>
              </div>

              <div class="form-group">
                <label for="" class="form-label">Kode Pos</label>
                <input type="text" number-only maxlength="5" class="form-control" placeholder="Kode pos" v-model="data.kode_pos" required>
              </div>

              <div class="form-group">
                <label for="" class="form-label">Nomor Telepon</label>
                <input type="tel" @keypress="numberOnly($event)" class="form-control" placeholder="Nomor telepon" v-model="data.telp" required>
              </div>

            </div>

            <div class="modal-footer pt-2">
              <button type="button" class="btn btn-white" @click="close()" v-html="'Tutup'" />

              <button
                type="submit"
                class="btn btn-primary"
                :disabled="isSubmit || request"
                v-html="isSubmit ? spin() : 'Simpan'"
              />
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
  name: "Form",
  props: {
    config: {
      default: {
        view: false,
        title: "Modal Title"
      }
    },
    initData: null,
    isSubmit: {default: false},
    dismiss: {default: true}
  },

  mixins: [helper],

  data() {
    return {
      backdrop: false,
      modal: {
        open: false,
        formNav: 0
      },

      request: false,
      perusahaan: [],
      data: {
        id_perusahaan: null,
        nama_principal: null,
        alamat: null,
        kode_pos: null,
        telp: null
      },

    };
  },

  methods: {
    ...mapActions('perusahaan', ['getListPerusahaan']),
    close() {
      this.$emit("update:config", { view: false });
    },

    submit() {
      this.$emit('update:isSubmit', true)
      this.$emit('submit', this.data);
    },
    _getPerusahaan() {
      this.getListPerusahaan(null).then( res => {
        this.perusahaan = res.data
      })
    },
  },

  watch: {
    "config.view": function(view) {
      if (view) {
        this.$emit("update:isSubmit", false);

        this.backdrop = true;
        setTimeout(() => {
          if(this.perusahaan.length == 0) this._getPerusahaan()
          this.modal.open = view;
        }, 100);
      } else {
        this.modal.open = view;

        setTimeout(() => {
          this.backdrop = view;
        }, 100);
      }
    },

    initData: function(data) {
      if(data == null){
        Object.assign(this.$data.data, this.$options.data.call(this).data);
      }else{
        for (const key in this.data) {
          if (key === 'id_perusahaan') {
            this.data[key] = data.perusahaan.id
          } else {
            this.data[key] = data[key]
          }
        }
      }
    },

  }
};
</script>
