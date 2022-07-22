<template>
  <div v-if="form">
    <div class="modal fade"
         tabindex="-1"
         style="display: block"
         role="dialog"
         v-if="form"
         :class="form ? 'show' : ''"
         @click="$event.target.classList.contains('modal') ? form=false : true"
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
                  <label for="code">Kode</label>
                  <input
                      v-model="option.code"
                      id="code"
                      type="text"
                      class="form-control">
                </div>
              </div>
              <div class="row">
                <div class="col-12 form-group">
                  <label for="value">Nilai</label>
                  <input
                      v-model="option.value"
                      id="value"
                      type="text"
                      class="form-control">
                </div>
              </div>
              <div class="row">
                <div class="col-12 form-group">
                  <label for="notes">Teks</label>
                  <input
                      v-model="option.text"
                      id="notes"
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
    <div class="modal-backdrop fade" :class="form ? 'show' : ''" />
  </div>
</template>

<script>
import helper from "@/assets/js/helper";
import {mapActions, mapState} from "vuex";

export default {
  name: "FormSelectOption",
  mixins: [helper],
  computed: {
    ...mapState(['errors', 'loading']),
    ...mapState('option', {
      title: state => state.form_title,
      option: state => state.option
    }),
    form: {
      get() {
        return this.$store.state.option.form
      },
      set(val) {
        return this.$store.commit('option/SET_FORM', val)
      }
    }
  },
  methods: {
    ...mapActions('option', ['submitOption', 'updateOption']),
    saveData() {
      if (this.option.id === '') {
        this.submitOption()
      } else {
        this.updateOption(this.option.id)
      }
    }
  }
}
</script>

<style scoped>

</style>
