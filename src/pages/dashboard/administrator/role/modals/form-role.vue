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
            <div class="modal-body">

              <div class="form-group">
                <label for="" class="form-label">Nama Role</label>
                <input type="text" class="form-control" placeholder="Nama role" v-model="data.name" required ref="input">
              </div>

              <transition name="slide-up">
                <div class="form-group" v-if="permissions.length > 0">
                  <label for="" class="form-label">Permissions <transition name="slide-fade-x"> <span class="form-label-description click-able" v-if="permissFilter != null" @click="permissFilter = null">Tampilkan Semua</span> </transition> </label>

                  <div class="row">
                    <div class="col-8">

                      <div class="form-group">
                        <div class="input-group input-icon">
                          <span class="input-icon-addon" style="position: absolute; z-index: 99"> <i class="fe fe-search"></i> </span>
                          <input type="text" placeholder="Cari permission" class="form-control" v-model="keyword" ref="keyword" style="border-radius: 3px 0 0 3px">
                          <button type="button" class="btn btn-white dropdown-toggle dropdown-toggle-split" @click="modal.dropdown = !modal.dropdown" id="dropdown-menu"></button>
                          <div class="dropdown-menu dropdown-menu-right" :class="modal.dropdown ? 'show' : ''">
                            <span class="dropdown-item" :class="permissFilter == 1 ? 'active' : ''" v-html="'Checked'" @click="permissFilter = 1"> </span>
                            <span class="dropdown-item" :class="permissFilter == 2 ? 'active' : ''" v-html="'Unchecked'" @click="permissFilter = 2"/>
                          </div>
                        </div>
                      </div>

                    </div>
                    <div class="col-4 text-right">
                      <button type="button" class="btn btn-block" :class="data.permissions.length == permissions.length ? 'btn-primary' : 'btn-outline-secondary'" @click="_checkAll"> <i class="fe mr-2" :class="data.permissions.length == permissions.length ? 'fe-check' : 'fe-square'"></i> Pilih Semua </button>
                    </div>
                  </div>

                  <label class="form-check form-check-inline" v-for="(row, i) in filter" :key="i" v-show="permissFilter == null ? true : permissFilter == 1 && data.permissions.indexOf(row.id) > -1 ? true : permissFilter == 2 && data.permissions.indexOf(row.id) < 0 ? true : false">
                    <input class="form-check-input" type="checkbox" @click="_check(row.id)" :checked="data.permissions.indexOf(row.id) > -1">
                    <span class="form-check-label" v-html="row.name"/>
                  </label>
                </div>
              </transition>

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
        dropdown: false
      },

      permissFilter: null, request: true,

      permissions: [], filter: [], keyword: null,

      data: {
        name: null,
        permissions: []
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

    _getPermissions(){
      this.request = true

      this.axios.get('permission').then(res => {
        this.request = false;
        this.permissions = this.filter = res.data.data;

        setTimeout(() => {
          this.$refs.keyword.focus()
        }, 100);
      }).catch( err => {
        this.request = false
        this.onError(err)
      });
    },

    _check(id){
      let checked = this.data.permissions

      if(checked.indexOf(id) < 0){
        checked.push(id)
      }else{
        checked.splice(checked.indexOf(id), 1)
      }
    },

    _checkAll(){
      if(this.data.permissions.length != this.permissions.length){
        this.data.permissions = []

        for (let i = 0; i < this.permissions.length; i++) {
          this.data.permissions.push(this.permissions[i].id)       
        }
      }else{
        this.data.permissions = []
      }

      this.$refs.keyword.focus()
    }

  },

  mounted(){
    let self = this

    document.addEventListener('click', function(e) {
      if(e.target.id != 'dropdown-menu'){
        self.modal.dropdown = false
      }
    });

  },

  watch: {
    "config.view": function(view) {
      if (view) {
        this.$emit("update:isSubmit", false);

        this.backdrop = true;
        setTimeout(() => {
          this.modal.open = view;
          this.permissFilter = null
          this.keyword = null

          if(this.initData == null){
            this.$refs.input.focus()
          }else{
            if(this.$refs.keyword != null) this.$refs.keyword.focus()
          }

          this._getPermissions()
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
        this.request = true
        this.data.name = data.name
        this.data.permissions = []

        this.axios.get('role/'+data.id).then(res => {
          this.request = false;
          let permissions = res.data.data.permissions;
          
          // fill permissions
          for (let i = 0; i < permissions.length; i++) {
            this.data.permissions.push(permissions[i].id)
          }
          
        }).catch( err => {
          this.request = false
          this.onError(err)
        });
      }
    },

    keyword: function(val){
      let k = val.toString().toLowerCase(); this.filter = []
      let data = this.permissions;

      for (let i = 0; i < data.length; i++) {
        if(data[i].name.toString().toLowerCase().includes(k)){
          this.filter.push(data[i])
        }
      }
    },
  }
};
</script>
