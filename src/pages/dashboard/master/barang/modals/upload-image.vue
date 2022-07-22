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

            <div class="modal-body text-center p-0">
              <input type="file" class="d-none" ref="file" accept="image/*" @change="onFile($event)">

              <img :src="file.url == null ? asset('no-image.png') : file.ext != null ? file.url : image(file.url)" alt="" :style="file.url != null ? 'width: 100%' : ''">
              <div class="mt-2">Pilih gambar produk</div>
              
            </div>

            <div class="modal-footer pt-2">
              <button type="button" class="btn btn-white" @click="$refs.file.click()" :disabled="isSubmit"> <i class="fe fe-image mr-2"></i> Pilih Gambar </button>
              <!-- <button type="button" class="btn btn-white" @click="close()" v-html="'Tutup'" /> -->

              <button
                type="submit"
                class="btn btn-primary"
                :disabled="isSubmit" @click="submit"
                v-html="isSubmit ? spin() : 'Simpan'"
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

      request: true, segmens: [], data: {},
      file: {
        url: null,
        ext: null
      }

    };
  },

  methods: {
    close() {
      this.$emit("update:config", { view: false });
    },

    submit() {
      if(this.file.url == null){
        this.toast('Anda belum memilih gambar apapun.')
      }else{
        let formData = new FormData()
        formData.append('gambar', this.dataURLtoFile(this.file.url, 'file.'+this.file.ext));

        this.$emit('update:isSubmit', true)
        this.$emit('submit', formData);
      }
    },

    onFile(e){
      const file = e.target.files[0];

      if (typeof FileReader === 'function') {
        const reader = new FileReader();

        reader.onload = (event) => {

          this.file.url = event.target.result
          this.file.ext = file.name.split('.').pop()

          // this.file.file = file
          // this.file.name = file.name
          // this.file.size = this.formatBytes(file.size)
        };

        reader.readAsDataURL(file);
      } else {
        this.toast('FileReader API not supported');
      }

    }

  },

  watch: {
    "config.view": function(view) {
      if (view) {
        this.$emit("update:isSubmit", false);

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

    initData: function(data) {
      Object.assign(this.$data.file, this.$options.data.call(this).file);

      if(data.gambar != null) this.file.url = data.gambar
    },

  }
};
</script>
