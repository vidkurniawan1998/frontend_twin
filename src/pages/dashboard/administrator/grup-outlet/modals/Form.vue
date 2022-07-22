<template>
  <div v-if="form">
    <div class="modal fade"
         tabindex="-1"
         style="display: block"
         role="dialog" v-if="form"
         :class="form ? 'show' : ''"
    >
      <div class="modal-dialog modal-md modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ title }}</h5>
            <button type="button" class="close" @click="form = false" v-html="ic('close')"/>
          </div>
          <form @submit.prevent="saveData">
            <div class="modal-body default">
              <div class="row">
                <div class="col-12 form-grup">
                  <label for="code">Nama grup</label>
                  <input
                      v-model="grup_toko_logistik.nama_grup"
                      id="code"
                      type="text"
                      class="form-control">
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
  name: "FormgrupTokoLogistik",
  mixins: [helper],
  computed: {
    ...mapState(['errors', 'loading']),
    ...mapState('grup_toko_logistik', {
      title: state => state.form_title,
      grup_toko_logistik: state => state.grup_toko_logistik
    }),
    form: {
      get() {
        return this.$store.state.grup_toko_logistik.form
      },
      set(val) {
        return this.$store.commit('grup_toko_logistik/SET_FORM', val)
      }
    }
  },
  methods: {
    ...mapActions('grup_toko_logistik', ['updateGrupLogistik']),
    saveData() {
      if (this.grup_toko_logistik.id != '') {
        this.updateGrupLogistik(this.grup_toko_logistik.id)
      }
    }
  }
}
</script>

<style scoped>

</style>
