<template>
  <header class="navbar navbar-expand-md navbar-light d-none d-lg-flex">
    <div class="container-xl">
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar-menu">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="navbar-nav flex-row order-md-last">

        <div class="nav-item dropdown d-none d-md-flex mr-3" @click="_mode" v-if="apiUrl == 'https://kpm-api-test.kembarputra.com'">
          <span class="nav-link click-able">
            <i class="fe fe-code mr-2"></i> Development
          </span>
        </div>

        <div class="nav-item dropdown">

          <span class="nav-link d-flex lh-1 text-reset p-0 profile click-able" @click="_dropdown" id="p_">
            <span class="avatar block-event" :style="'background-image: url('+asset('profile.png')+')'"></span>
            <div class="d-none d-xl-block pl-2 block-event">
              <div v-html="auth.name == null ? '-' : auth.name"/>
              <div class="mt-1 small text-muted" v-html="auth.role == null ? '-' : auth.role"/>
            </div>
          </span>

          <div class="dropdown-menu dropdown-menu-right" :class="dropdown.profile ? 'show': ''">
            <span class="dropdown-item cursor-pointer" @click="_profile"> <i class="fe fe-user mr-2"></i> Profil </span>
            <span class="dropdown-item cursor-pointer" @click="_password"> <i class="fe fe-lock mr-2"></i> Ganti Password </span>
            <div class="dropdown-divider"></div>
            <span class="dropdown-item cursor-pointer" @click="_logout"> <i class="fe fe-log-out mr-2"></i> Logout </span>
          </div>
        </div>
      </div>
      <div class="collapse navbar-collapse" id="navbar-menu">
        <div>
            <div class="input-icon">
              <i class="search-clear fe" :class="keyword.length > 0 ? 'fe-x' : 'fe-search disabled'" @click="keyword = ''"></i>
              <!-- <span class="input-icon-addon"> <i class="fe fe-search"></i> </span> -->
              <input type="text" style="width: 250px" class="form-control form-control-rounded" id="tsearch" :placeholder="hint" v-model="keyword" @change="onChange" @keyup="onKeyup" :disabled="disabledSearch || !enabled">
            </div>
        </div>
        <div v-if="enabledRefresh">
          <button class="btn btn-light btn-pill ml-3" v-html="ic('refresh')" @click="onRefresh"></button>
        </div>
      </div>
    </div>

    <Mode :config.sync="mode.config" />

    <LogoutModal :config.sync="logout.config" />
    <Profile :config.sync="profile.config" />

    <FormPassword
      :config.sync="password.config" :dismiss.sync="password.dismiss"
      :isSubmit.sync="password.isSubmit"
      @submit="password.action"
    />
    

  </header>
</template>

<script>
import helper from '@/assets/js/helper.js';
  
import Profile from "./modals/profile.vue";
import Mode from "./modals/mode.vue";
import LogoutModal from "./modals/logout.vue";
import FormPassword from "./modals/form-password.vue";

export default {
  name: "Header",
  props: {
    disabledSearch: {default: false},
    enabled: {default: true}, enabledRefresh: {default: false},
    hint: {default: 'Cari...'},

  },

  components: { LogoutModal, Profile, FormPassword, Mode },

  data() {
    return {
      auth: {},
      dropdown: {
        profile: false
      },

      mode: { config: { view: false, title: null }},
      logout: { config: { view: false, title: null }},
      profile: { config: { view: false, title: null }},

      password: {
        config: { view: false, title: null },
        isSubmit: false,
        action: () => {}
      },

      keyword: '',
      apiUrl: null
    };
  },

  mixins: [helper],

  methods: {
    _dropdown(){
      this.dropdown.profile = !this.dropdown.profile
    },

    onChange(){
      this.$emit("change", this.keyword);
    },

    onKeyup(){
      this.$emit("keyup", this.keyword);
    },

    onRefresh(){
      this.keyword = ''
      this.$emit("refresh");
    },

    _mode(){
      this.mode.config = {view: true}
    },


    // logout
    _logout(){
      this.logout.config = {view: true}
    },

    _profile(){
      this.profile.config = {view: true, title: 'Profil Saya'}
    },

    _password(){
      this.password.config = {view: true, title: 'Ganti Password'}
      this.password.action = (formData) => {
        this.axios.put("user/change_my_password", formData).then(() => {
          this.toast('Berhasil diperbarui');
          this.password.config.view = false;
        }).catch( err => {
          this.onError(err);
          this.password.isSubmit = false;
        });
      }
    }
  },

  mounted(){
    this.auth = JSON.parse(localStorage.user)
    this.apiUrl = process.env.VUE_APP_API_URL

    let self = this

    document.addEventListener('click', function(e) {
      if(e.target.id != 'p_'){
        self.dropdown.profile = false
      }
    });
     
  }

};
</script>

<style lang="scss" scoped src="./partials.scss"/>