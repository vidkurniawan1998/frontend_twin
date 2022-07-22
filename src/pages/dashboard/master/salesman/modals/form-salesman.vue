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
            <button type="button" class="btn-link btn px-0" @click="_getUser" v-html="ic('refresh')" :disabled="request"/>
            <button type="button" class="close" @click="close()" v-html="request ? spin() : ic('close')"/>
          </div>

          <form @submit.prevent="submit">
            <div class="modal-body default">

              <div class="form-group" v-if="initData == null">
                <label for="" class="form-label">Nama Salesman</label>
                <selectize v-model="data.user_id" data-placeholder="Pilih salesman" required :disabled="request">
                  <option :value="d.id" v-for="(d, i) in users" :key="i"> {{ucwords(d.name.toLowerCase())}}</option>
                </selectize>
              </div>

              <div class="form-group">
                <label for="" class="form-label">Tim</label>
                <selectize v-model="data.id_tim" data-placeholder="Pilih tim" required :disabled="request">
                  <option :value="d.id" v-for="(d, i) in tim" :key="i"> {{d.nama_tim}} - {{d.nama_depo}} </option>
                </selectize>
              </div>

              <div class="form-group">
                <label class="form-label">Kode Eksklusif</label>
                <input type="text" class="form-control" v-model="data.kode_eksklusif">
              </div>

              <div class="form-group">
                <label for="principal" class="form-label">Principal</label>
                <selectize id="principal" v-model="data.id_principal" data-placeholder="Pilih principal" :disabled="loading">
                  <option :value="d.id" v-for="(d, i) in principal" :key="i"> {{d.nama_principal}} </option>
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
      modal: {
        open: false,
        formNav: 0
      },

      request: false, tim: [], users: [], principal: [],

      data: {
        user_id: null,
        id_tim: null,
        kode_eksklusif: null,
        id_principal: null
      },

    };
  },
  computed: {
    ...mapState(['loading'])
  },
  methods: {
    ...mapActions('principal', ['getListPrincipal']),
    close() {
      this.$emit("update:config", { view: false });
    },

    submit() {
      this.$emit('update:isSubmit', true)
      this.$emit('submit', this.data);
    },

    _getUser(){
      this.request = true; this.users = []

      this.axios.get('user?status=active').then(res => {
        this.users = res.data.data;

        this._getTim()
      }).catch( err => {
        this.onError(err)
        this.request = false
      });
    },

    _getTim(){
      this.request = true; this.tim = []

      this.axios.get('tim').then(res => {
        this.tim = res.data.data;
        this.request = false;
      }).catch( err => {
        this.onError(err)
        this.request = false
      });
    },

    _getListPrincipal() {
      this.getListPrincipal().then(res => {
        this.principal = res
      })
    }
  },

  watch: {
    "config.view": function(view) {
      if (view) {
        this.$emit("update:isSubmit", false);

        this.backdrop = true;
        setTimeout(() => {
          this.modal.open = view;
          if(this.users.length == 0) this._getUser()
          if(this.principal.length == 0) this._getListPrincipal()
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
        delete this.data.user_id

        for (const key in this.data) {
          if (key === 'id_principal') {
            this.data[key] = data[key].toString()
          } else {
            this.data[key] = data[key]
          }
        }
      }
    },

  }
};
</script>
