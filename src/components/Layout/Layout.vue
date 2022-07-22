<template>
  <div class="">
    <!-- <sidebar v-if="user != null && user.account.role == 'admin'"/> -->

    <div>
      <keep-alive>
        <router-view/>
      </keep-alive>
    </div>

    <transition name="slide-fade-y">
      <div class="fire-notif" v-if="showNotif">
        <h3><i class="la la-lg la-info-circle mr-2"></i> <b style="letter-spacing: 3px">NEW UPDATE!</b> </h3>

        <div>Terdapat pembaruan pada aplikasi Twin, silahkan tekan Ctrl + Shift + R secara bersamaan untuk mendapatkan versi terbaru.</div>
        <transition name="slide-fade-y">
          <div class="mt-4" v-if="viewUpdate">
            <h4>Daftar Pembaruan</h4>

            <ul class="list-update">
              <li>Lorem ipsum dolor</li>
              <li>sit amet consectetur</li>
              <li>hutem hu ds</li>
            </ul>
          </div>
        </transition>

<!--        <div class="text-right mt-3">-->
<!--          <transition name="slide-up">-->
<!--            <button class="btn btn-danger" @click="viewUpdate = true" v-if="!viewUpdate">Lihat Daftar Pembaruan</button>-->
<!--          </transition>-->
<!--        </div>-->

      </div>
    </transition>

  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

// import Sidebar from '@/components/Sidebar/Sidebar';
// import Header from '@/components/Header/Header';

import './Layout.scss';
const fb = require('@/db.js');

export default {
  name: 'Layout',
  components: { },
  data(){
    return {
      user: null,
      routeVisible: ['Penjualan','detail-penjualan'],

      showNotif: false, viewUpdate: false
    }
  },

  methods: {
    ...mapActions(
      'layout', ['switchSidebar', 'handleSwipe', 'changeSidebarActive'],
    ),

    checkRoute(){
      // this.control.header = true;
      // if(this.routeVisible.indexOf(this.$route.name) > -1){
      //   this.control.header = false;
      // }
    },

    _getAppUpdate(){
      fb.firestore.collection('version').doc('twinapp').onSnapshot((doc) => {
        this.showNotif = false

        if(this.version != doc.data().version){
          this.showNotif = true
        }
      });
    }

  },
  computed: {
    ...mapState('layout', {
      sidebarClose: state => state.sidebarClose,
      sidebarStatic: state => state.sidebarStatic,
    }),

  },

  mounted(){
    this._getAppUpdate()
    // let token = localStorage.token;
    // this.user = this.getAuth(token, 'auth');
  },

  created() {
    this.checkRoute();
    const staticSidebar = true // JSON.parse(localStorage.getItem('sidebarStatic'));

    if (staticSidebar) {
      this.$store.state.layout.sidebarStatic = true;
    } else if (!this.sidebarClose) {
      setTimeout(() => {
        this.switchSidebar(true);
        this.changeSidebarActive(null);
      }, 0);
    }
  },

  watch: {
    // '$route.name': function(route){
    //   this.control.header = true;
    //   if(this.routeVisible.indexOf(route) > -1){
    //     this.control.header = false;
    //   }
    // }
  }



};
</script>

<style src="./Layout.scss" lang="scss" />
