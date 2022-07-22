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
            <h5 class="modal-title">Kok Bisa Error?</h5>
            <button type="button" class="close" @click="close()" v-html="ic('close')"/>
          </div>

          <form @submit.prevent="submit">
            <div class="modal-body">
              <i class="fe fe-alert-circle mr-1"></i> Apabila terjadi masalah atau error seperti <b class="text-danger">500 - Internal Server Error</b>, pastikan file excel yang Anda inputkan valid atau sesuai dengan format yang telah ditentukan seperti nama header, tanggal (yang harusnya format tanggal tetapi format general atau string). Apabila format file excel yang Anda inputkan sudah benar atau valid akan tetapi masih mengalami error, jangan ragu untuk menghubungi IT Support.
            </div>

            <div class="modal-footer pt-2">
              <button type="button" class="btn btn-white" @click="close()" v-html="'Tutup'" />
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
      view: false,
    },
  },

  mixins: [helper],

  data() {
    return {
      backdrop: false,
      modal: {
        open: false,
      },
    };
  },

  methods: {
    close() {
      this.$emit("update:config", { view: false });
    },
  },

  watch: {
    "config.view": function(view) {
      if (view) {
        this.backdrop = true;
        setTimeout(() => {
          this.modal.open = view;
        }, 100);
      } else {
        this.modal.open = view;

        setTimeout(() => {
          this.backdrop = view;
        }, 100);
      }
    },
  }
};
</script>
