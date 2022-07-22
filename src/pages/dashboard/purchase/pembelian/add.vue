<template>
  <div class="antialiased">
    <Sidebar/>
    <div class="page">
      <Header hint="Cari" :enabled="false"/>
      <div class="content">
        <div class="container">
          <div class="page-header">
            <div class="row d-flex justify-content-between">
              <div class="col-auto">
                <h2 class="page-title" v-html="this.$route.params.id ? 'Edit Faktur Pembelian':'Tambah Faktur Pembelian'">
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
                <form-faktur-pembelian></form-faktur-pembelian>
                <div class="row" style="margin-top: 20px;float: right">
                  <div class="col-12">
                    <button class="btn btn-primary" :disabled="loading" @click="submit()" v-html="loading ? spin():'Simpan'"></button>
                    &nbsp;
                    <button class="btn btn-danger" @click="$router.push({name: 'Data Pembelian'})">Batal</button>
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
import {mapState, mapActions } from 'vuex'
import helper from "@/assets/js/helper.js"
import formFakturPembelian from './form'
export default {
  mixins: [helper],
  computed: {
    ...mapState(['loading'])
  },
  components: {
    'form-faktur-pembelian' : formFakturPembelian
  },
  methods:{
    ...mapActions('faktur_pembelian', ['submitFaktur']),
    submit() {
      this.submitFaktur()
    }
  }
}
</script>
