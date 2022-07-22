<template>
  <div class="antialiased">
    <Sidebar/>
    <div class="page">
      <Header/>
      <div class="content">
        <div class="container">
          <div class="page-header">
            <div class="row d-flex justify-content-between">
              <div class="col-auto">
                <h2 class="page-title" v-html="this.$route.params.id ? 'Edit Promo':'Tambah Promo'">
                </h2>
              </div>
              <div class="col-auto">
                <h2 v-html="loading ? spin() : ''">
                </h2>
              </div>
            </div>
          </div>
          <div class="box">
            <div class="card">
              <div class="card-body">
                <form-promo></form-promo>
                <div class="row" style="margin-top: 20px">
                  <div class="col-12">
                    <button class="btn btn-primary" :disabled="loading" @click="submit()" v-html="loading ? spin():'Simpan'"></button>
                    &nbsp;
                    <button class="btn btn-danger" @click="$router.push({name: 'Promo'})">Batal</button>
                  </div>
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
import formPromo from './form'
import {mapActions, mapState} from "vuex";
import helper from "@/assets/js/helper.js";
export default {
  mixins: [helper],
  computed: {
    ...mapState(['loading'])
  },
  components: {
    'form-promo' : formPromo
  },
  methods: {
    ...mapActions('promo', ['editPromo', 'updatePromo']),
    submit() {
      this.updatePromo(this.$route.params.id).then(() => {
        this.$router.push({name: 'Promo'})
      })
    }
  },
  created() {
    if(this.$route.params.id) {
      this.editPromo(this.$route.params.id)
    }
  }
}
</script>
