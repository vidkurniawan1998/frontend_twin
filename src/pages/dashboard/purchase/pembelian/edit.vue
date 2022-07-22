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
                    <button
                        v-if="faktur_pembelian.status === 'input'"
                        class="btn btn-primary"
                        :disabled="loading"
                        @click="updateFaktur(faktur_pembelian.id)"
                        v-html="loading ? spin() : 'Simpan'">
                    </button>
                    &nbsp;
                    <button
                        v-if="faktur_pembelian.status === 'input'"
                        class="btn btn-primary"
                        :disabled="loading"
                        @click="approve(faktur_pembelian.id)"
                        v-html="loading ? spin() : 'Setujui'">
                    </button>

                    <button
                        v-if="faktur_pembelian.status === 'approved'"
                        class="btn btn-primary"
                        :disabled="loading"
                        @click="unapprove(faktur_pembelian.id)"
                        v-html="loading ? spin() : 'Batal Setujui'">
                    </button>
                    &nbsp;
                    <button
                        :disabled="loading"
                        class="btn btn-danger"
                        @click="$router.push({name: 'Data Pembelian'})">
                      Batal
                    </button>
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
    ...mapState(['loading']),
    ...mapState('faktur_pembelian', {
      faktur_pembelian: state => state.faktur_pembelian
    })
  },
  components: {
    'form-faktur-pembelian' : formFakturPembelian
  },
  methods:{
    ...mapActions('faktur_pembelian', [
        'submitFaktur', 'editFaktur', 'updateFaktur', 'unapprove', 'approve'
    ])
  },
  created() {
    if(this.$route.params.id) {
      this.editFaktur(this.$route.params.id)
    }
  }
}
</script>
