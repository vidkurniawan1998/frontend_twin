<template>
  <div v-if="form">
    <div class="modal fade"
         tabindex="-1"
         style="display: block"
         role="dialog" v-if="form"
         :class="form ? 'show' : ''"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ title }}</h5>
            <button type="button" class="close" @click="form = false" v-html="ic('close')"/>
          </div>
          <form v-on:submit.prevent="saveData()">
          <div class="modal-body default">
            <div class="row">
              <div class="col-12 form-group">
                <label for="toko">Pilih Toko</label>
                <selectize id="toko" v-model="toko_no_limit.id_toko" data-placeholder="Pilih Toko">
                  <option
                      v-for="(toko, i) in list_toko"
                      :key="i" :value="toko.id">
                    {{ toko.no_acc }} - {{ toko.nama_toko }}
                  </option>
                </selectize>
              </div>
            </div>
            <div class="row">
              <div class="col-12 form-group">
                <label for="tipe">Pilih Tipe</label>
                <selectize id="tipe" v-model="toko_no_limit.tipe" data-placeholder="Pilih Tipe">
                  <option
                      v-for="(tp, i) in options"
                      :key="i" :value="tp.value">
                    {{ tp.text }}
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
  </div>
</template>

<script>
import {mapActions, mapState} from 'vuex'
import helper from "@/assets/js/helper.js";
export default {
  name: "FormTokoNoLimit",
  mixins: [helper],
  data() {
    return {
      options: [],
    }
  },
  computed: {
    ...mapState(['errors', 'loading']),
    ...mapState('toko_no_limit', {
      title: state => state.form_title,
      toko_no_limit: state => state.toko_no_limit
    }),
    ...mapState('toko', {
      list_toko: state => state.list_toko
    }),
    form: {
      get() {
        return this.$store.state.toko_no_limit.form
      },
      set(val) {
        return this.$store.commit('toko_no_limit/SET_FORM', val)
      }
    },
  },
  methods: {
    ...mapActions('toko', ['getListToko']),
    ...mapActions('toko_no_limit', ['submitTokoNoLimit', 'submitTokoNoLimit']),
    ...mapActions('option', ['getOptionsByCode']),
    saveData() {
      if (this.toko_no_limit.id == '') {
        this.submitTokoNoLimit()
      } else {
        this.submitTokoNoLimit(this.toko_no_limit.id)
      }
    },
    getOptions() {
      this.getOptionsByCode('whitelist_outlet').then(res => {
        this.options = res
      })
    }
  },
  created() {
    this.getListToko()
    this.getOptions()
  }
}
</script>

<style scoped>

</style>
