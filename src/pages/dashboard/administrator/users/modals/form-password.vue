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
            <button type="button" class="close" @click="close()" v-html="ic('close')"/>
          </div>

          <form @submit.prevent="submit">
            <div class="modal-body" ref="modal">

              <div class="form-group" v-if="initData == null">
                <label for="" class="form-label">Password</label>
                <input type="password" class="form-control" placeholder="Password" v-model="data.password" required ref="focus">
              </div>

              <div class="form-group" v-if="initData == null">
                <label for="" class="form-label">Konfirmasi Password</label>
                <input type="password" class="form-control" placeholder="Konfirmasi password" v-model="data.password_confirmation" required>
              </div>

            </div>

            <div class="modal-footer pt-2">
              <button type="button" class="btn btn-white" @click="close()" v-html="'Tutup'" />

              <button
                type="submit"
                class="btn btn-primary"
                :disabled="isSubmit"
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

      data: {
        password: null,
        password_confirmation: null,
      },

    };
  },

  methods: {
    close() {
      this.$emit("update:config", { view: false });
    },

    submit() {
      if(this.data.password.length < 6){
        this.toast('Minimal password 6 karakter'); return
      }else{
        if(this.data.password !== this.data.password_confirmation){
          this.toast('Konfirmasi password salah'); return
        }
      }

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
          Object.assign(this.$data.data, this.$options.data.call(this).data);

          this.modal.open = view;
          this.$refs.focus.focus()
        }, 100);
      } else {
        this.modal.open = view;

        setTimeout(() => {
          this.backdrop = view;
        }, 100);
      }
    },

    initData: function(data) { },

  }
};
</script>
