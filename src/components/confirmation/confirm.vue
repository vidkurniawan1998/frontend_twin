<template>
  <div v-if="backdrop">
    <div
      class="modal modal-bl ur fade"
      :class="modal.open ? 'show' : ''"
      style="display: block; z-index: 99999999999; background: rgba(0,0,0,0.5)"
      tabindex="-1"
      role="dialog"
      aria-hidden="true"
      @click="$event.target.classList.contains('modal') ? close() : true"
    >
      <div class="modal-dialog modal-sm modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-body">
            <h5 class="modal-title mb-0" v-html="title"></h5>
            <small v-html="subTitle"></small>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-white" @click="close()">Batal</button>
            <button
              @click="submit"
              type="submit" ref="submit"
              class="btn " :class="btnConfirm"
              :disabled="isSubmit"
              v-html="isSubmit ? spin() : textConfirm"
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
  name: "Confirm",
  props: {
    title: null, subTitle: {default: 'Penghapusan ini bersifat permanen.'}, btnConfirm: {default: 'btn-danger'},
    id: { default: null }, textConfirm: {default: 'Hapus Sekarang'},
    isSubmit: false
  },

  mixins: [helper],

  data() {
    return {
      backdrop: false,
      modal: {
        open: false
      },
    };
  },

  methods: {
    close() {
      this.$emit("update:id", null);
    },

    submit() {
      this.$emit("update:isSubmit", true);
      this.$emit("submit");
    },

    // _enter(e){
    //   if (e.keyCode === 13) {
    //     alert('dfdf')
    //   }
    // }
  },

  watch: {
    id(view) {
      if (view != null) {
        this.$emit("update:isSubmit", false);

        this.backdrop = true;
        setTimeout(() => {
          this.modal.open = true;
          this.$refs.submit.focus()
        }, 100);
      } else {
        this.modal.open = false;

        setTimeout(() => {
          this.backdrop = false;
        }, 100);
      }
    }
  }
};
</script>
