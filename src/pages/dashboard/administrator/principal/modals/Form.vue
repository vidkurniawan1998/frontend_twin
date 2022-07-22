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
                  <label for="principal" class="form-label">Pilih Principal</label>
                  <selectize id="principal" v-model="user_principal.principal_id" data-placeholder="Pilih Principal" :disabled="loading" :settings="selectConfig">
                    <option :value="d.id" v-for="(d, i) in principal" :key="i">
                      {{ d.nama_principal }}
                    </option>
                  </selectize>
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
  data() {
    return {
      principal: []
    }
  },
  computed: {
    ...mapState(['errors', 'loading']),
    ...mapState('user_principal', {
      title: state => state.form_title,
      user_principal: state => state.user_principal
    }),
    form: {
      get() {
        return this.$store.state.user_principal.form
      },
      set(val) {
        return this.$store.commit('user_principal/SET_FORM', val)
      }
    }
  },
  methods: {
    ...mapActions('user_principal', ['updateUserPrincipal']),
    ...mapActions('principal', ['getListPrincipal']),
    saveData() {
      this.updateUserPrincipal()
    },
    _getPrincipal() {
      if (this.principal.length > 0) {
        return true;
      }

      this.getListPrincipal({}).then( res => {
        this.principal = res
      })
    }
  },
  created() {
    this._getPrincipal()
  }
}
</script>

<style scoped>

</style>
