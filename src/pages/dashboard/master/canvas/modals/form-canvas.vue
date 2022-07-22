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
                <label for="" class="form-label">Kendaraan</label>
                <selectize v-model="data.id_kendaraan" data-placeholder="Pilih kendaraan" required>
                  <option :value="'0'">Tidak ada kendaraan</option>
                  <option :value="dt.id" v-for="(dt, i) in kendaraan" :key="i"> {{ dt.no_pol_kendaraan }} {{dt.body_no == null ? '' : '('+dt.body_no+')'}} </option>
                </selectize>
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

      request: true, kendaraan: [],

      data: {
        id_kendaraan: null,
      },

    };
  },

  methods: {
    close() {
      this.$emit("update:config", { view: false });
    },

    _getKendaraan(){
      this.request = true

      this.axios.get('kendaraan/list/delivery').then(res =>{
        this.kendaraan = res.data;
        this.request = false
      }).catch( err => {
        this.onError(err)
        this.request = false
      });
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
          if(this.kendaraan.length == 0) this._getKendaraan()
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
          this.data[key] = data[key]
        }
      }
    },

  }
};
</script>
