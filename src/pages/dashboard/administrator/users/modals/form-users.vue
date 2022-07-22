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
      <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{config.title == null ? '&nbsp;' : config.title}}</h5>
            <button type="button" class="btn-link btn px-0" @click="_getRoles" v-html="ic('refresh')" :disabled="request"/>
            <button type="button" class="close" @click="close()" v-html="request ? spin() : ic('close')"/>
          </div>

          <form @submit.prevent="submit">
            <div class="modal-body" ref="modal">
              <div class="row">
                <div class="col-6 form-group">
                  <label for="" class="form-label">NIK</label>
                  <input type="tel" maxlength="16" @keypress="numberOnly($event)" class="form-control" placeholder="NIK" v-model="data.nik" ref="focus">
                </div>

                <div class="col-6 form-group">
                  <label for="" class="form-label">Nama</label>
                  <input type="text" class="form-control" placeholder="Nama lengkap" v-model="data.name" required>
                </div>
              </div>

              <div class="row">
                <div class="col-6 form-group">
                  <label for="" class="form-label">Email</label>
                  <input type="email" class="form-control" placeholder="Email" v-model="data.email" required autocomplete="off">
                </div>

                <div class="col-6 form-group">
                  <label for="" class="form-label">Nomor Telepon</label>
                  <input type="tel" @keypress="numberOnly($event)" maxlength="13" class="form-control" placeholder="Nomor telepon" v-model="data.phone" required>
                </div>
              </div>

              <div class="row">
                <div class="col-6 form-group" @click="_scrollTo('modal')">
                  <label class="form-label">Perusahaan</label>
                  <selectize v-model="data.perusahaan" data-placeholder="Pilih Perusahaan" :settings="selectizeConfig" @input="_getDepo($event)" required :disabled="loading">
                    <option :value="row.id" v-for="(row, i) in perusahaan" :key="i">
                      {{row.kode_perusahaan}} - {{row.nama_perusahaan}}
                    </option>
                  </selectize>
                </div>

                <div class="col-6 form-group" @click="_scrollTo('modal')">
                  <label class="form-label">Depo</label>
                  <selectize v-model="data.depo" data-placeholder="Pilih Depo" :settings="selectizeConfig" required :disabled="request">
                    <option :value="row.id" v-for="(row, i) in depos" :key="i">
                      {{row.nama_depo}} - {{row.perusahaan.kode_perusahaan}}
                    </option>
                  </selectize>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Role</label>
                <selectize v-model="data.roles" data-placeholder="Pilih Role" :settings="selectizeConfig" required :disabled="request">
                  <option :value="row.id" v-for="(row, i) in roles" :key="i">
                    {{row.name}}
                  </option>
                </selectize>
              </div>

              <div class="form-group" @click="_scrollTo('modal')">
                <label class="form-label">Gudang</label>
                <selectize v-model="data.gudang" data-placeholder="Pilih Gudang" :settings="selectizeConfig" :disabled="request">
                  <option :value="row.id" v-for="(row, i) in gudangs" :key="i">
                    {{row.nama_gudang}}
                  </option>
                </selectize>
              </div>

              <div class="form-group" v-if="initData == null">
                <label for="" class="form-label">Password</label>
                <input type="password" class="form-control" placeholder="Password" v-model="data.password" required>
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

      selectizeConfig: {
        maxItems: 99,
        plugins: ["remove_button"]
      },

      request: false, roles: [], depos: [], gudangs: [], perusahaan: [],

      data: {
        nik: '',
        name: null,
        email: null,
        phone: null,
        roles: [],
        depo: [],
        gudang: [],
        perusahaan: [],
        status: 'active',
        password: null,
        password_confirmation: null,
      },

    };
  },

  computed: {
    ...mapState(['loading'])
  },

  methods: {
    ...mapActions('perusahaan', ['getListPerusahaan']),
    ...mapActions('depo', ['getListDepo']),
    close() {
      this.$emit("update:config", { view: false });
    },

    submit() {
      if(this.initData == null){
        if(this.data.password.length < 6){
          this.toast('Minimal password 6 karakter'); return
        }else{
          if(this.data.password !== this.data.password_confirmation){
            this.toast('Konfirmasi password salah'); return
          }
        }
      }else{
        delete this.data.password
        delete this.data.password_confirmation
      }

      this.$emit('update:isSubmit', true)
      this.$emit('submit', this.data);
    },

    _getPerusahaan() {
      this.getListPerusahaan().then( res => {
        this.perusahaan = res.data
      })
    },

    _getRoles(){
      this.request = true

      this.axios.get('role').then(res => {
        this.roles = res.data.data;
        this.request = false
      }).catch(err => {
        this.onError(err);
        this.request = false
      });
    },

    _getDepo(id){
      if (typeof id === 'undefined' || id.length === 0) {
        this.depos = []
      } else {
        this.getListDepo({id_perusahaan: id, filter: true}).then(res => {
          this.depos = res
        })
      }
    },
    _getGudang(){
      this.request = true

      this.axios.get('gudang').then( res => {
        this.gudangs = res.data.data;
        this.request = false
      }).catch( err => {
        this.onError(err)
        this.request = false
      });
    },

  },

  watch: {
    "config.view": function(view) {
      if (view) {
        this.$emit("update:isSubmit", false);

        this.backdrop = true;
        setTimeout(() => {
          this.modal.open = view;
          this.$refs.focus.focus()
          this._getPerusahaan()
          this._getRoles()
          this._getGudang()
        }, 100);
      } else {
        this.modal.open = view;

        setTimeout(() => {
          this.backdrop = view;
        }, 100);
      }
    },

    initData: function(data) {
      Object.assign(this.$data.data, this.$options.data.call(this).data);

      if(data != null){
        delete this.data.password
        delete this.data.password_confirmation

        for (const key in this.data) {
          if(key != 'roles' && key != 'depo' && key != 'gudang' && key != 'perusahaan') this.data[key] = data[key]
        }

        this.data.perusahaan  = Array.from(data.perusahaan, comp => comp.id) // company
        this.data.roles       = Array.from(data.roles, role => role.id) // role
        this.data.depo        = Array.from(data.depo, dep => dep.id) // depo atau branch
        this.data.gudang      = Array.from(data.gudang, wr => wr.id) // warehouse

        this._getDepo(this.data.perusahaan)
      }
    },

  }
};
</script>
