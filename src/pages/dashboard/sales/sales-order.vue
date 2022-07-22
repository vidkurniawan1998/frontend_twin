<template>
  <div class="antialiased">

    <Sidebar/>


    <div class="page">
      
      <Header/>

      <div class="content">
        <div class="container">
          <!-- Page title -->
          <div class="page-header">
            <div class="row align-items-center">
              <div class="col-auto">
                <h2 class="page-title">
                  Sales Order
                </h2>
              </div>

              <div class="col-auto">
                <div class="text-muted text-h5 mt-2">Login Pada {{auth.logged_at}}</div>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6">
              <div class="card">
                <div class="card-body">
                  
                </div>
              </div>
            </div>
          </div>


        </div>
      </div>

    </div>

  </div>
</template>

<script>
import helper from "@/assets/js/helper.js";

export default {
  name: "Stock",
  components: { },

  data() {
    return {
      navbar: {
        collapsed: false
      },

      auth: {}
    };
  },

  mixins: [helper],

  methods: {
    _navbar() {
      this.navbar.collapsed = !this.navbar.collapsed;
    },
  },

  mounted(){
    this.auth = JSON.parse(localStorage.user)
  }

};
</script>
