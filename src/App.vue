<template>
  <router-view :key="$route.fullPath" />
</template>

<script>

import helper from '@/assets/js/helper.js';

export default {
  name: 'App',
  data(){
    return {
      user: null
    }
  },

  mixins: [helper],

  methods: {

    authorization(){
      let token = localStorage.token

      if(this.$route.name != 'Login'){
        if(token == undefined){
          this.$router.push('/')
        }else{
          this.user = this.getAuth('auth')

          const currentPath = this.$router.history.current.path;
          if(currentPath === '/' || currentPath === '/app'){
            this.$router.push('/dashboard');
          }
        }
      }else{ // if route is login page
        if(token != undefined){
          let auth = this.getAuth('auth')
          if(auth != null){
            if(auth.remember) this.$router.push('/dashboard');
          }
        }
      }
    }
  },

  mounted(){
    // this.authorization();
  },

  created() {
    // const currentPath = this.$router.history.current.path;

    // if (window.localStorage.getItem('token') == undefined) {
    //   this.$router.push('/login')
    // }

    // if (currentPath === '/' || currentPath === '/app') {
    //   this.$router.push('/app/dashboard');
    // }
  },

  watch: {
    '$route' (){
      // this.authorization()
    },
  }

};
</script>

<style src="./styles/theme.scss" lang="scss" />
