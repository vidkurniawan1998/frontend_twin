<template>
  <div class="antialiased">

    <Sidebar/>


    <div class="page">

      <Header :enabled="false"/>

      <div class="content">
        <div class="container">
          <!-- Page title -->
          <div class="page-header">
            <div class="row align-items-center">
              <div class="col-auto">
                <h2 class="page-title">
                  Dashboard
                </h2>
              </div>

              <div class="col-auto">
                <div class="text-muted text-h5 mt-2">Login Pada {{auth.logged_at}}</div>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-lg-5">
              <div class="card">
                <div class="card-body">
                  <strong class="h3">Hai, {{auth.name}}</strong> <br>
                  Selamat datang di <b>Twin App</b> <br> <br>

                  <i class="fe fe-info mr-2"></i> <b>Twin</b> adalah aplikasi yang sama dengan versi yang telah dikembangkan dari aplikasi sebelumnya. Apapun yang Anda butuhkan untuk memudahkan pekerjaan Anda, jangan ragu untuk memberitahukan kepada Tim IT kami.

                  <br><br>

                  <div class="text-right"> App Version {{version}}<br><b> PT Jangkar Teknologi Indonesia </b> </div>
                </div>
              </div>

              <div class="card">
                <div class="card-body">
                  <strong class="h3">Informasi Perangkat</strong> <br>

                  <ul class="list-group mt-2">
                    <li class="list-group-item p-0" style="border: none"> <b>Sistem Operasi</b> <span v-html="device.os" class="float-right"/> </li>
                    <li class="list-group-item p-0" style="border: none"> <b>Browser</b> <span v-html="device.browser" class="float-right"/> </li>
                  </ul>
                  <br>
                  <button class="btn btn-outline-primary float-right"
                    @click="clearCache()"
                    :disabled="request"
                    v-html="request ? spin():'Clear Cache'">
                  </button>
                </div>
              </div>
            </div>

            <div class="col-lg-7">
              <div class="alert alert-info">
                <i class="la la-lg la-info-circle mr-1"></i> Semua hal yang Anda lakukan di Twin akan dicatat oleh sistem. Kami menggunakan google analitik untuk mengetahui halaman apa saja yang Anda buka beserta tanggal dan waktunya.
              </div>

              <div class="card">
                <div class="card-header">
                  <h4 class="card-title">Riwayat Aktivitas ({{paginate.page+' / '+logs.totalPage}}) </h4>
                  <div class="card-options">
                    <div class="btn-group">
                      <button class="btn btn-outline-primary btn-pill tt-top" tooltip="Muat Sebelumnya" :disabled="isLoadMore || paginate.page == 1" @click="_prev" v-html="ic('arrow-left')"> </button>
                      <button class="btn btn-outline-primary btn-pill tt-top" tooltip="Muat Lainnya" :disabled="isLoadMore || paginate.page == logs.totalPage" @click="_more" v-html="ic('arrow-right')"> </button>
                    </div>
                  </div>
                </div>
                <div class="card-body p-0">

                  <div class="px-3 py-2">
                    <div class="input-icon">
                      <span class="input-icon-addon" v-html="isLoadMore ? spin() : ic('search')">
                        <i class="fe fe-search"></i>
                      </span>
                      <input type="text" class="form-control" v-model="paginate.keyword" placeholder="Cari riwayat aktivitas" @keypress="_searchLog($event)">
                    </div>
                  </div>


                  <ul class="list-group borderless">
                    <li v-for="(row, i) in logs.data" :key="i" class="list-group-item">
                      <div class="pull-right text-right">
                        <small class="text-muted" v-html="row.timestamp"></small> <br>
                        <small class="text-muted" v-html="row.user"></small>
                      </div>

                      <b v-html="row.action"></b> <br>
                      <small v-html="row.description"></small>
                    </li>
                  </ul>
                </div>
              </div>

            </div>
          </div>

          <Modal :config.sync="modal.config">
            <template v-slot:modal-control>
              <button type="button" v-html="ic('printer')"/>
              <button type="button" v-html="ic('plus')"/>
            </template>

            <template v-slot:body>
              r sit amet consectetur adipisicing elit. Vitae quia eveniet enim veritatis, ratione, qui veniam nulla labore ea adipisci tempore atque deserunt odit minima esse aliquid amet maiores sint!
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Totam libero, sequi suscipit impedit dolores assumenda animi eligendi asperiores ut in quasi maxime facere consequatur, aperiam culpa quas, a quo accusantium?
            </template>

            <template v-slot:footer>
              <button type="button" class="btn btn-primary" v-html="ic('check')+' Approve'"/>
            </template>


          </Modal>


        </div>
      </div>


    </div>

  </div>
</template>

<script>
import helper from "@/assets/js/helper.js";
import Modal from '@/components/comps/modals/modal';

export default {
  name: "Dashboard",
  components: { Modal },

  data() {
    return {
      navbar: {
        collapsed: false
      },

      auth: {}, device: {}, request: true, isLoadMore: false,

      modal: {
        config: { view: false },
        data: null, isSubmit: false,
        action: () => {}
      },

      paginate: {
        per_page: 10,
        page: 1,
        keyword: ''
      },

      logs: {
        data: [],
        total: 0,
        totalPage: 0
      }

    };
  },

  mixins: [helper],

  methods: {
    _navbar() {
      this.navbar.collapsed = !this.navbar.collapsed;
    },

    _open(){
      // this.modal.config = {
      //   view: true,
      //   title: 'Lorem Ipsum Dolor',
      //   expandable: true,
      //   autoexpanded: true
      // }
    },

    _getDevice(){
      let userAgent = ['Windows NT 10.0','Windows NT 6.2','Windows NT 6.1','Windows NT 6.0','Windows NT 5.1','Windows NT 5.0','Mac','X11','Linux'],
          devices = ['Windows 10','Windows 8','Windows 7','Windows Vista','Windows XP','Windows 2000','Mac/iOS','UNIX','Linux'],
          osName = 'Tidak diketahui'

      for (let i = 0; i < userAgent.length; i++) {
        if( window.navigator.userAgent.indexOf(userAgent[i]) != -1 ){
          osName = devices[i]
        }
      }

      this.device.os = osName

    },

    _getLogs(){
      this.request = true
      this.axios.get('logs', {params: this.paginate}).then(res => {
        this.request = false
        this.isLoadMore = false

        this.logs.data = res.data.data

        let meta = res.data.meta
        this.logs.total = meta.total
        this.logs.totalPage = meta.last_page

        this.paginate.per_page = meta.per_page
        this.paginate.page = meta.current_page

      }).catch(err => {
        this.request = false
        this.onError(err)
      })
    },

    _prev(){
      this.isLoadMore = true
      this.paginate.page--

      this._getLogs()

    },

    _more(){
      this.isLoadMore = true
      this.paginate.page++

      this._getLogs()
    },

    _searchLog(e){
      if(e.keyCode == 13){
        this.paginate.page = 1
        this._getLogs()
      }
    },

    clearCache() {
      this.request = true
      this.axios.get('/')
        .then( res => {
          this.request = false
        })
        .catch(err => {
          this.request = false
          this.onError(err)
        })
    }
  },

  mounted(){
    this.auth = JSON.parse(localStorage.user)
    this._getDevice()
    this._getLogs()
    this.device.browser = this.browser()
  }

};
</script>

<style lang="scss" scoped src="./dashboard.scss"/>
