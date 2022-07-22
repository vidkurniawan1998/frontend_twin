<template>
  <div v-if="backdrop">
    <div
      class="modal modal-blur fade"
      :class="modal.open ? 'show' : ''"
      style="display: block"
      tabindex="-1"
      role="dialog"
      aria-hidden="true"
      @click="$event.target.classList.contains('modal') ? close() : true"
    >
      <div class="modal-dialog modal-md modal-dialog-centered" role="document">
        <div class="modal-content" style="overflow: hidden">
          <div class="modal-header">
            <h5 class="modal-title text-dark">{{config.title == null ? '&nbsp;' : config.title}}</h5>
            <button type="button" class="close" @click="close()" v-html="ic('close')"/>
          </div>

          <div class="modal-body text-left pb-0 text-dark">

            <div class="form-group">
              <div class="form-label">Password Lama</div>
              <input type="password" placeholder="Inputkan password sebelumnya" v-model="data.old_pass" class="form-control">
            </div>

            <div class="form-group">
              <div class="form-label">Password Baru</div>
              <input type="password" placeholder="Inputkan password baru" v-model="data.password" class="form-control">
            </div>

            <div class="form-group">
              <div class="form-label">Konfirmasi Password Baru</div>
              <input type="password" placeholder="Konfirmasi password baru" v-model="data.conf_pass" class="form-control">
            </div>
            
          </div>

          <div class="modal-footer" style="padding-top: 15px">
            <button type="button" class="btn btn-white" @click="close()" v-html="'Tutup'" />
            <button type="button" class="btn btn-primary" @click="_savePassword" :disabled="isSave" v-html="isSave ? spin() : 'Simpan'" />
          </div>

        </div>
      </div>
    </div>

    <div class="modal-backdrop fade" :class="modal.open ? 'show' : ''" />
  </div>
</template>

<script>
import helper from "@/assets/js/helper.js";
const fb = require('@/db.js');

export default {
  name: "Modal",
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

      auth: {},
      isSave: false,

      data: {
        old_pass: '',
        password: '',
        conf_pass: ''
      }

    };
  },

  methods: {
    close() {
      this.$emit("update:config", { view: false });
    },

    async _savePassword(){
      let auth = this.auth

      if(this.data.old_pass != auth.account.password){
        this.toast('Password salah')
      }else{
        if(this.data.password != this.data.conf_pass){
          this.toast('Konfirmasi password salah')
        }else{
          if(this.data.password.length < 6){
            this.toast('Password min 6 karakter')
          }else{
            this.isSave = true
            await fb.firestore.collection('users').doc(auth.uid).update({'account.password': this.data.password});

            // update local data
            auth.password = this.data.password

            let authToString = JSON.stringify(auth);
            localStorage.token = this.encrypt(JSON.stringify(this.dateTime('date')+'|'+authToString), this.secretKey); // this.secretKey -> main.js
            
            this.toast('Berhasil diperbarui')
            this.isSave = false
            this.close()
          }
        }
      }
    }
  },

  mounted(){
    this.auth = this.getAuth('auth')
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

    initData: function() {
      
    },

  }
};
</script>

<style lang="scss" scoped src="./profile.scss"/>