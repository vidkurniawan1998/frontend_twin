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
                  Stock
                </h2>
              </div>

              <!-- <div class="col-auto">
                <div class="text-muted text-h5 mt-2">Login Pada {{auth.logged_at}}</div>
              </div> -->
            </div>
          </div>

            <Skeleton type="table" :length="5" class="mt-3 bg-white"/>


          


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
      auth: {},

      loading: true
    };
  },

  mixins: [helper],

  methods: {
    
  },

  mounted(){
    this.auth = JSON.parse(localStorage.user)
  }

};
</script>
