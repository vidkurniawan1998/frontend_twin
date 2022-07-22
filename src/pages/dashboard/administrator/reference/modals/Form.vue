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
          <form v-on:submit.prevent="saveData()">
          <div class="modal-body default">
            <div class="row">
              <div class="col-12 form-group">
                <label for="code">Kode Reference</label>
                <input
                    v-model="reference.code"
                    id="code"
                    type="text"
                    class="form-control">
              </div>
            </div>
            <div class="row">
              <div class="col-12 form-group">
                <label for="value">Nilai Reference</label>
                <input
                    v-model="reference.value"
                    id="value"
                    type="text"
                    class="form-control">
              </div>
            </div>
            <div class="row">
              <div class="col-12 form-group">
                <label for="notes">Catatan</label>
                <input
                    v-model="reference.notes"
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
  </div>
</template>

<script>
import helper from "@/assets/js/helper";
import {mapActions, mapState} from "vuex";

export default {
  name: "FormReference",
  mixins: [helper],
  computed: {
    ...mapState(['errors', 'loading']),
    ...mapState('reference', {
      title: state => state.form_title,
      reference: state => state.reference
    }),
    form: {
      get() {
        return this.$store.state.reference.form
      },
      set(val) {
        return this.$store.commit('reference/SET_FORM', val)
      }
    }
  },
  methods: {
    ...mapActions('reference', ['submitReference', 'updateReference']),
    saveData() {
      if (this.reference.id === '') {
        this.submitReference()
      } else {
        this.updateReference(this.reference.id)
      }
    }
  }
}
</script>

<style scoped>

</style>
