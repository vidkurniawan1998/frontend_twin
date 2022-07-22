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
              <div class="row">
                <div class="col-12 form-group">
                  <label for="" class="form-label">Nama Tipe Harga</label>
                  <input type="text" class="form-control" placeholder="Nama tipe harga" v-model="data.tipe_harga" required ref="input">
                </div>
              </div>
              <div class="row">
                <div class="col-12 form-group">
                  <label for="" class="form-label">Perusahaan</label>
                  <selectize
                      :settings="selectizeConfig" required :disabled="loading"
                      v-model="data.perusahaan"
                      data-placeholder="Pilih Perusahaan" required>
                    <option :value="d.id" v-for="(d, i) in perusahaan" :key="i"> {{d.kode_perusahaan}} </option>
                  </selectize>
                </div>
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
import {mapActions, mapState} from "vuex";

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
      perusahaan: [],
      modal: {
        open: false,
        formNav: 0
      },

      request: false,

      data: {
        perusahaan: [],
        tipe_harga: null
      },
      selectizeConfig: {
        maxItems: 99,
        plugins: ["remove_button"]
      },
    };
  },
  computed: {
    ...mapState(['loading'])
  },
  created() {
    this.loading
  },
  methods: {
    close() {
      this.$emit("update:config", { view: false });
    },
    ...mapActions('perusahaan', ['getListPerusahaan']),
    _getPerusahaan() {
      this.getListPerusahaan(null).then( res => {
        this.perusahaan = res.data
      })
    },
    submit() {
      this.$emit('update:isSubmit', true)
      this.$emit('submit', this.data);
    },

  },

  watch: {
    "config.view": function(view) {
      if (view) {
        this.$emit("update:isSubmit", false);

        this.backdrop = true;
        setTimeout(() => {
          this.modal.open = view;
          this.$refs.input.focus()
          if(this.perusahaan.length == 0) this._getPerusahaan()
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
          if (key === 'perusahaan') {
            this.data[key] = Array.from(data.perusahaan, per => per.id)
          } else {
            this.data[key] = data[key]
          }
        }
      }
    },

  }
};
</script>
