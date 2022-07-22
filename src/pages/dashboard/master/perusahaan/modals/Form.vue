<template>
  <div v-if="form">
    <div class="modal fade"
      tabindex="-1"
      style="display: block"
      role="dialog"
      v-if="form"
      :class="form ? 'show':''"
    >
      <div class="modal-dialog modal-md modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ title }}</h5>
            <button type="button" class="close" @click="form = false" v-html="ic('close')"/>
          </div>
          <form v-on:submit.prevent="saveData()">
            <div class="modal-body default">
              <div class="row">
                <div class="col-12 form-group">
                  <label for="kode-perusahaan">Kode Perusahaan</label>
                  <input
                      v-model="perusahaan.kode_perusahaan"
                      type="text"
                      class="form-control"
                      placeholder="Inputkan Kode Perusahaan"
                      id="kode-perusahaan">
                </div>
              </div>
              <div class="row">
                <div class="col-12 form-group">
                  <label for="nama-perusahaan">Nama Perusahaan</label>
                  <input
                      v-model="perusahaan.nama_perusahaan"
                      type="text"
                      class="form-control"
                      placeholder="Inputkan Nama Perusahaan"
                      id="nama-perusahaan">
                </div>
              </div>
              <div class="row">
                <div class="col-12 form-group">
                  <label for="npwp">NPWP</label>
                  <input
                      v-model="perusahaan.npwp"
                      type="text"
                      class="form-control"
                      placeholder="Inputkan npwp"
                      id="npwp">
                </div>
              </div>
              <div class="row">
                <div class="col-6 form-group">
                  <label for="nama-pkp">Nama Pkp</label>
                  <input
                      v-model="perusahaan.nama_pkp"
                      type="text"
                      class="form-control"
                      placeholder="Inputkan Nama Pkp"
                      id="nama-pkp">
                </div>
                <div class="col-6 form-group">
                  <label for="alamat-pkp">Alamat Pkp</label>
                  <input
                      v-model="perusahaan.alamat_pkp"
                      type="text"
                      class="form-control"
                      placeholder="Inputkan Alamat pkp"
                      id="alamat-pkp">
                </div>
              </div>
            </div>

            <div class="modal-footer pt-2">
              <button
                  @click="form = false"
                  type="button"
                  class="btn btn-white"
                  v-html="'Tutup'" />
              <button
                  :disabled="loading"
                  type="submit"
                  class="btn btn-primary"
                  v-html="'Simpan'"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import helper from "@/assets/js/helper";
import {mapActions, mapState} from "vuex";

export default {
  name: "FormPerusahaan",
  mixins: [helper],
  computed: {
    ...mapState(['errors', 'loading']),
    ...mapState('perusahaan', {
      title: state => state.form_title,
      perusahaan: state => state.perusahaan
    }),
    form: {
      get() {
        return this.$store.state.perusahaan.form
      },
      set(val) {
        return this.$store.commit('perusahaan/SET_FORM', val)
      }
    },
  },
  methods: {
    ...mapActions('perusahaan', ['submitPerusahaan', 'updatePerusahaan']),
    saveData() {
      if (this.perusahaan.id == '') {
        this.submitPerusahaan()
      } else {
        this.updatePerusahaan(this.perusahaan.id)
      }
    }
  }
}
</script>

<style scoped>

</style>
