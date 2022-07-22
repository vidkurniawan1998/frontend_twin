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
                <label for="" class="form-label">Nama Tim</label>
                <input type="text" class="form-control" placeholder="Nama tim" v-model="data.nama_tim" required>
              </div>

              <div class="form-group">
                <label for="" class="form-label">Tipe</label>
                <label class="form-check form-check-inline" v-for="(d, i) in ['to','canvass']" :key="i">
                  <input class="form-check-input" type="radio" name="t" :value="d" v-model="data.tipe">
                  <span class="form-check-label" v-html="ucwords(d)"/>
                </label>
              </div>

              <div class="form-group">
                <label for="" class="form-label">Nama Depo</label>
                <selectize v-model="data.id_depo" data-placeholder="Pilih depo" required>
                    <option :value="d.id" v-for="(d, i) in depo" :key="i"> {{d.nama_depo}} - {{d.perusahaan.kode_perusahaan}} </option>
                </selectize>
              </div>

              <div class="form-group">
                <label for="" class="form-label">Nama Koordinator</label>
                <selectize v-model="data.id_sales_koordinator" data-placeholder="Pilih Koordinator" required>
                  <option :value="d.id" v-for="(d, i) in users" :key="i"> {{ucwords(d.name.toLowerCase())}}</option>
                </selectize>
              </div>

              <div class="form-group">
                <label for="" class="form-label">Nama Supervisor</label>
                <selectize v-model="data.id_sales_supervisor" data-placeholder="Pilih Supervisor" required>
                  <option :value="d.id" v-for="(d, i) in users" :key="i"> {{ucwords(d.name.toLowerCase())}}</option>
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

      request: true, depo: [], users:[],

      data: {
        nama_tim: null,
        tipe: 'to',
        id_depo: null,
        id_sales_koordinator: null,
        id_sales_supervisor: null
      },

    };
  },

  methods: {
    close() {
      this.$emit("update:config", { view: false });
    },

    _getDepo(){
      this.request = true

      this.axios.get('depo').then(res => {
        this.depo = res.data.data;
        this.request = false
      }).catch( err => {
        this.onError(err)
        this.request = false
      });
    },
    _getUser(){
      this.request = true;

      this.axios.get('user?status=active').then(res => {
        this.users = res.data.data;

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
          if(this.depo.length == 0) this._getDepo()
          if(this.users.length == 0) this._getUser()
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
