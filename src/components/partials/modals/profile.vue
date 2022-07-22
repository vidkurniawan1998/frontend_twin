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
        <div class="modal-content" style="overflow: hidden">
          <div class="modal-header">
            <h5 class="modal-title text-dark">{{config.title == null ? '&nbsp;' : config.title}}</h5>
            <button type="button" class="close" @click="close()" v-html="ic('close')"/>
          </div>

          <div class="modal-body text-center pb-0 text-dark">

            <img :src="asset('profile.png')" class="avatar avatar-xl" alt="">
            <h2 v-html="auth.name" class="my-3"></h2>

            <div class="card-tabs">
              <ul class="nav nav-tabs">
                <li class="nav-item" @click="_tab(1)"><a href="javascript:void(0)" class="nav-link" :class="tab == 1 ? 'active' : ''"> <i class="fe fe-user"></i> &nbsp;<span class="ml-1" :class="tab == 1 ? '' : 'd-none d-md-block'">Biodata</span></a></li>
                <!-- <li class="nav-item" @click="_tab(2)"><a href="javascript:void(0)" class="nav-link" :class="tab == 2 ? 'active' : ''"> <i class="fe fe-phone"></i> &nbsp;<span class="ml-1" :class="tab == 2 ? '' : 'd-none d-md-block'">Kontak</span></a></li> -->
                <!-- <li class="nav-item" @click="_tab(3)"><a href="javascript:void(0)" class="nav-link" :class="tab == 3 ? 'active' : ''"> <i class="fe fe-briefcase"></i> &nbsp;<span class="ml-1" :class="tab == 3 ? '' : 'd-none d-md-block'">Pekerjaan</span></a></li> -->
              </ul>

              <div class="tab-content text-left">

                <div class="tab-pane m-0 active show">
                  <div class="bg-white">
                    <ul class="list-group">
                      <li class="list-group-item text-dark" v-for="(row,i) in data" :key="i">
                        <b v-html="row.label"/> <br> {{row.value}}
                      </li>
                    </ul>
                  </div>
                </div>
                
              </div>
            </div>
          </div>

          <div class="modal-footer" style="padding-top: 15px">
            <button type="button" class="btn btn-white" @click="close()" v-html="'Tutup'" />
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

      tab: 1,
      auth: {},

      
      data: [], isEdit: false, about: null, isSave: false

    };
  },

  methods: {
    close() {
      this.$emit("update:config", { view: false });
    },

    _tab(t){
      this.tab = t
      let auth = this.auth

      this.data = []

      // fill data by tab
      switch (t) {
        case 1: {
          let labels = ['nama lengkap','email','role','status'],
              values = [auth.name,auth.email,auth.role,auth.status]

          for (let i = 0; i < labels.length; i++) {
            this.data.push({label: this.ucwords(labels[i]), value: values[i]})
          }
          
          break;
        }

        case 2: {
          let labels = ['email','no. telepon'],
              values = [auth.account.email,auth.account.telepon]

          for (let i = 0; i < labels.length; i++) {
            this.data.push({label: this.ucwords(labels[i]), value: values[i]})
          }
          
          break;
        }
      
        case 3: {
          let p = auth.pekerjaan

          let labels = ['bekerja sejak','posisi','departemen','kepala departemen / atasan','grade','jam masuk','jam pulang','depo','perusahaan','deskripsi pekerjaan'],
              values = [p.bekerja_sejak, p.posisi, auth.departemen.nama_departemen, auth.departemen.nama_kepala_departemen, p.grade, '08:00', '17:00 (Senin - Jumat), 14:00 (Sabtu)', p.depo, p.perusahaan, p.deskripsi_pekerjaan]

          for (let i = 0; i < labels.length; i++) {
            this.data.push({label: this.ucwords(labels[i]), value: values[i]})
          }
          
          break;
        }
      }
    },

  },

  mounted(){
    this.auth = JSON.parse(localStorage.user);
  },

  watch: {
    "config.view": function(view) {
      if (view) {
        this.$emit("update:isSubmit", false);

        this.backdrop = true;
        setTimeout(() => {
          this.modal.open = view;
          this._tab(1)
        }, 100);
      } else {
        this.modal.open = view;
        this.showDetail = false

        setTimeout(() => {
          this.backdrop = view;
          this.isEdit = false
        }, 100);
      }
    },

    initData: function() { },

  }
};
</script>

<style lang="scss" scoped src="./profile.scss"/>