<template>
  <div class="antialiased">

    
    <div class="page">
      <div class="page-single">
        <div class="container">
          <div class="row">
            <div class="col col-login mx-auto">
              <div class="text-center mb-6">
                <!-- <img src="./demo/brand/tabler.svg" class="h-6" alt=""> -->
              </div>


              <transition name="slide-up">
                <div class="alert alert-danger" v-if="unauthorized">
                  <i class="fe fe-info mr-2"></i> Token expired, silahkan login ulang.
                </div>
              </transition>

              <form class="card" @submit.prevent="login">
                
                <div class="card-body">
                  <h2 class="twin float-left mr-4">Twin</h2>

                  <div class="card-title my-3 text-right" style="line-height: 17px">
                    Login to your account <br>
                    <small class="text-muted">Masukkan alamat email dan password</small>
                  </div>

                  <div class="form-group mt-5">
                    <label class="form-label"> Email</label>
                    <input type="email" :readonly="request" class="form-control" autofocus required maxlength="100" placeholder="Inputkan alamat email" v-model="data.email" autocomplete="off">
                  </div>

                  <div class="form-group" style="position: relative"> <i class="fe pass-visible" :class="obsecure ? 'fe-eye' : 'fe-eye-off'" @click="obsecure = !obsecure"></i>
                    <label class="form-label"> Password </label>
                    <input :type="obsecure ? 'password' : 'text'" :readonly="request" class="form-control" maxlength="15" required placeholder="Inputkan password" v-model="data.password">
                  </div>

                  <span class="click-able" @click="_forget" v-html="isCheckToken ? spin()+' Memeriksa token' : '<i class=\'fe fe-lock mr-1\'></i> Saya lupa password'"/>

                  <div class="form-footer">
                    <button type="submit" class="btn btn-primary btn-block" :disabled="request" v-html="request ? spin() : 'Login'"/>
                  </div>
                </div>
              </form>

              <div class="text-center text-muted">
                &copy; 2020, <router-link to="/"> PT Jangkar Teknologi Indonesia </router-link> <br> Version {{version}} <span v-if="apiUrl == 'https://kpm-api-test.kembarputra.com'">~ Development</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ForgetPass :config.sync="forget.config"/>

  </div>
</template>

<script>
  import helper from '@/assets/js/helper.js';
  import ForgetPass from "./modals/lupa-password.vue";

  export default {
    name: 'Login',
    components: { ForgetPass },

    mixins: [helper],
    data(){
      return {
        data: {
          email: '',
          password: '',
          remember: false
        },

        request: false,
        unauthorized: false,
        obsecure: true,
        isCheckToken: false,

        forget: {
          config: { view: false, title: null },
        },

        apiUrl: null
      }
    },
    methods: {

      login() {
        this.request = true;

        this.axios.post('login', this.data).then(res => {
          this.request = false;

          let user = res.data.user
              user.logged_at = this.dateTime()

          localStorage.authenticated = true;
          localStorage.token = res.data.token;
          localStorage.user = JSON.stringify(user);

          localStorage.permissions = JSON.stringify(res.data.permissions)

          this.$http.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.token;
          this.$router.push('/dashboard');
        }).catch(err => {
          this.onError(err)
          this.request = false
        });
      },

      _forget(){
        this.forget.config = {view: true, title: 'Lupa Password'}
      },

      _checkToken(){
        let token = localStorage.token
        this.isCheckToken = true
        
        this.axios.get('me').then(res => {
          this.$router.push('/dashboard');
        }).catch(() => {
          this.isCheckToken = false
          let user = JSON.parse(localStorage.user)
          this.data.email = user.email
        })
      }
    },

    mounted(){
      const url = new URLSearchParams(window.location.search);
      this.unauthorized = url.get('message') == 'unauthorized';

      this.apiUrl = process.env.VUE_APP_API_URL

      this._checkToken()

    }

  }
</script>

<style lang="scss" scoped src="./login.scss"/>