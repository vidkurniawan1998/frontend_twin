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
                <label for="" class="form-label">No Plat</label>
                <input type="text" class="form-control" placeholder="No plat" v-model="data.no_pol_kendaraan" required>
              </div>

              <div class="form-group">
                <label for="" class="form-label">Nomor Body</label>
                <input type="text" class="form-control" placeholder="Nomor body" v-model="data.body_no" required>
              </div>

              <div class="form-group">
                <label for="" class="form-label">Jenis Kendaraan</label>
                <label class="form-check form-check-inline" v-for="(d, i) in ['truck','pickup','minibus','sepeda_motor']" :key="i">
                  <input class="form-check-input" type="radio" name="jk" :value="d" v-model="data.jenis">
                  <span class="form-check-label" v-html="ucwords(d.replace('_',' '))"/>
                </label>
              </div>

              <div class="form-group">
                <label for="" class="form-label">Merk</label>
                <input type="text" class="form-control" placeholder="Merk" v-model="data.merk" required>
              </div>

              <div class="form-group">
                <label for="" class="form-label">Peruntukan</label>
                <label class="form-check form-check-inline" v-for="(d, i) in ['delivery','canvass']" :key="i">
                  <input class="form-check-input" type="radio" name="p" :value="d" v-model="data.peruntukan">
                  <span class="form-check-label" v-html="ucwords(d.replace('_',' '))"/>
                </label>
              </div>

              <div class="row">
                <div class="col-6">
                  <div class="form-group">
                    <label for="" class="form-label">Samsat</label>
                    <input type="date" class="form-control" v-model="data.samsat">
                  </div>
                </div>
                <div class="col-6">
                  <div class="form-group">
                    <label for="" class="form-label">Tahun</label>
                    <input type="text" @keypress="numberOnly($event)" maxlength="4" class="form-control" placeholder="Tahun" v-model="data.tahun" required>
                  </div>
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

      data: {
        body_no: null,
        jenis: 'truck',
        merk: null,
        no_pol_kendaraan: null,
        peruntukan: null,
        samsat: null,
        tahun: null
      },

    };
  },

  methods: {
    close() {
      this.$emit("update:config", { view: false });
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
